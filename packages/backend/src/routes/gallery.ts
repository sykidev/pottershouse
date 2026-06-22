import { Router } from 'express';
import { db } from '../db/index.js';
import {
  galleryImages,
  content,
  insertGalleryImageSchema,
  updateGalleryImageSchema,
} from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq, desc, sql, inArray } from 'drizzle-orm';

const router = Router();

interface FeedframerPost {
  id: string;
  caption: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: string;
}

interface FeedframerResponse {
  username?: string;
  profilePictureUrl?: string;
  posts?: FeedframerPost[];
  pagination?: { nextCursor: string | null; hasMore: boolean; perPage: number };
}

// Safety cap so a runaway feed can never spin forever (50 pages * 6 ≈ 300 posts).
const MAX_SYNC_PAGES = 60;

/**
 * GET /api/gallery
 * Public: approved images only. Reads exclusively from our DB — no live
 * FeedFramer call — so visiting the page never hits the Instagram API.
 */
router.get('/', async (_req, res) => {
  try {
    const images = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.status, 'approved'))
      .orderBy(sql`${galleryImages.postedAt} desc nulls last`, desc(galleryImages.createdAt));
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

/**
 * GET /api/gallery/admin?status=pending
 * Auth: all images (optionally filtered by status) for the admin panel.
 */
router.get('/admin', requireAuth, async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const where =
      status && ['pending', 'approved', 'rejected'].includes(status)
        ? eq(galleryImages.status, status)
        : undefined;
    const images = await db
      .select()
      .from(galleryImages)
      .where(where as any)
      .orderBy(sql`${galleryImages.postedAt} desc nulls last`, desc(galleryImages.createdAt));
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

/**
 * POST /api/gallery/sync
 * Auth: pull EVERY post from Instagram (via FeedFramer), following the cursor
 * pagination to the end, and insert any new ones as 'pending'. Existing posts
 * (matched by sourceId) are skipped, so prior approve/reject decisions stick.
 */
router.post('/sync', requireAuth, async (_req, res) => {
  try {
    const token = process.env.FeedframerAPIToken;
    if (!token) {
      return res.status(400).json({ error: 'FeedframerAPIToken is not configured' });
    }

    const collected: FeedframerPost[] = [];
    let username = '';
    let profilePictureUrl = '';
    let cursor: string | null = null;
    let pages = 0;

    do {
      const url =
        `https://feedframer.com/api/v1/me?api_key=${encodeURIComponent(token)}` +
        (cursor ? `&cursor=${encodeURIComponent(cursor)}` : '');
      const resp = await fetch(url);
      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        console.error('FeedFramer sync error', resp.status, body.slice(0, 200));
        // If we already pulled some pages, keep what we have rather than failing.
        if (collected.length === 0) {
          return res.status(502).json({ error: 'Failed to fetch from Instagram' });
        }
        break;
      }
      const data = (await resp.json()) as FeedframerResponse;
      if (pages === 0) {
        username = data.username || '';
        profilePictureUrl = data.profilePictureUrl || '';
      }
      collected.push(...(data.posts || []));
      cursor = data.pagination?.hasMore ? data.pagination.nextCursor : null;
      pages += 1;
    } while (cursor && pages < MAX_SYNC_PAGES);

    // Normalize to gallery rows.
    const rows = collected
      .map((p) => ({
        source: 'instagram' as const,
        sourceId: p.id,
        imageUrl: p.mediaType === 'VIDEO' && p.thumbnailUrl ? p.thumbnailUrl : p.mediaUrl,
        permalink: p.permalink,
        caption: p.caption || '',
        mediaType: p.mediaType,
        postedAt: p.timestamp ? new Date(p.timestamp) : null,
        status: 'pending' as const,
      }))
      .filter((r) => !!r.imageUrl && !!r.sourceId);

    let added = 0;
    if (rows.length > 0) {
      const inserted = await db
        .insert(galleryImages)
        .values(rows)
        .onConflictDoNothing({ target: galleryImages.sourceId })
        .returning({ id: galleryImages.id });
      added = inserted.length;
    }

    // Stash the Instagram profile on the gallery content section so the public
    // pages can show @username / avatar without a live API call.
    if (username || profilePictureUrl) {
      const [existing] = await db.select().from(content).where(eq(content.section, 'gallery'));
      const merged = { ...(existing?.data || {}), igUsername: username, igProfilePictureUrl: profilePictureUrl };
      if (existing) {
        await db.update(content).set({ data: merged, updatedAt: new Date() }).where(eq(content.section, 'gallery'));
      } else {
        await db.insert(content).values({ section: 'gallery', data: merged });
      }
    }

    res.json({
      added,
      skipped: rows.length - added,
      scanned: collected.length,
      pages,
      reachedCap: pages >= MAX_SYNC_PAGES,
      username,
    });
  } catch (error) {
    console.error('Gallery sync error:', error);
    res.status(500).json({ error: 'Failed to sync gallery' });
  }
});

/**
 * POST /api/gallery
 * Auth: manually add an uploaded image. Manual additions are approved
 * immediately since the admin is adding them on purpose.
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = insertGalleryImageSchema.parse({
      ...req.body,
      source: 'manual',
      status: req.body.status ?? 'approved',
    });
    const [image] = await db.insert(galleryImages).values(data).returning();
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ error: 'Invalid gallery image data' });
  }
});

/**
 * PATCH /api/gallery/:id
 * Auth: update an image's status (approve/reject), caption, or tag.
 */
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const data = updateGalleryImageSchema.parse(req.body);
    const [image] = await db
      .update(galleryImages)
      .set(data)
      .where(eq(galleryImages.id, parseInt(req.params.id)))
      .returning();
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json(image);
  } catch (error) {
    res.status(400).json({ error: 'Invalid update data' });
  }
});

/**
 * POST /api/gallery/bulk
 * Auth: approve / reject / delete many images at once. { ids, action }.
 */
router.post('/bulk', requireAuth, async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids.map((n: any) => parseInt(n)).filter(Number.isFinite) : [];
    const action = req.body.action as string;
    if (ids.length === 0) return res.status(400).json({ error: 'No ids provided' });

    if (action === 'delete') {
      await db.delete(galleryImages).where(inArray(galleryImages.id, ids));
    } else if (action === 'approve' || action === 'reject') {
      await db
        .update(galleryImages)
        .set({ status: action === 'approve' ? 'approved' : 'rejected' })
        .where(inArray(galleryImages.id, ids));
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
    res.json({ updated: ids.length, action });
  } catch (error) {
    res.status(400).json({ error: 'Bulk action failed' });
  }
});

/**
 * DELETE /api/gallery/:id — Auth.
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.delete(galleryImages).where(eq(galleryImages.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;

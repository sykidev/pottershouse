import { Router } from 'express';
import { db } from '../db/index.js';
import { sermons, insertSermonSchema } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

interface YtVideo {
  videoId: string;
  title: string;
  description: string;
  published: string;
  thumbnail: string;
  channelTitle: string;
}

// YouTube's API returns snippet text with HTML entities (e.g. FATHER&#39;S DAY),
// so decode them before storing or they render literally on the sermon page.
function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// Fetch a channel's COMPLETED live broadcasts via YouTube Data API v3.
// Requires env YoutubeApiKey + YoutubeChannelId. Uses only an API key (public data).
async function fetchCompletedBroadcasts(): Promise<YtVideo[]> {
  const key = process.env.YoutubeApiKey;
  const channelId = process.env.YoutubeChannelId;
  if (!key || !channelId) {
    throw new Error('YouTube is not configured (missing API key or channel ID).');
  }

  const videos: YtVideo[] = [];
  let pageToken = '';
  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('eventType', 'completed');
    url.searchParams.set('type', 'video');
    url.searchParams.set('order', 'date');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', key);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const resp = await fetch(url);
    if (!resp.ok) {
      const body = await resp.json().catch(() => ({} as any));
      throw new Error(body?.error?.message || `YouTube API error (${resp.status})`);
    }
    const data = await resp.json();
    for (const item of data.items || []) {
      if (!item.id?.videoId) continue;
      videos.push({
        videoId: item.id.videoId,
        title: decodeEntities(item.snippet?.title || 'Untitled'),
        description: decodeEntities(item.snippet?.description || ''),
        published: item.snippet?.publishedAt || '',
        thumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          '',
        channelTitle: decodeEntities(item.snippet?.channelTitle || ''),
      });
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken && videos.length < 300);

  return videos;
}

// Import completed live broadcasts into the sermons table (skips already-imported).
// Shared by the admin "Sync from YouTube" button and the scheduled 6-hour job.
export async function syncCompletedBroadcasts(): Promise<{ imported: number; found: number }> {
  const videos = await fetchCompletedBroadcasts();
  const existing = await db.select({ videoUrl: sermons.videoUrl }).from(sermons);
  const existingUrls = new Set(existing.map((e) => e.videoUrl));

  let imported = 0;
  for (const v of videos) {
    const videoUrl = `https://www.youtube.com/watch?v=${v.videoId}`;
    if (existingUrls.has(videoUrl)) continue;
    await db.insert(sermons).values({
      title: v.title,
      speaker: v.channelTitle || "The Potters' Apostolic Ministries",
      date: v.published ? v.published.slice(0, 10) : new Date().toISOString().slice(0, 10),
      description: v.description || v.title,
      videoUrl,
      imageUrl: v.thumbnail || null,
    });
    imported++;
  }

  return { imported, found: videos.length };
}

router.post('/sync-youtube', requireAuth, async (req, res) => {
  try {
    const result = await syncCompletedBroadcasts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Sync failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const allSermons = await db.select().from(sermons).orderBy(desc(sermons.date));
    res.json(allSermons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [sermon] = await db.select().from(sermons).where(eq(sermons.id, parseInt(req.params.id)));
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    res.json(sermon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sermon' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = insertSermonSchema.parse(req.body);
    const [sermon] = await db.insert(sermons).values(data).returning();
    res.status(201).json(sermon);
  } catch (error) {
    res.status(400).json({ error: 'Invalid sermon data' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = insertSermonSchema.parse(req.body);
    const [sermon] = await db
      .update(sermons)
      .set(data)
      .where(eq(sermons.id, parseInt(req.params.id)))
      .returning();
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    res.json(sermon);
  } catch (error) {
    res.status(400).json({ error: 'Invalid sermon data' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.delete(sermons).where(eq(sermons.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

export default router;

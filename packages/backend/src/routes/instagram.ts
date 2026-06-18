import { Router } from 'express';

const router = Router();

interface FeedframerPost {
  id: string;
  caption: string | null;
  altText: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: string;
  likeCount?: number;
  commentsCount?: number;
}

/**
 * GET /api/social/instagram
 * Fetches the church's Instagram feed via FeedFramer (handles the Meta API).
 * Requires env FeedframerAPIToken. Returns a normalized post list.
 */
router.get('/instagram', async (_req, res) => {
  try {
    const token = process.env.FeedframerAPIToken;
    if (!token) {
      return res.json({ username: '', profilePictureUrl: '', posts: [] });
    }

    const resp = await fetch(`https://feedframer.com/api/v1/me?api_key=${encodeURIComponent(token)}`);
    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      console.error('FeedFramer error', resp.status, body.slice(0, 200));
      return res.status(502).json({ error: 'Failed to fetch Instagram feed' });
    }

    const data = await resp.json();
    const posts = (data.posts as FeedframerPost[] | undefined) || [];

    const normalized = posts
      .map((p) => ({
        id: p.id,
        caption: p.caption || '',
        permalink: p.permalink,
        mediaType: p.mediaType,
        timestamp: p.timestamp,
        // Use the video poster for videos, the media itself for images.
        imageUrl: p.mediaType === 'VIDEO' && p.thumbnailUrl ? p.thumbnailUrl : p.mediaUrl,
      }))
      .filter((p) => !!p.imageUrl);

    // Cache at the edge/CDN for an hour to limit FeedFramer calls.
    res.set('Cache-Control', 'public, max-age=300, s-maxage=3600');
    res.json({
      username: data.username || '',
      profilePictureUrl: data.profilePictureUrl || '',
      posts: normalized,
    });
  } catch (error) {
    console.error('Instagram feed error:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram feed' });
  }
});

export default router;

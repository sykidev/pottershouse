import { Router } from 'express';

const router = Router();

interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  description: string;
  url: string;
}

router.get('/youtube', async (req, res) => {
  try {
    const channelId = req.query.channelId as string;

    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(feedUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch YouTube feed' });
    }

    const xmlText = await response.text();

    const channelTitleMatch = xmlText.match(/<title>([^<]+)<\/title>/);
    const channelTitle = channelTitleMatch ? channelTitleMatch[1] : '';

    const entryRegex = /<entry>(.*?)<\/entry>/gs;
    const entries = [...xmlText.matchAll(entryRegex)];

    const videos: YouTubeVideo[] = entries.map(entryMatch => {
      const entry = entryMatch[1];

      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const descriptionMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);
      const thumbnailMatch = entry.match(/<media:thumbnail url="([^"]+)"/);

      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      const title = titleMatch ? titleMatch[1] : '';
      const published = publishedMatch ? publishedMatch[1] : '';
      const description = descriptionMatch ? descriptionMatch[1] : '';
      const thumbnail = thumbnailMatch ? thumbnailMatch[1] : '';

      return {
        videoId,
        title,
        published,
        thumbnail,
        description,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });

    res.json({
      channelTitle,
      videos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

export default router;

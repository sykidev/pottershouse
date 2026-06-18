import { Router } from 'express';

const router = Router();

interface InstagramPost {
  id: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string;
}

interface InstagramFeedResponse {
  username: string;
  posts: InstagramPost[];
}

/**
 * GET /api/social/instagram
 * Fetches recent Instagram posts using Instagram Basic Display API or Graph API
 *
 * Requirements:
 * 1. Set INSTAGRAM_ACCESS_TOKEN in your .env file
 * 2. Optional: Set INSTAGRAM_USER_ID (if using Graph API)
 *
 * To get an access token:
 * - Instagram Basic Display API: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
 * - Instagram Graph API (for business accounts): https://developers.facebook.com/docs/instagram-api/getting-started
 */
router.get('/instagram', async (req, res) => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!accessToken) {
      // Return mock data if no token configured
      const mockData: InstagramFeedResponse = {
        username: 'thepottersapostolic',
        posts: [
          {
            id: '1',
            media_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=400&fit=crop',
            media_type: 'IMAGE',
            caption: 'Sunday worship was powerful! Join us next week. #SundayService',
            permalink: 'https://instagram.com/p/example1',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 234,
            comments_count: 18,
          },
          {
            id: '2',
            media_url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=400&fit=crop',
            media_type: 'IMAGE',
            caption: 'Youth retreat was amazing! #YouthMinistry',
            permalink: 'https://instagram.com/p/example2',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 189,
            comments_count: 12,
          },
          {
            id: '3',
            media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            media_type: 'IMAGE',
            caption: 'Community outreach serving with love. #CommunityService',
            permalink: 'https://instagram.com/p/example3',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 312,
            comments_count: 24,
          },
          {
            id: '4',
            media_url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=400&fit=crop',
            media_type: 'IMAGE',
            caption: 'Bible study tonight! #BibleStudy',
            permalink: 'https://instagram.com/p/example4',
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 156,
            comments_count: 9,
          },
          {
            id: '5',
            media_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop',
            media_type: 'IMAGE',
            caption: 'Worship night filled with praise! #WorshipNight',
            permalink: 'https://instagram.com/p/example5',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 267,
            comments_count: 15,
          },
          {
            id: '6',
            media_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop',
            media_type: 'IMAGE',
            caption: 'Join us this Sunday! #ChurchLife',
            permalink: 'https://instagram.com/p/example6',
            timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 198,
            comments_count: 11,
          },
        ],
      };
      return res.json(mockData);
    }

    // Fetch real Instagram data
    // Using Instagram Basic Display API
    const endpoint = userId
      ? `https://graph.instagram.com/${userId}/media`
      : 'https://graph.instagram.com/me/media';

    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count';
    const url = `${endpoint}?fields=${fields}&access_token=${accessToken}&limit=12`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      console.error('Instagram API error:', error);
      throw new Error('Failed to fetch Instagram data');
    }

    const data = await response.json();

    // Fetch username separately
    let username = 'thepottersapostolic';
    try {
      const userEndpoint = userId
        ? `https://graph.instagram.com/${userId}`
        : 'https://graph.instagram.com/me';
      const userResponse = await fetch(`${userEndpoint}?fields=username&access_token=${accessToken}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        username = userData.username;
      }
    } catch (err) {
      console.error('Failed to fetch username:', err);
    }

    const result: InstagramFeedResponse = {
      username,
      posts: data.data || [],
    };

    res.json(result);
  } catch (error) {
    console.error('Instagram feed error:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram feed' });
  }
});

export default router;

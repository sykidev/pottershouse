# Social Media Integration Setup

This guide explains how to connect your church website to Instagram and YouTube for automatic content feeds.

## YouTube Integration

The YouTube integration is already working! It fetches videos from your YouTube channel RSS feed without requiring an API key.

### Setup YouTube Channel

1. Find your YouTube channel ID:
   - Go to your YouTube channel
   - Click on your profile icon → Settings → Advanced settings
   - Copy your Channel ID (starts with `UC...`)

2. Update the HomePage component:
   - Open `packages/frontend/src/pages/HomePage.tsx`
   - Find the `<YouTubeChannel>` component
   - Replace `"YOUR_YOUTUBE_CHANNEL_ID"` with your actual channel ID:
   ```tsx
   <YouTubeChannel
     channelId="UCyourActualChannelID"
     title="Latest Messages"
     description="Watch our most recent sermons and teachings"
     limit={3}
   />
   ```

3. That's it! The YouTube feed will now show your latest videos.

---

## Instagram Integration

Instagram requires an access token to fetch posts. There are two options:

### Option 1: Instagram Basic Display API (Recommended for Personal Accounts)

**Best for:** Personal Instagram accounts, simpler setup

1. **Create a Facebook App:**
   - Go to https://developers.facebook.com/apps/
   - Click "Create App"
   - Choose "Consumer" as app type
   - Fill in app name and contact email

2. **Add Instagram Basic Display:**
   - In your app dashboard, click "Add Product"
   - Find "Instagram Basic Display" and click "Set Up"

3. **Configure Instagram Basic Display:**
   - Go to Basic Display → Settings
   - Click "Create New App"
   - Add Valid OAuth Redirect URIs:
     - `https://localhost/`
     - `https://yourdomain.com/` (your production domain)
   - Save changes

4. **Add Instagram Test User:**
   - Scroll down to "User Token Generator"
   - Click "Add Instagram Test User"
   - Go to your Instagram app settings
   - Accept the tester invitation

5. **Generate Access Token:**
   - In User Token Generator, click "Generate Token"
   - Log in with your Instagram account
   - Authorize the app
   - Copy the generated access token

6. **Add Token to Environment:**
   - Open `packages/backend/.env`
   - Add this line:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_access_token_here
   ```

7. **Token Refresh (Important!):**
   - Basic Display tokens expire after 60 days
   - Before expiration, generate a long-lived token (60 days → 60 days renewal):
   ```bash
   curl -i -X GET "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_TOKEN"
   ```
   - Set up a reminder to refresh every 50 days

### Option 2: Instagram Graph API (For Business/Creator Accounts)

**Best for:** Instagram Business or Creator accounts, more features, longer-lived tokens

1. **Convert to Business Account:**
   - In Instagram app: Settings → Account → Switch to Professional Account
   - Choose "Business" or "Creator"
   - Connect to a Facebook Page

2. **Create Facebook App:**
   - Go to https://developers.facebook.com/apps/
   - Create new app (Business type)
   - Add "Instagram Graph API" product

3. **Get Page Access Token:**
   - Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Select your app
   - Select your Facebook Page
   - Add permissions: `instagram_basic`, `pages_read_engagement`, `pages_show_list`
   - Generate token

4. **Get Instagram Business Account ID:**
   ```bash
   curl -i -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_PAGE_TOKEN"
   ```
   - Find your page in the response
   - Use the page's access token for next step:
   ```bash
   curl -i -X GET "https://graph.facebook.com/v18.0/PAGE_ID?fields=instagram_business_account&access_token=PAGE_TOKEN"
   ```
   - Copy the `instagram_business_account` id

5. **Add to Environment:**
   ```
   INSTAGRAM_ACCESS_TOKEN=your_page_access_token
   INSTAGRAM_USER_ID=your_instagram_business_account_id
   ```

6. **Generate Long-Lived Token:**
   - Page tokens from Graph API Explorer expire in 1 hour
   - Exchange for 60-day token:
   ```bash
   curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
   ```

---

## Update Frontend with Your Social Media Handles

### 1. Update Instagram Username

Edit `packages/frontend/src/components/Footer.tsx`:
```tsx
<a
  href="https://instagram.com/YOUR_INSTAGRAM_USERNAME"
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  <Instagram className="w-5 h-5" />
</a>
```

### 2. Update YouTube Channel Link

Edit `packages/frontend/src/components/Footer.tsx`:
```tsx
<a
  href="https://youtube.com/@YOUR_YOUTUBE_HANDLE"
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  <Youtube className="w-5 h-5" />
</a>
```

### 3. Update Facebook Page (Optional)

If you have a Facebook page, update it in the Footer as well.

---

## Testing

1. **Start the backend:**
   ```bash
   cd packages/backend
   pnpm dev
   ```

2. **Start the frontend:**
   ```bash
   cd packages/frontend
   pnpm dev
   ```

3. **Test Instagram endpoint:**
   - Without token: Visit http://localhost:3000/api/social/instagram
   - You should see mock data
   - With token: The endpoint will return your actual Instagram posts

4. **Test YouTube feed:**
   - Visit your homepage
   - Scroll to the "Latest Messages" section
   - You should see your YouTube videos

---

## Troubleshooting

### Instagram Not Loading

1. **Check token in .env file:**
   ```bash
   cat packages/backend/.env | grep INSTAGRAM
   ```

2. **Test token manually:**
   ```bash
   curl "https://graph.instagram.com/me/media?fields=id,caption&access_token=YOUR_TOKEN"
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for network errors
   - Check the `/api/social/instagram` request

### YouTube Videos Not Showing

1. **Verify channel ID:**
   - It should start with `UC`
   - Test the RSS feed: `https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID`

2. **Check CORS:**
   - YouTube RSS feed should work without issues
   - If blocked, check your backend CORS settings

---

## Security Notes

1. **Never commit tokens to Git:**
   - `.env` files are already in `.gitignore`
   - Double-check before committing

2. **Rotate tokens regularly:**
   - Set calendar reminders for token refresh
   - Instagram tokens expire every 60 days

3. **Use environment-specific tokens:**
   - Development: Use test accounts
   - Production: Use real accounts

---

## Production Deployment

### Environment Variables to Set:

```bash
# Instagram
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
INSTAGRAM_USER_ID=your_instagram_business_id (for Graph API only)

# Session (change the secret!)
SESSION_SECRET=your_random_secret_here

# CORS
FRONTEND_URL=https://yourdomain.com
```

### Post-Deployment Checklist:

- [ ] Instagram feed showing real posts
- [ ] YouTube videos loading correctly
- [ ] Social media links in footer working
- [ ] Set token refresh reminder (50 days)
- [ ] Test on mobile devices
- [ ] Verify images loading properly

---

## Need Help?

- **Instagram API Docs:** https://developers.facebook.com/docs/instagram-basic-display-api
- **YouTube RSS Feeds:** https://support.google.com/youtube/answer/9340294
- **Token Debugging:** https://developers.facebook.com/tools/debug/accesstoken/

For issues specific to this codebase, check the backend logs or open an issue in your repository.

# The Potters' Apostolic Ministries - Church Website

> "We are the clay, You are the Potter; we are all the work of Your hand." - Isaiah 64:8

A modern, full-stack church website built with React, TypeScript, and PostgreSQL featuring integrated Instagram and YouTube feeds, admin content management, and beautiful pottery-inspired design.

![Potter's Theme](https://img.shields.io/badge/Theme-Potter's%20Clay-8B4513)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

---

## ✨ Features

### For Visitors
- 🏠 **Beautiful Homepage** - Full-screen hero, service countdown, events, sermons
- 📺 **YouTube Integration** - Automatic sermon video feed from your channel
- 📸 **Instagram Feed** - Live posts from your Instagram account
- 📅 **Events Calendar** - Upcoming events with details and images
- 🎤 **Sermon Archive** - Searchable library of past messages
- 👥 **Team Directory** - Meet your pastoral staff and leaders
- 📱 **Mobile Responsive** - Perfect experience on all devices

### For Administrators
- 🔐 **Secure Admin Panel** - Session-based authentication
- ✏️ **Content Management** - Edit sermons, events, announcements, team
- 🎨 **Customizable Sections** - Update hero text, about page, contact info
- 📊 **Dashboard** - View content statistics at a glance
- 🖼️ **Image Uploads** - Presigned URL upload to cloud storage

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Wouter, TanStack Query
- **Backend**: Express 5, Pino logger, express-session
- **Database**: PostgreSQL, Drizzle ORM
- **Validation**: Zod v4, drizzle-zod
- **Social**: Instagram API, YouTube RSS feeds
- **Build**: esbuild (server), Vite (client)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and **pnpm** 9+
- **PostgreSQL** 16+ database
- (Optional) Instagram access token
- (Optional) YouTube channel ID

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   
   Create `.env` in the project root:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/potters_db

   # Admin Authentication (CHANGE THESE!)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password

   # Session (generate with: openssl rand -base64 32)
   SESSION_SECRET=your-random-secret-here

   # Instagram (optional - see SOCIAL_MEDIA_SETUP.md)
   INSTAGRAM_ACCESS_TOKEN=
   INSTAGRAM_USER_ID=

   # Frontend (production only)
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Set up database:**
   ```bash
   # Create database
   createdb potters_db

   # Run migrations
   cd packages/backend
   pnpm db:migrate

   # Seed with Potter's placeholder data
   pnpm db:seed:potters
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1 - Backend (port 3000)
   cd packages/backend
   pnpm dev

   # Terminal 2 - Frontend (port 5173)
   cd packages/frontend
   pnpm dev
   ```

5. **Access the site:**
   - **Public site**: http://localhost:5173
   - **Admin panel**: http://localhost:5173/admin
   - **Default login**: `admin` / `church2024!` (change this!)

---

## 📝 Next Steps - Customize Your Site

### 1. Replace the Logo

Save your church logo to:
```
packages/frontend/public/logo.png
```

The Potter's logo (hands shaping clay + book + eagle) should go here.

### 2. Add Your Content

Access the admin panel at http://localhost:5173/admin and replace the placeholder data:

- **Sermons** - Add your actual messages (upload videos to YouTube first)
- **Events** - Add upcoming church events
- **Team** - Add your pastoral staff and leaders
- **Announcements** - Create announcements (mark one as "Active" to show on homepage)
- **About** - Update church history, mission, vision
- **Contact** - Add real address, phone, email, service times

### 3. Connect YouTube

1. Find your YouTube channel ID (starts with `UC...`)
2. Open `packages/frontend/src/pages/HomePage.tsx`
3. Find line ~234: `<YouTubeChannel channelId="YOUR_YOUTUBE_CHANNEL_ID" />`
4. Replace with your actual channel ID

### 4. Connect Instagram (Optional)

Follow the detailed guide in [`SOCIAL_MEDIA_SETUP.md`](./SOCIAL_MEDIA_SETUP.md)

- Get an Instagram access token
- Add to `.env` file
- Site will automatically fetch your real posts

### 5. Update Social Media Links

Edit `packages/frontend/src/components/Footer.tsx`:
- Replace Instagram URL with `https://instagram.com/YOUR_HANDLE`
- Replace YouTube URL with your channel link
- Add Facebook page if desired

---

## 📁 Project Structure

```
potters/
├── packages/
│   ├── frontend/              # React app
│   │   ├── src/
│   │   │   ├── components/    # Reusable components
│   │   │   ├── pages/         # Pages (Home, About, Sermons, etc.)
│   │   │   └── lib/           # Utilities
│   │   └── public/
│   │       └── logo.png       # ← Replace with your logo
│   │
│   └── backend/               # Express API
│       ├── src/
│       │   ├── routes/        # API endpoints
│       │   └── db/
│       │       └── seed-potters.ts  # Placeholder data
│       └── package.json
│
├── .env                       # Your configuration (create this!)
├── SOCIAL_MEDIA_SETUP.md      # Instagram & YouTube setup guide
├── REDESIGN_SUMMARY.md        # Design documentation
└── README.md                  # This file
```

---

## 🎨 Design

The site uses a **Potter's theme** with earthy colors inspired by pottery and clay:

- **Clay Brown** (#8B4513) - Primary color
- **Bronze/Gold** (#CD7F32) - Accent color
- **Deep Blue** (#1e3a8a) - Glaze accent

All design choices reflect the biblical foundation: *"We are the clay, You are the Potter"* (Isaiah 64:8)

---

## 🔐 Security

**Important**: Change the default admin password!

1. Go to http://localhost:5173/admin
2. Login with `admin` / `church2024!`
3. Change the password through the admin panel
4. Update `ADMIN_PASSWORD` in `.env`
5. Generate a secure `SESSION_SECRET`: `openssl rand -base64 32`

---

## 🚢 Deployment

See the [deployment section in the full README](./README-FULL.md) for detailed production deployment instructions.

Quick checklist:
- [ ] Change admin password
- [ ] Set production environment variables
- [ ] Run database migrations
- [ ] Seed database with `pnpm db:seed:potters`
- [ ] Upload your logo
- [ ] Configure YouTube channel ID
- [ ] Set up Instagram API (optional)
- [ ] Update social media links
- [ ] Test on mobile devices

---

## 📖 Documentation

- **[SOCIAL_MEDIA_SETUP.md](./SOCIAL_MEDIA_SETUP.md)** - How to connect Instagram & YouTube
- **[REDESIGN_SUMMARY.md](./REDESIGN_SUMMARY.md)** - Design features and changes
- **Admin Panel** - http://localhost:5173/admin (when running)

---

## 🐛 Common Issues

**Can't connect to database**
```bash
# Check PostgreSQL is running
pg_isready

# Create database if missing
createdb potters_db
```

**Instagram not loading**
- Check if `INSTAGRAM_ACCESS_TOKEN` is in `.env`
- Without token, it shows placeholder images (this is normal for development)
- See `SOCIAL_MEDIA_SETUP.md` for token setup

**YouTube videos not showing**
- Make sure you updated the channel ID in `HomePage.tsx`
- Channel ID should start with `UC...`

---

## 🙏 Support

When you provide your real content, I can help you:
- Import sermons, events, and team data via admin panel
- Set up Instagram and YouTube integrations
- Customize any design elements
- Deploy to your hosting provider

---

**Built for The Potters' Apostolic Ministries**

*"We are the clay, You are the Potter; we are all the work of Your hand." - Isaiah 64:8*
# pottershouse

# Getting Started with The Potters' Apostolic Ministries Website

This is a **quick start guide** to get your website running in 10 minutes.

## Prerequisites Installed?

- [ ] Node.js 20+ (`node --version`)
- [ ] pnpm 9+ (`pnpm --version`)
- [ ] PostgreSQL 16+ (`postgres --version`)

If not, install them first!

---

## Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/corneliussaiki/potters
pnpm install
```

---

## Step 2: Configure Environment (3 minutes)

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update these lines:
   ```env
   DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/potters_db
   ADMIN_PASSWORD=ChooseASecurePassword
   SESSION_SECRET=GenerateRandomString
   ```

   Generate session secret:
   ```bash
   openssl rand -base64 32
   ```

---

## Step 3: Set Up Database (3 minutes)

```bash
# Create the database
createdb potters_db

# Run migrations
cd packages/backend
pnpm db:migrate

# Seed with placeholder data
pnpm db:seed:potters
```

You should see: "✅ Seed complete for The Potters' Apostolic Ministries!"

---

## Step 4: Start the Website (1 minute)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd packages/backend
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
cd packages/frontend  
pnpm dev
```

---

## Step 5: Access Your Site! (1 minute)

- 🌐 **Public Site**: http://localhost:5173
- 🔐 **Admin Panel**: http://localhost:5173/admin
  - Username: `admin`
  - Password: (whatever you set in .env)

---

## What You'll See

The site is populated with **placeholder data**:
- Sample sermons with generic titles
- Sample events
- Sample team members
- One active announcement

All of this is meant to be replaced with YOUR real content.

---

## Next: Add Your Real Content

### Via Admin Panel (Easiest)

1. Go to http://localhost:5173/admin
2. Login
3. Click on each section (Sermons, Events, Team, etc.)
4. Delete the placeholder items
5. Add your real content

### What Content to Prepare

You mentioned you'll provide content. Here's what I need from you:

#### **Sermons** (3-5 to start)
- Title
- Speaker name
- Date
- Description
- YouTube video URL (upload to YouTube first!)
- Thumbnail image (optional)

#### **Events** (upcoming events)
- Event name
- Description
- Date & time
- Location
- Event image (optional, 800x600px recommended)

#### **Team Members** (pastoral staff)
- Full name
- Role/title
- Bio (2-3 sentences)
- Headshot photo (400x400px recommended)

#### **About Page**
- Church history (paragraph)
- Mission statement
- Vision statement
- Core values (3-5 bullet points)

#### **Contact Info**
- Physical address
- Phone number
- Email address
- Service times
- Google Maps link

When you're ready, share this info and I'll help you add it to the site!

---

## Also Update

1. **Logo**: Replace `packages/frontend/public/logo.png` with your actual logo
2. **YouTube Channel**: Update channel ID in `packages/frontend/src/pages/HomePage.tsx`
3. **Social Links**: Update Instagram/YouTube/Facebook URLs in Footer.tsx

---

## Need Help?

- **Instagram setup**: See `SOCIAL_MEDIA_SETUP.md`
- **Full documentation**: See `README.md`
- **Design info**: See `REDESIGN_SUMMARY.md`

---

**That's it! Your website is now running locally. Ready for your real content!**

# Quick Setup Guide

Follow these steps to get the church website running locally.

## 1. Prerequisites

Make sure you have installed:
- Node.js 20 or higher
- PostgreSQL (running on your machine)
- pnpm (`npm install -g pnpm`)

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Create Database

Open PostgreSQL and create a database:

```bash
# Using psql
psql -U postgres

# In psql terminal:
CREATE DATABASE fncfc;
\q
```

Or use a GUI tool like pgAdmin or Postico.

## 4. Configure Environment

The `.env` file is already created with default settings. Update if needed:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fncfc
ADMIN_USERNAME=admin
ADMIN_PASSWORD=church2024!
```

**Important:** Change the username and password for production!

## 5. Set Up Database Schema

```bash
# Generate migrations (already done)
pnpm db:generate

# Run migrations to create tables
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

## 6. Start Development Servers

```bash
pnpm dev
```

This starts:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

## 7. Access Admin Panel

Visit http://localhost:5173/admin/login

Login with:
- Username: `admin`
- Password: `church2024!`

## Troubleshooting

### Database connection failed
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Verify the database exists: `psql -U postgres -l`

### Port already in use
- Frontend (5173): Check if another Vite app is running
- Backend (3000): Change PORT in `.env`

### Migration errors
- Drop and recreate the database if needed:
  ```sql
  DROP DATABASE fncfc;
  CREATE DATABASE fncfc;
  ```
- Then run migrations again: `pnpm db:migrate`

## Next Steps

1. Update the content in the admin panel
2. Add your own images (use image URLs from Unsplash or upload to a CDN)
3. Update contact information
4. Add real sermon video URLs (YouTube, Vimeo, etc.)
5. Customize the Google Form embed URL in the Connect page

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Use a strong `SESSION_SECRET`
3. Update admin credentials
4. Use a managed PostgreSQL instance
5. Deploy frontend to Vercel/Netlify
6. Deploy backend to Railway/Render/Fly.io
7. Set up object storage (AWS S3, Cloudflare R2) for image uploads

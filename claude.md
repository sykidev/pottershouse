Build a full-stack mobile-responsive church website called "The Potters' Apostolic Ministries". Use a pnpm monorepo with two artifacts: a React+Vite frontend and an Express 5 API backend.

## TECH STACK
- Frontend: React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Wouter + TanStack Query
- Backend: Express 5 + express-session + Pino logger
- Database: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4) + drizzle-zod
- Image uploads: Two-step presigned URL flow to object storage
- Auth: Session-based, credentials from env vars ADMIN_USERNAME / ADMIN_PASSWORD (defaults: admin / church2024!)
- API contract: OpenAPI spec → Orval codegen (React Query hooks + Zod schemas)
- Build: esbuild for server, Vite for client

## DATABASE SCHEMA (no gallery table)
Tables: sermons (id, title, speaker, date, description, videoUrl, imageUrl, createdAt), events (id, title, description, date, time, location, imageUrl, createdAt), announcements (id, title, body, active boolean, createdAt), team (id, name, role, bio, imageUrl, createdAt), content (id, section unique string, data JSONB, updatedAt).

Seed with: 3 sermons, 4 events, 3 announcements (one titled "Welcome to Our New Website!" with active=true), 3 team members.

## BACKEND API ROUTES
- POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- Full CRUD: /api/sermons, /api/events, /api/announcements, /api/team
- GET /api/sermons/youtube?channelId= → fetches https://www.youtube.com/feeds/videos.xml?channel_id={channelId} using built-in fetch, parses XML with regex (no library needed, no API key), returns { channelTitle: string, videos: Array<{ videoId, title, published, thumbnail, description, url }> }
- GET/PUT /api/content/:section → auto-creates section with data:{} if missing
- GET /api/stats → returns { sermons, events, announcements, teamMembers } counts (no gallery)
- POST /api/storage/uploads/request-url → presigned upload URL

## PUBLIC SITE PAGES

**Navbar**: Church name logo (left) + links Home · About · Sermons · Events · Connect + "Visit Us" button (right). No gallery link, no contact link.

**Home page**: 
1. Full-height hero section with background image overlay, church name in large serif font, subtitle, CTA button linking to /contact
2. Immediately below hero: ServiceCountdown component — a crimson band showing "NEXT SUNDAY SERVICE" label, service time (from CMS contact.serviceTimes field, default "10:00 AM"), and four monospace countdown boxes (Days · Hours · Mins · Secs) counting to next Sunday at that time, updating every second via setInterval. "Get directions →" link at bottom.
3. Latest announcement banner (crimson strip with "LATEST" badge
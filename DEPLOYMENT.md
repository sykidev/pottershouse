# Deployment Guide

This guide covers deploying the church website to production.

## Architecture

- **Frontend (React/Vite):** Deploy to Vercel, Netlify, or Cloudflare Pages
- **Backend (Express API):** Deploy to Railway, Render, or Fly.io
- **Database:** Use a managed PostgreSQL service
- **File Storage:** AWS S3, Cloudflare R2, or similar for image uploads

## Option 1: Railway (Easiest)

Railway can host both frontend and backend with PostgreSQL.

### Backend Deployment

1. Create a new project on Railway
2. Add PostgreSQL plugin
3. Deploy backend:
   ```bash
   cd packages/backend
   git init
   git add .
   git commit -m "Initial commit"
   ```
4. Connect to Railway and deploy
5. Set environment variables:
   - `DATABASE_URL` (auto-provided by Railway)
   - `SESSION_SECRET` (generate a random string)
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (will be your frontend URL)

6. Run migrations:
   ```bash
   railway run pnpm db:migrate
   railway run pnpm db:seed
   ```

### Frontend Deployment

1. Update `packages/frontend/vite.config.ts`:
   ```ts
   server: {
     proxy: {
       '/api': {
         target: 'https://your-backend.railway.app',
         changeOrigin: true,
       },
     },
   }
   ```

2. Deploy to Vercel:
   ```bash
   cd packages/frontend
   vercel
   ```

Or use Railway for frontend too.

## Option 2: Vercel + Render

### Database (Supabase or Neon)

1. Create a PostgreSQL database on Supabase or Neon
2. Copy the connection string

### Backend (Render)

1. Create new Web Service on Render
2. Connect your repository
3. Set build command: `cd packages/backend && pnpm install && pnpm build`
4. Set start command: `cd packages/backend && pnpm start`
5. Add environment variables (same as Railway)
6. Deploy
7. Run migrations via Render shell

### Frontend (Vercel)

1. Import project to Vercel
2. Set root directory to `packages/frontend`
3. Set environment variable:
   - `VITE_API_URL=https://your-backend.onrender.com`
4. Update API base URL in `packages/frontend/src/lib/api.ts`:
   ```ts
   const API_BASE = import.meta.env.VITE_API_URL || '/api';
   ```
5. Deploy

## Option 3: Full Cloud (AWS/GCP)

### Frontend
- Build: `pnpm build`
- Upload `dist/` to S3
- Set up CloudFront distribution
- Configure CORS

### Backend
- Deploy to ECS/Fargate or EC2
- Use RDS for PostgreSQL
- Set up Application Load Balancer
- Configure security groups

### Database
- RDS PostgreSQL
- Enable backups
- Set up read replicas for scale

## Environment Variables

### Production Backend
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=generate-a-long-random-string-here
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=strong-password-here
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Frontend
```env
VITE_API_URL=https://your-backend-domain.com
```

## Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong SESSION_SECRET (32+ characters)
- [ ] Enable HTTPS (SSL/TLS certificates)
- [ ] Set secure cookie options in production
- [ ] Enable CORS only for your frontend domain
- [ ] Set up rate limiting
- [ ] Enable PostgreSQL SSL connection
- [ ] Use environment variables for all secrets
- [ ] Set up database backups
- [ ] Enable logging and monitoring

## Post-Deployment

1. **Test the application:**
   - Login to admin panel
   - Create/edit content
   - Verify all pages load correctly

2. **Set up monitoring:**
   - Use Railway Analytics, Vercel Analytics, or DataDog
   - Monitor API response times
   - Set up error tracking (Sentry)

3. **Configure DNS:**
   - Point your domain to the deployed services
   - Set up SSL certificates (auto with Vercel/Railway)

4. **Database backups:**
   - Enable automated backups
   - Test restore process
   - Keep backup retention policy

5. **Performance optimization:**
   - Enable caching headers
   - Use CDN for static assets
   - Optimize images before upload
   - Consider adding Redis for session storage

## Image Upload Setup

The current implementation returns mock URLs. For production:

### Option 1: Cloudflare R2
```typescript
// packages/backend/src/routes/storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Generate presigned URL for upload
const command = new PutObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  Key: `uploads/${Date.now()}-${filename}`,
  ContentType: contentType,
});

const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
```

### Option 2: AWS S3
Similar to R2 but use AWS endpoints and credentials.

## Maintenance

- **Regular updates:** Keep dependencies updated
- **Security patches:** Monitor for vulnerabilities
- **Database maintenance:** Run VACUUM on PostgreSQL
- **Log rotation:** Set up log rotation to prevent disk fills
- **Monitor costs:** Track usage and costs on cloud providers

## Scaling

As your church grows:
- Add database read replicas
- Use Redis for session storage
- Enable CDN for all static assets
- Consider serverless functions for background tasks
- Add search functionality (Algolia, Meilisearch)

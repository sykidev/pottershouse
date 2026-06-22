import express from 'express';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import authRoutes from './routes/auth.js';
import sermonsRoutes from './routes/sermons.js';
import eventsRoutes from './routes/events.js';
import announcementsRoutes from './routes/announcements.js';
import teamRoutes from './routes/team.js';
import contentRoutes from './routes/content.js';
import statsRoutes from './routes/stats.js';
import youtubeRoutes from './routes/youtube.js';
import storageRoutes, { UPLOAD_DIR } from './routes/storage.js';
import instagramRoutes from './routes/instagram.js';
import galleryRoutes from './routes/gallery.js';
import aboutCardsRoutes from './routes/about-cards.js';
import { startYoutubeSyncJob } from './jobs/youtube-sync.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// Behind nginx (TLS terminated upstream): trust the first proxy so that
// req.protocol reflects X-Forwarded-Proto. Required for secure session
// cookies to be set and for express-rate-limit to read the client IP.
app.set('trust proxy', 1);

// Disable X-Powered-By header
app.disable('x-powered-by');

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || 'https://pottersapostolic.com', 'https://www.pottersapostolic.com']
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(pinoHttp({ logger }));
app.use(express.json({ limit: '1mb' })); // Limit request body size

// PostgreSQL session store for production
const PgSession = connectPg(session);

app.use(session({
  store: process.env.NODE_ENV === 'production' ? new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  }) : undefined,
  secret: process.env.SESSION_SECRET || 'default-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

app.use('/api/auth', authRoutes);
app.use('/api/sermons', sermonsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', youtubeRoutes);
app.use('/api/storage', storageRoutes);

// Serve uploaded images. A CDN is expected to cache this path in production.
app.use('/uploads', express.static(UPLOAD_DIR, {
  immutable: true,
  maxAge: '30d',
}));
app.use('/api/social', instagramRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/about-cards', aboutCardsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  // Poll YouTube for newly-completed livestreams and import them as sermons.
  startYoutubeSyncJob(logger);
});

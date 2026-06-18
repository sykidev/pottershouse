import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'church2024!';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.session.userId = 'admin';
      return res.json({ success: true, user: { username: ADMIN_USERNAME } });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session?.userId) {
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    return res.json({ user: { username: ADMIN_USERNAME } });
  }
  return res.status(401).json({ error: 'Not authenticated' });
});

export default router;

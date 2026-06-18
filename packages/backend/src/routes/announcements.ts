import { Router } from 'express';
import { db } from '../db/index.js';
import { announcements, insertAnnouncementSchema } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allAnnouncements = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    res.json(allAnnouncements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, parseInt(req.params.id)));
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = insertAnnouncementSchema.parse(req.body);
    const [announcement] = await db.insert(announcements).values(data).returning();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: 'Invalid announcement data' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = insertAnnouncementSchema.parse(req.body);
    const [announcement] = await db
      .update(announcements)
      .set(data)
      .where(eq(announcements.id, parseInt(req.params.id)))
      .returning();
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(400).json({ error: 'Invalid announcement data' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.delete(announcements).where(eq(announcements.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;

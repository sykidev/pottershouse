import { Router } from 'express';
import { db } from '../db/index.js';
import { sermons, insertSermonSchema } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allSermons = await db.select().from(sermons).orderBy(desc(sermons.date));
    res.json(allSermons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [sermon] = await db.select().from(sermons).where(eq(sermons.id, parseInt(req.params.id)));
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    res.json(sermon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sermon' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = insertSermonSchema.parse(req.body);
    const [sermon] = await db.insert(sermons).values(data).returning();
    res.status(201).json(sermon);
  } catch (error) {
    res.status(400).json({ error: 'Invalid sermon data' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = insertSermonSchema.parse(req.body);
    const [sermon] = await db
      .update(sermons)
      .set(data)
      .where(eq(sermons.id, parseInt(req.params.id)))
      .returning();
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    res.json(sermon);
  } catch (error) {
    res.status(400).json({ error: 'Invalid sermon data' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.delete(sermons).where(eq(sermons.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

export default router;

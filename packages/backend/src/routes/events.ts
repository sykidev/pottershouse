import { Router } from 'express';
import { db } from '../db/index.js';
import { events, insertEventSchema } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allEvents = await db.select().from(events).orderBy(desc(events.date));
    res.json(allEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [event] = await db.select().from(events).where(eq(events.id, parseInt(req.params.id)));
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = insertEventSchema.parse(req.body);
    const [event] = await db.insert(events).values(data).returning();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Invalid event data' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = insertEventSchema.parse(req.body);
    const [event] = await db
      .update(events)
      .set(data)
      .where(eq(events.id, parseInt(req.params.id)))
      .returning();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: 'Invalid event data' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.delete(events).where(eq(events.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;

import { Router } from 'express';
import { db } from '../db/index.js';
import { aboutCards, insertAboutCardSchema } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq, asc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const cards = await db.select().from(aboutCards).orderBy(asc(aboutCards.orderIndex));
    res.json(cards);
  } catch (error) {
    console.error('About cards fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch about cards' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [card] = await db.select().from(aboutCards).where(eq(aboutCards.id, parseInt(req.params.id)));
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = insertAboutCardSchema.parse(req.body);
    const [card] = await db.insert(aboutCards).values(data).returning();
    res.status(201).json(card);
  } catch (error) {
    console.error('About card create error:', error);
    res.status(400).json({ error: 'Invalid card data' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = insertAboutCardSchema.parse(req.body);
    const [card] = await db
      .update(aboutCards)
      .set(data)
      .where(eq(aboutCards.id, parseInt(req.params.id)))
      .returning();
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('About card update error:', error);
    res.status(400).json({ error: 'Invalid card data' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.delete(aboutCards).where(eq(aboutCards.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

export default router;

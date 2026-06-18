import { Router } from 'express';
import { db } from '../db/index.js';
import { team, insertTeamSchema } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allTeam = await db.select().from(team).orderBy(team.createdAt);
    res.json(allTeam);
  } catch (error) {
    console.error('Team fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [member] = await db.select().from(team).where(eq(team.id, parseInt(req.params.id)));
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = insertTeamSchema.parse(req.body);
    const [member] = await db.insert(team).values(data).returning();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: 'Invalid team member data' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = insertTeamSchema.parse(req.body);
    const [member] = await db
      .update(team)
      .set(data)
      .where(eq(team.id, parseInt(req.params.id)))
      .returning();
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: 'Invalid team member data' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.delete(team).where(eq(team.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;

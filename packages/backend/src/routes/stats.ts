import { Router } from 'express';
import { db } from '../db/index.js';
import { sermons, events, announcements, team } from '../db/schema.js';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [sermonsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(sermons);
    const [eventsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(events);
    const [announcementsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(announcements);
    const [teamCount] = await db.select({ count: sql<number>`count(*)::int` }).from(team);

    res.json({
      sermons: sermonsCount.count,
      events: eventsCount.count,
      announcements: announcementsCount.count,
      teamMembers: teamCount.count,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;

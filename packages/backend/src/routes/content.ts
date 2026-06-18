import { Router } from 'express';
import { db } from '../db/index.js';
import { content, insertContentSchema } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/:section', async (req, res) => {
  try {
    let [sectionContent] = await db.select().from(content).where(eq(content.section, req.params.section));

    if (!sectionContent) {
      [sectionContent] = await db.insert(content).values({
        section: req.params.section,
        data: {},
      }).returning();
    }

    res.json(sectionContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.put('/:section', requireAuth, async (req, res) => {
  try {
    const data = insertContentSchema.parse({ section: req.params.section, data: req.body });

    const [existing] = await db.select().from(content).where(eq(content.section, req.params.section));

    let result;
    if (existing) {
      [result] = await db
        .update(content)
        .set({ data: data.data, updatedAt: new Date() })
        .where(eq(content.section, req.params.section))
        .returning();
    } else {
      [result] = await db.insert(content).values(data).returning();
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Invalid content data' });
  }
});

export default router;

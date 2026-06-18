import { pgTable, text, timestamp, boolean, jsonb, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const sermons = pgTable('sermons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  speaker: text('speaker').notNull(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  videoUrl: text('video_url').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const team = pgTable('team', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  bio: text('bio').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const content = pgTable('content', {
  id: serial('id').primaryKey(),
  section: text('section').notNull().unique(),
  data: jsonb('data').notNull().$type<Record<string, any>>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aboutCards = pgTable('about_cards', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'story' | 'vision' | 'mission'
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  year: text('year'), // For story timeline cards
  icon: text('icon'), // Icon name
  orderIndex: serial('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertSermonSchema = createInsertSchema(sermons, {
  title: z.string().min(1),
  speaker: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
  videoUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
});

export const selectSermonSchema = createSelectSchema(sermons);

export const insertEventSchema = createInsertSchema(events, {
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const selectEventSchema = createSelectSchema(events);

export const insertAnnouncementSchema = createInsertSchema(announcements, {
  title: z.string().min(1),
  body: z.string().min(1),
  active: z.boolean().optional(),
});

export const selectAnnouncementSchema = createSelectSchema(announcements);

export const insertTeamSchema = createInsertSchema(team, {
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const selectTeamSchema = createSelectSchema(team);

export const insertContentSchema = createInsertSchema(content, {
  section: z.string().min(1),
  data: z.record(z.any()),
});

export const selectContentSchema = createSelectSchema(content);

export const insertAboutCardSchema = createInsertSchema(aboutCards, {
  type: z.enum(['story', 'vision', 'mission']),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  year: z.string().optional(),
  icon: z.string().optional(),
  orderIndex: z.number().int().optional(),
});

export const selectAboutCardSchema = createSelectSchema(aboutCards);

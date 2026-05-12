import {
  pgTable, text, varchar, timestamp, boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const shops = pgTable('shops', {
  id: text('id').primaryKey(),

  // Foreign key — links shop to the seller who owns it
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),

  // Shop logo
  logoUrl: text('logo_url'),
  logoPublicId: text('logo_public_id'),

  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Shop = typeof shops.$inferSelect;
export type NewShop = typeof shops.$inferInsert;

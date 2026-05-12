import {
  pgTable, text, varchar, integer, boolean,
  timestamp, jsonb, pgEnum,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('user_role', ['BUYER', 'SELLER']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),        
  role: roleEnum('role').default('BUYER').notNull(),

  // Onboarding tracking
  isOnboardingComplete: boolean('is_onboarding_complete').default(false).notNull(),
  currentStep: integer('current_step').default(1).notNull(),
  onboardingData: jsonb('onboarding_data').default({}).notNull(),

  // Profile fields (populated during onboarding)
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  avatarPublicId: text('avatar_public_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),  
});

// TypeScript types inferred from schema — use these everywhere
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

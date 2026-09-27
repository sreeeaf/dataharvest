import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const gameSaves = pgTable('game_saves', {
  userId: text('user_id').primaryKey(),
  pseudonym: text('pseudonym'),
  state: jsonb('state').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

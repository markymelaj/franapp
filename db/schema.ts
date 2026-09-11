import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
export const recipeEntries = sqliteTable("recipe_entries", {
  userId: text("user_id").notNull(),
  entryKey: text("entry_key").notNull(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [primaryKey({columns:[table.userId, table.entryKey]})]);

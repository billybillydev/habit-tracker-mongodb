import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { userSchema } from "./user.schema";

export const habitSchema = sqliteTable("habits", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  userId: text("user_id").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const habitHistorySchema = sqliteTable("habits_history", {
    date: text("date").notNull(),
    habitId: integer("habit_id").notNull(),
});

export const habitRelations = relations(habitSchema, ({ one, many }) => ({
  user: one(userSchema, {
    fields: [habitSchema.userId],
    references: [userSchema.id],
  }),
  histories: many(habitHistorySchema),
}));

export const habitHistoryRelations = relations(
  habitHistorySchema,
  ({ one }) => ({
    user: one(habitSchema, {
      fields: [habitHistorySchema.habitId],
      references: [habitSchema.id],
    }),
  })
);

export type SelectHabit = typeof habitSchema.$inferSelect;
export type InsertHabit = typeof habitSchema.$inferInsert;
export type Habit = {
  id: SelectHabit["id"];
  title: SelectHabit["title"];
  description: SelectHabit["description"];
  color: SelectHabit["color"];
  userId: SelectHabit["userId"];
  created_at: SelectHabit["created_at"];
  updated_at: SelectHabit["updated_at"];
  histories?: HabitHistory[];
}

export type HabitHistory = typeof habitHistorySchema.$inferSelect;
export type HabitHistoryInsert = typeof habitHistorySchema.$inferInsert;
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { habitSchema } from "./habit.schema";

export const userSchema = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  googleId: text("google_id").unique(), // Use camelCase for column names
  email: text("email").unique(),
  password: text("password"),
  authType: text("auth_type", { enum: ["basic", "google"] }).notNull(),
});

export const sessionSchema = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id),
});

export const userRelations = relations(userSchema, ({ many }) => ({
  habits: many(habitSchema),
}));

export type User = typeof userSchema.$inferSelect;
export type InsertUser = typeof userSchema.$inferInsert;

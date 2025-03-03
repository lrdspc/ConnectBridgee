import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(),
  dueDate: text("dueDate").notNull(),
  progress: integer("progress").notNull().default(0),
  teamMembers: integer("teamMembers").notNull().default(1),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  category: true,
  status: true,
  dueDate: true,
  progress: true,
  teamMembers: true,
});

// Task schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  project: text("project").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  dueDate: text("dueDate").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  name: true,
  project: true,
  status: true,
  priority: true,
  dueDate: true,
});

// Stat schema
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
  change: text("change").notNull(),
  iconClass: text("iconClass").notNull(),
  iconBgColor: text("iconBgColor").notNull(),
});

export const insertStatSchema = createInsertSchema(stats).pick({
  name: true,
  value: true,
  change: true,
  iconClass: true,
  iconBgColor: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertStat = z.infer<typeof insertStatSchema>;
export type Stat = typeof stats.$inferSelect;

import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums para relatórios
export const reportStatusEnum = z.enum([
  "draft", "completed", "shared", "archived"
]);

export const reportTypeEnum = z.enum([
  "roof_inspection", "structural", "maintenance", "installation", "custom"
]);

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  role: text("role").default("Técnico de Campo"),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
  photoUrl: true,
});

// Visit Status and Type enums
export const visitStatusEnum = z.enum([
  "scheduled", "in-progress", "pending", "completed", "urgent"
]);

export const visitTypeEnum = z.enum([
  "installation", "maintenance", "inspection", "repair", "emergency"
]);

export const visitPriorityEnum = z.enum([
  "normal", "high", "urgent"
]);

// Visit table
export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  address: text("address").notNull(),
  date: text("date").notNull(), // Store as 'YYYY-MM-DD'
  time: text("time"),
  type: text("type").notNull(), // One of visitTypeEnum
  status: text("status").notNull(), // One of visitStatusEnum
  priority: text("priority").notNull().default("normal"), // One of visitPriorityEnum
  description: text("description"),
  contactInfo: text("contact_info"),
  checklist: json("checklist").$type<ChecklistItem[]>(),
  photos: json("photos").$type<VisitPhoto[]>(),
  documents: json("documents").$type<VisitDocument[]>(),
  notes: text("notes"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

// Weekly performance table
export const weeklyPerformance = pgTable("weekly_performance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  day: text("day").notNull(), // e.g., 'Mon', 'Tue', etc.
  visits: integer("visits").default(0),
  timeSpent: integer("time_spent").default(0), // in minutes
  efficiency: integer("efficiency").default(0), // percentage
  date: timestamp("date").defaultNow(),
});

export const insertWeeklyPerformanceSchema = createInsertSchema(weeklyPerformance).omit({
  id: true,
});

// Checklist templates table
export const checklistTemplates = pgTable("checklist_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // can be visit type or "custom"
  items: json("items").$type<ChecklistItem[]>().notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertChecklistTemplateSchema = createInsertSchema(checklistTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // um dos reportTypeEnum
  status: text("status").notNull().default("draft"), // um dos reportStatusEnum
  clientName: text("client_name").notNull(),
  address: text("address").notNull(),
  relatedEntityId: integer("related_entity_id"), // ID de visita ou inspeção relacionada
  relatedEntityType: text("related_entity_type"), // 'visit', 'inspection', etc.
  content: json("content"), // Conteúdo do relatório em formato estruturado
  problemsIdentified: integer("problems_identified").default(0),
  recommendations: integer("recommendations").default(0),
  isShared: boolean("is_shared").default(false),
  sharedWith: json("shared_with").$type<{email: string, name: string, date: string}[]>(),
  pdfUrl: text("pdf_url"), // Link para o PDF gerado
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

// Type definitions
export interface ChecklistItem {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  type: string; // can be associated with visit types or "custom"
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface VisitPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  notes?: string;
}

export interface VisitDocument {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  timestamp: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  type: string; // can be associated with report types
  sections: ReportSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportSection {
  id: string;
  title: string;
  type: string; // 'text', 'checklist', 'photos', 'specs', etc.
  required: boolean;
  content?: any;
}

export interface ReportAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  createdAt: string;
}

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Visit = typeof visits.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type WeeklyPerformance = typeof weeklyPerformance.$inferSelect;
export type InsertWeeklyPerformance = z.infer<typeof insertWeeklyPerformanceSchema>;
export type ChecklistTemplateDB = typeof checklistTemplates.$inferSelect;
export type InsertChecklistTemplate = z.infer<typeof insertChecklistTemplateSchema>;
export type VisitStatus = z.infer<typeof visitStatusEnum>;
export type VisitType = z.infer<typeof visitTypeEnum>;
export type VisitPriority = z.infer<typeof visitPriorityEnum>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type ReportStatus = z.infer<typeof reportStatusEnum>;
export type ReportType = z.infer<typeof reportTypeEnum>;

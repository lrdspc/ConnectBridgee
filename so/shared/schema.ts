import { z } from "zod";
import { pgTable, text, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Enums para status e tipos de relatório
export const reportStatusEnum = z.enum([
  "rascunho",
  "pendente",
  "revisao",
  "aprovado",
  "rejeitado",
  "publicado"
]);

export const reportTypeEnum = z.enum([
  "vistoria-tecnica",
  "far",
  "laudo-tecnico",
  "analise-preliminar"
]);

// Tabela de usuários
export const users = pgTable("users", {
  id: integer("id").primaryKey().notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("tecnico"),
  regional: text("regional"),
  departamento: text("departamento"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
  regional: true,
  departamento: true,
  photoUrl: true
});

// Enums para visitas
export const visitStatusEnum = z.enum([
  "agendada",
  "em-progresso",
  "pendente",
  "concluida",
  "cancelada"
]);

export const visitTypeEnum = z.enum([
  "vistoria",
  "assistencia-tecnica",
  "inspecao-qualidade",
  "analise-preliminar"
]);

export const visitPriorityEnum = z.enum([
  "normal",
  "alta",
  "urgente"
]);

// Tabela de visitas
export const visits = pgTable("visits", {
  id: integer("id").primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  clientName: text("client_name").notNull(),
  address: text("address").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  type: text("type").notNull(),
  status: text("status").notNull().default("agendada"),
  priority: text("priority").notNull().default("normal"),
  description: text("description"),
  contactInfo: text("contact_info"),
  checklist: json("checklist").$type<ChecklistItem[]>(),
  photos: json("photos").$type<VisitPhoto[]>(),
  documents: json("documents").$type<VisitDocument[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  synced: boolean("synced").default(false)
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  synced: true
});

// Tabela de desempenho semanal
export const weeklyPerformance = pgTable("weekly_performance", {
  id: integer("id").primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  day: text("day").notNull(),
  visits: integer("visits").default(0),
  timeSpent: integer("time_spent").default(0),
  efficiency: integer("efficiency").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertWeeklyPerformanceSchema = createInsertSchema(weeklyPerformance).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Tabela de templates de checklist
export const checklistTemplates = pgTable("checklist_templates", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  items: json("items").$type<ChecklistItem[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertChecklistTemplateSchema = createInsertSchema(checklistTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Tabela de relatórios
export const reports = pgTable("reports", {
  id: integer("id").primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  visitId: integer("visit_id"),
  type: text("type").notNull(),
  status: text("status").notNull().default("rascunho"),
  title: text("title").notNull(),
  content: json("content").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  sharedWith: json("shared_with").$type<{email: string, name: string}[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at")
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true
});

// Interfaces para tipos personalizados
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

// Tipos exportados
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
import { z } from "zod";

// Base user/technician schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  fullName: z.string(),
  phone: z.string().nullable(),
  region: z.string().nullable(),
});

export const insertUserSchema = userSchema.omit({ id: true });

// Enhanced inspection schema with versioning and sync metadata
export const inspectionSchema = z.object({
  id: z.number(),
  technicianId: z.number(),
  // Cliente e Obra
  clientName: z.string().nullable(),
  dateInspected: z.date(),
  constructionType: z.string().nullable(),
  customConstructionType: z.string().optional(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  inspectionSubject: z.string().nullable(),
  protocolNumber: z.string().nullable(),
  // Dados do Técnico
  technicianName: z.string().nullable(),
  department: z.string().nullable(),
  unit: z.string().nullable(),
  region: z.string().nullable(),
  coordinatorName: z.string().nullable(),
  managerName: z.string().nullable(),
  // Dados das Telhas
  tileSpecs: z.array(z.object({
    model: z.string(),
    customModel: z.string().optional(),
    thickness: z.string(),
    dimensions: z.string(),
    count: z.string(),
  })).default([]),
  // Não Conformidades
  issues: z.array(z.string()).default([]),
  photos: z.array(z.string()).default([]),
  // Sync fields
  synced: z.boolean().default(false),
  version: z.number().default(1),
  lastModified: z.date().default(() => new Date()),
  localId: z.string(),
  syncConflict: z.boolean().default(false),
  serverVersion: z.number().nullable(),
});

export const insertInspectionSchema = inspectionSchema
  .omit({
    id: true,
    synced: true,
    version: true,
    lastModified: true,
    localId: true,
    syncConflict: true,
    serverVersion: true,
  })
  .extend({
    issues: z.array(z.string()).default([]),
    photos: z.array(z.string()).default([]),
    tileSpecs: z.array(z.object({
      model: z.string(),
      customModel: z.string().optional(),
      thickness: z.string(),
      dimensions: z.string(),
      count: z.string(),
    })).default([]),
  });

// Type exports
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Inspection = z.infer<typeof inspectionSchema>;
export type InsertInspection = z.infer<typeof insertInspectionSchema>;
export type TileSpec = z.infer<typeof inspectionSchema>["tileSpecs"][number];

// Sync types
export type SyncMetadata = {
  version: number;
  lastModified: Date;
  localId: string;
  syncConflict: boolean;
  serverVersion: number | null;
};

export type InspectionWithSync = Inspection & SyncMetadata;
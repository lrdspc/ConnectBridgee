import { IStorage } from "./types";
import { InsertUser, User, Inspection, InsertInspection } from "@shared/schema";
import { db, pool } from "./db";

export class DatabaseStorage implements IStorage {
  async createInspection(inspection: InsertInspection & {
    version: number;
    lastModified: Date;
    localId: string;
  }): Promise<Inspection> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: [newInspection] } = await client.query(
        `INSERT INTO inspections (
          technician_id, client_name, date_inspected, construction_type,
          custom_construction_type, address, inspection_subject, protocol_number,
          technician_name, region, coordinator_name, manager_name,
          version, last_modified, local_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          inspection.technicianId,
          inspection.clientName,
          inspection.dateInspected,
          inspection.constructionType,
          inspection.customConstructionType,
          inspection.address,
          inspection.inspectionSubject,
          inspection.protocolNumber,
          inspection.technicianName,
          inspection.region,
          inspection.coordinatorName,
          inspection.managerName,
          inspection.version,
          inspection.lastModified,
          inspection.localId,
        ]
      );

      if (inspection.tileSpecs?.length > 0) {
        for (const spec of inspection.tileSpecs) {
          await client.query(
            `INSERT INTO tile_specs (
              inspection_id, model, custom_model, thickness, dimensions, count
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [newInspection.id, spec.model, spec.customModel, spec.thickness, spec.dimensions, spec.count]
          );
        }
      }

      await client.query('COMMIT');

      return {
        ...newInspection,
        tileSpecs: inspection.tileSpecs || [],
        issues: inspection.issues || [],
        photos: inspection.photos || [],
        synced: false,
        syncConflict: false,
        serverVersion: null,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating inspection:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ... outros métodos do storage
}

export const storage = new DatabaseStorage();

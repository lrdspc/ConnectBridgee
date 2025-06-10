import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Please check your .env file and ensure it contains a valid DATABASE_URL.");
}

// Determine database dialect based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
const isPostgreSQL = databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
const isSQLite = databaseUrl.startsWith("file:") || databaseUrl.endsWith(".sqlite") || databaseUrl.endsWith(".db");

if (!isPostgreSQL && !isSQLite) {
  throw new Error("Unsupported database type. Please use PostgreSQL (postgresql://) or SQLite (file:) in DATABASE_URL.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isPostgreSQL ? "postgresql" : "sqlite",
  dbCredentials: isPostgreSQL
    ? { url: databaseUrl }
    : { url: databaseUrl },
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
  },
});

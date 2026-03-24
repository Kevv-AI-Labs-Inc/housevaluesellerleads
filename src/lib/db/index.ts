import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

/**
 * Lazily initialize the database connection.
 * Returns null if DATABASE_URL is not set or connection fails.
 */
export function getDb() {
  if (db) return db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("[DB] DATABASE_URL not set — running without database");
    return null;
  }

  try {
    const queryClient = postgres(connectionString);
    db = drizzle(queryClient, { schema });
    return db;
  } catch (error) {
    console.error("[DB] Failed to initialize database connection:", error);
    return null;
  }
}

// Re-export for backward compatibility (lazy access)
export { getDb as db };

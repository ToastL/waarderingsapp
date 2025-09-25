import { Pool, PoolConfig } from "pg";
import { readFile } from "fs/promises";
import { join } from "path";

const cachedPools: { [key: string]: Pool } = {};
let isInitialized = false;

const user = process.env.DATABASE_USER;
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT
  ? parseInt(process.env.DATABASE_PORT)
  : 5432;

export async function createConnectionPool(
  cacheKey: string,
  config?: Partial<PoolConfig>
): Promise<Pool> {
  if (cachedPools[cacheKey]) {
    return cachedPools[cacheKey];
  }

  const connectionConfig: PoolConfig = {
    user,
    host,
    database,
    password,
    port,
    ...config,
  };

  try {
    const pool = new Pool(connectionConfig);

    // Initialize database schema if not done yet
    if (!isInitialized) {
      await initializeDatabase(pool);
      isInitialized = true;
    }

    cachedPools[cacheKey] = pool;
    return pool;
  } catch (error) {
    console.log("Database connection error:", error);
    throw error;
  }
}

async function initializeDatabase(pool: Pool): Promise<void> {
  try {
    const initSqlPath = join(process.cwd(), "server", "db", "init.sql");
    const initSql = await readFile(initSqlPath, "utf-8");
    await pool.query(initSql);
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Database initialization error:", error);
    // Don't throw error here as the database might already be initialized
  }
}

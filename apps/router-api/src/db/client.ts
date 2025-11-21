/**
 * @file client.ts
 * @description PostgreSQL client wrapper
 */

import pg from 'pg';
import { DB_CONFIG } from '../config.js';
import { CREATE_TABLES_SQL } from './schema.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;

/**
 * Get or create database pool
 */
export function getDbPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DB_CONFIG.url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

/**
 * Initialize database (create tables)
 */
export async function initDb(): Promise<void> {
  const client = getDbPool();
  await client.query(CREATE_TABLES_SQL);
}

/**
 * Close database pool
 */
export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}


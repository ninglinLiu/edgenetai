/**
 * @file client.ts
 * @description Database client for verifier
 */

import pg from 'pg';
import { DB_CONFIG } from '../config.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getDbPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DB_CONFIG.url,
      max: 20,
    });
  }
  return pool;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}


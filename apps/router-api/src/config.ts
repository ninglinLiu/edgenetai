/**
 * @file config.ts
 * @description Centralized configuration for router-api
 */

import { config } from 'dotenv';

config();

// ============ Server Config ============
export const SERVER_CONFIG = {
  port: parseInt(process.env.ROUTER_API_PORT || '3001', 10),
  host: process.env.ROUTER_API_HOST || '0.0.0.0',
} as const;

// ============ Database Config ============
export const DB_CONFIG = {
  url: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/edgenetai',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'edgenetai',
} as const;

// ============ Redis Config ============
export const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
} as const;

// ============ Verification Thresholds ============
export const VERIFICATION_CONFIG = {
  llmSimilarityThreshold: parseFloat(process.env.LLM_SIMILARITY_THRESHOLD || '0.85'),
  ocrEditDistanceThreshold: parseFloat(process.env.OCR_EDIT_DISTANCE_THRESHOLD || '0.90'),
  minConsensusNodes: parseInt(process.env.MIN_CONSENSUS_NODES || '2', 10),
} as const;

// ============ SLA Tiers ============
export const SLA_CONFIG = {
  bronze: {
    nodes: parseInt(process.env.SLA_BRONZE_NODES || '1', 10),
  },
  silver: {
    nodes: parseInt(process.env.SLA_SILVER_NODES || '2', 10),
  },
  gold: {
    nodes: parseInt(process.env.SLA_GOLD_NODES || '3', 10),
  },
} as const;

// ============ Task Limits ============
export const TASK_LIMITS = {
  maxTaskSizeMB: parseInt(process.env.MAX_TASK_SIZE_MB || '10', 10),
  maxTextLength: parseInt(process.env.MAX_TEXT_LENGTH || '10000', 10),
  maxImageSizeMB: parseInt(process.env.MAX_IMAGE_SIZE_MB || '5', 10),
} as const;

// ============ Rate Limiting ============
export const RATE_LIMIT_CONFIG = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
} as const;

// ============ Storage Config ============
export const STORAGE_CONFIG = {
  type: (process.env.STORAGE_TYPE || 'local') as 'local' | 'minio',
  path: process.env.STORAGE_PATH || './storage',
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost:9000',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucket: process.env.MINIO_BUCKET || 'edgenetai',
  },
} as const;

// ============ Logging Config ============
export const LOG_CONFIG = {
  level: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
  format: (process.env.LOG_FORMAT || 'json') as 'json' | 'pretty',
} as const;


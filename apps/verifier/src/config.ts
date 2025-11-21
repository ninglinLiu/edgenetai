/**
 * @file config.ts
 * @description Configuration for verifier
 */

import { config } from 'dotenv';

config();

export const VERIFIER_CONFIG = {
  port: parseInt(process.env.VERIFIER_PORT || '3002', 10),
  host: process.env.VERIFIER_HOST || '0.0.0.0',
} as const;

export const DB_CONFIG = {
  url: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/edgenetai',
} as const;

export const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
} as const;

export const CHAIN_CONFIG = {
  rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
  chainId: parseInt(process.env.CHAIN_ID || '31337', 10),
  privateKey: process.env.PRIVATE_KEY || '',
  contractAddress: (process.env.CONTRACT_ADDRESS || '') as `0x${string}`,
} as const;

export const VERIFICATION_CONFIG = {
  llmSimilarityThreshold: parseFloat(process.env.LLM_SIMILARITY_THRESHOLD || '0.85'),
  ocrEditDistanceThreshold: parseFloat(process.env.OCR_EDIT_DISTANCE_THRESHOLD || '0.90'),
  minConsensusNodes: parseInt(process.env.MIN_CONSENSUS_NODES || '2', 10),
} as const;

export const LOG_CONFIG = {
  level: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
  format: (process.env.LOG_FORMAT || 'json') as 'json' | 'pretty',
} as const;


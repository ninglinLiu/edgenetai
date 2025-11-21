/**
 * @file client.ts
 * @description BullMQ queue client
 */

import { Queue, Worker, QueueEvents } from 'bullmq';
import { REDIS_CONFIG } from '../config.js';
import type { Job } from 'bullmq';

// Queue names
export const QUEUE_NAMES = {
  DISPATCH: 'dispatch',
  VERIFY: 'verify',
  SETTLE: 'settle',
} as const;

// Redis connection
const connection = {
  host: REDIS_CONFIG.host,
  port: REDIS_CONFIG.port,
};

/**
 * Create a queue
 */
export function createQueue<T = unknown>(name: string): Queue<T> {
  return new Queue<T>(name, { connection });
}

/**
 * Create a worker
 */
export function createWorker<T = unknown>(
  name: string,
  processor: (job: Job<T>) => Promise<void>
): Worker<T> {
  return new Worker<T>(name, processor, { connection });
}

/**
 * Create queue events listener
 */
export function createQueueEvents(name: string): QueueEvents {
  return new QueueEvents(name, { connection });
}


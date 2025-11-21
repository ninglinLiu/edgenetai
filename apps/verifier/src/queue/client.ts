/**
 * @file client.ts
 * @description BullMQ queue client for verifier
 */

import { Queue, Worker, QueueEvents } from 'bullmq';
import { REDIS_CONFIG } from '../config.js';
import type { Job } from 'bullmq';

export const QUEUE_NAMES = {
  VERIFY: 'verify',
  SETTLE: 'settle',
} as const;

const connection = {
  host: REDIS_CONFIG.host,
  port: REDIS_CONFIG.port,
};

export function createQueue<T = unknown>(name: string): Queue<T> {
  return new Queue<T>(name, { connection });
}

export function createWorker<T = unknown>(
  name: string,
  processor: (job: Job<T>) => Promise<void>
): Worker<T> {
  return new Worker<T>(name, processor, { connection });
}

export function createQueueEvents(name: string): QueueEvents {
  return new QueueEvents(name, { connection });
}


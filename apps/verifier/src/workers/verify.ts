/**
 * @file verify.ts
 * @description Worker for verifying task executions
 */

import { createWorker, createQueue } from '../queue/client.js';
import { QUEUE_NAMES } from '../queue/client.js';
import { verifyNofM } from '../verification/v0.js';
import type { Job } from 'bullmq';

interface VerifyJobData {
  taskId: string;
}

/**
 * Verify worker - validates task executions
 */
export function createVerifyWorker() {
  return createWorker<VerifyJobData>(QUEUE_NAMES.VERIFY, async (job: Job<VerifyJobData>) => {
    const { taskId } = job.data;

    try {
      const verification = await verifyNofM(taskId);

      // If verification passes, trigger settlement
      if (verification.result === 'PASS') {
        const settleQueue = createQueue(QUEUE_NAMES.SETTLE);
        await settleQueue.add('settle-task', { taskId, verificationId: verification.id });
      }
    } catch (error) {
      console.error(`Verification failed for task ${taskId}:`, error);
      throw error;
    }
  });
}


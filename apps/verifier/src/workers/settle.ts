/**
 * @file settle.ts
 * @description Worker for settling verified tasks on-chain
 */

import { createWorker } from '../queue/client.js';
import { QUEUE_NAMES } from '../queue/client.js';
import { getDbPool } from '../db/client.js';
import { createSDK } from '@edgenetai/sdk';
import { CHAIN_CONFIG } from '../config.js';
import { randomUUID } from 'crypto';
import type { Job } from 'bullmq';

interface SettleJobData {
  taskId: string;
  verificationId: string;
}

/**
 * Settle worker - writes verified receipts to chain
 */
export function createSettleWorker() {
  return createWorker<SettleJobData>(QUEUE_NAMES.SETTLE, async (job: Job<SettleJobData>) => {
    const { taskId, verificationId } = job.data;
    const db = getDbPool();

    // Get task and verification
    const taskResult = await db.query(
      `SELECT id, model_id FROM tasks WHERE id = $1`,
      [taskId]
    );
    const verifResult = await db.query(
      `SELECT result, details FROM verifications WHERE id = $1`,
      [verificationId]
    );
    const execResult = await db.query(
      `SELECT latency_ms, output_hash FROM executions WHERE task_id = $1`,
      [taskId]
    );

    if (taskResult.rows.length === 0 || verifResult.rows.length === 0) {
      throw new Error('Task or verification not found');
    }

    const task = taskResult.rows[0];
    const verification = verifResult.rows[0];
    const executions = execResult.rows;

    // Calculate median latency
    const latencies = executions.map((e) => e.latency_ms).sort((a, b) => a - b);
    const medianLatency = latencies[Math.floor(latencies.length / 2)];

    // Hash model ID
    const crypto = await import('crypto');
    const modelHash = crypto
      .createHash('sha256')
      .update(task.model_id)
      .digest('hex');

    // Create node set root (simplified - in production use Merkle tree)
    const nodeSetRoot = crypto
      .createHash('sha256')
      .update(executions.map((e) => e.output_hash).join(''))
      .digest('hex');

    // Emit receipt on-chain
    const sdk = createSDK({
      rpcUrl: CHAIN_CONFIG.rpcUrl,
      chainId: CHAIN_CONFIG.chainId,
      contractAddress: CHAIN_CONFIG.contractAddress,
      privateKey: CHAIN_CONFIG.privateKey as `0x${string}`,
    });

    try {
      const txHash = await sdk.emitReceipt({
        jobId: taskId,
        modelHash: `0x${modelHash}`,
        latencyMs: medianLatency,
        nodeSetRoot: `0x${nodeSetRoot}`,
        ipfsCID: '', // TODO: Upload verification details to IPFS
      });

      // Wait for transaction
      // In production, use proper transaction receipt waiting
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store receipt locally
      await db.query(
        `INSERT INTO receipts (job_id, model_hash, latency_ms, tx_hash, node_set_root, ipfs_cid)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (job_id) DO UPDATE SET
           tx_hash = EXCLUDED.tx_hash,
           block_number = EXCLUDED.block_number`,
        [taskId, `0x${modelHash}`, medianLatency, txHash, `0x${nodeSetRoot}`, '']
      );

      console.log(`Receipt emitted for task ${taskId}: ${txHash}`);
    } catch (error) {
      console.error(`Failed to emit receipt for task ${taskId}:`, error);
      throw error;
    }
  });
}


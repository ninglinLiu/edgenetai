/**
 * @file task.ts
 * @description tRPC router for task operations
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { getDbPool } from '../db/client.js';
import { createQueue } from '../queue/client.js';
import { QUEUE_NAMES } from '../queue/client.js';
import {
  CreateTaskRequestSchema,
  TaskStatusResponseSchema,
  type CreateTaskRequest,
  type TaskStatusResponse,
  createErrorResponse,
  getNodeCountForSLA,
} from '@edgenetai/proto';
import { TASK_LIMITS } from '../config.js';
import { randomUUID } from 'crypto';

const dispatchQueue = createQueue(QUEUE_NAMES.DISPATCH);

export const taskRouter = router({
  /**
   * Create a new inference task
   */
  create: publicProcedure
    .input(CreateTaskRequestSchema)
    .output(z.object({ taskId: z.string().uuid(), status: z.string() }))
    .mutation(async ({ input }): Promise<{ taskId: string; status: string }> => {
      const db = getDbPool();

      // Validate payload size
      const payloadSize = Buffer.byteLength(input.payload, 'utf8');
      const maxSize = input.type === 'LLM_SUMMARY' ? TASK_LIMITS.maxTextLength : TASK_LIMITS.maxImageSizeMB * 1024 * 1024;

      if (payloadSize > maxSize) {
        throw new Error(`Payload too large: ${payloadSize} bytes (max: ${maxSize})`);
      }

      // Create task record
      const taskId = randomUUID();
      const result = await db.query(
        `INSERT INTO tasks (id, type, payload_blob, model_id, sla_tier, status)
         VALUES ($1, $2, $3, $4, $5, 'PENDING')
         RETURNING id, status`,
        [taskId, input.type, input.payload, input.modelId, input.slaTier]
      );

      // Dispatch to queue
      await dispatchQueue.add('dispatch-task', {
        taskId,
        type: input.type,
        payload: input.payload,
        modelId: input.modelId,
        slaTier: input.slaTier,
        nodeCount: getNodeCountForSLA(input.slaTier),
      });

      // Update status to DISPATCHED
      await db.query(`UPDATE tasks SET status = 'DISPATCHED', updated_at = NOW() WHERE id = $1`, [taskId]);

      return {
        taskId: result.rows[0].id,
        status: 'DISPATCHED',
      };
    }),

  /**
   * Get task status with executions and verification
   */
  status: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(TaskStatusResponseSchema)
    .query(async ({ input }): Promise<TaskStatusResponse> => {
      const db = getDbPool();

      // Get task
      const taskResult = await db.query(
        `SELECT id, type, payload_uri, payload_blob, model_id, sla_tier, status, user_id, created_at, updated_at
         FROM tasks WHERE id = $1`,
        [input.id]
      );

      if (taskResult.rows.length === 0) {
        throw new Error('Task not found');
      }

      const task = taskResult.rows[0];

      // Get executions
      const execResult = await db.query(
        `SELECT id, task_id, node_id, output_hash, raw_uri, raw_output, latency_ms, cost, tee_quote, created_at
         FROM executions WHERE task_id = $1 ORDER BY created_at ASC`,
        [input.id]
      );

      // Get verification
      const verifResult = await db.query(
        `SELECT id, task_id, policy, result, detail_uri, details, created_at
         FROM verifications WHERE task_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [input.id]
      );

      // Get receipt
      const receiptResult = await db.query(
        `SELECT job_id, model_hash, latency_ms, verifier_sig, block_hash, tx_hash, block_number, timestamp, node_set_root, ipfs_cid
         FROM receipts WHERE job_id = $1`,
        [input.id]
      );

      return {
        task: {
          id: task.id,
          type: task.type,
          payloadURI: task.payload_uri,
          payloadBlob: task.payload_blob,
          modelId: task.model_id,
          slaTier: task.sla_tier,
          status: task.status,
          userId: task.user_id,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
        },
        executions: execResult.rows.map((row) => ({
          id: row.id,
          taskId: row.task_id,
          nodeId: row.node_id,
          outputHash: row.output_hash,
          rawURI: row.raw_uri,
          rawOutput: row.raw_output,
          latencyMs: row.latency_ms,
          cost: row.cost.toString(),
          teeQuote: row.tee_quote,
          createdAt: row.created_at,
        })),
        verification: verifResult.rows.length > 0 ? {
          id: verifResult.rows[0].id,
          taskId: verifResult.rows[0].task_id,
          policy: verifResult.rows[0].policy,
          result: verifResult.rows[0].result,
          detailURI: verifResult.rows[0].detail_uri,
          details: verifResult.rows[0].details,
          createdAt: verifResult.rows[0].created_at,
        } : undefined,
        receipt: receiptResult.rows.length > 0 ? {
          jobId: receiptResult.rows[0].job_id,
          modelHash: receiptResult.rows[0].model_hash,
          latencyMs: receiptResult.rows[0].latency_ms,
          verifierSig: receiptResult.rows[0].verifier_sig,
          blockHash: receiptResult.rows[0].block_hash,
          txHash: receiptResult.rows[0].tx_hash,
          blockNumber: receiptResult.rows[0].block_number,
          timestamp: receiptResult.rows[0].timestamp,
          nodeSetRoot: receiptResult.rows[0].node_set_root,
          ipfsCID: receiptResult.rows[0].ipfs_cid,
        } : undefined,
      };
    }),

  /**
   * Get on-chain receipt
   */
  receipt: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const db = getDbPool();

      const result = await db.query(
        `SELECT job_id, model_hash, latency_ms, verifier_sig, block_hash, tx_hash, block_number, timestamp, node_set_root, ipfs_cid
         FROM receipts WHERE job_id = $1`,
        [input.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Receipt not found');
      }

      const row = result.rows[0];
      return {
        jobId: row.job_id,
        modelHash: row.model_hash,
        latencyMs: row.latency_ms,
        verifierSig: row.verifier_sig,
        blockHash: row.block_hash,
        txHash: row.tx_hash,
        blockNumber: row.block_number,
        timestamp: row.timestamp,
        nodeSetRoot: row.node_set_root,
        ipfsCID: row.ipfs_cid,
      };
    }),
});


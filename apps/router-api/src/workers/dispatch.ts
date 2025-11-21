/**
 * @file dispatch.ts
 * @description Worker for dispatching tasks to nodes
 */

import { createWorker } from '../queue/client.js';
import { QUEUE_NAMES } from '../queue/client.js';
import { getDbPool } from '../db/client.js';
import type { Job } from 'bullmq';

interface DispatchJobData {
  taskId: string;
  type: 'LLM_SUMMARY' | 'OCR_IMAGE';
  payload: string;
  modelId: string;
  slaTier: 'BRONZE' | 'SILVER' | 'GOLD';
  nodeCount: number;
}

/**
 * Dispatch worker - routes tasks to available nodes
 */
export function createDispatchWorker() {
  return createWorker<DispatchJobData>(QUEUE_NAMES.DISPATCH, async (job: Job<DispatchJobData>) => {
    const { taskId, type, payload, modelId, nodeCount } = job.data;
    const db = getDbPool();

    // Get available nodes (sorted by reputation and latency)
    const nodesResult = await db.query(
      `SELECT id, addr, region, reputation, latency_score
       FROM nodes
       WHERE last_heartbeat > NOW() - INTERVAL '5 minutes'
       ORDER BY reputation DESC, latency_score DESC
       LIMIT $1`,
      [nodeCount]
    );

    if (nodesResult.rows.length < nodeCount) {
      throw new Error(`Not enough available nodes: need ${nodeCount}, got ${nodesResult.rows.length}`);
    }

    // Update task status
    await db.query(`UPDATE tasks SET status = 'EXECUTING', updated_at = NOW() WHERE id = $1`, [taskId]);

    // Dispatch to each node (in parallel via HTTP)
    const dispatchPromises = nodesResult.rows.map(async (node) => {
      const endpoint = type === 'LLM_SUMMARY' ? '/exec/llm-summary' : '/exec/ocr-image';
      const url = `${node.addr}${endpoint}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId,
            payload,
            modelId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Node ${node.id} failed: ${response.statusText}`);
        }

        const result = await response.json();

        // Store execution
        await db.query(
          `INSERT INTO executions (task_id, node_id, output_hash, raw_output, latency_ms, cost)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            taskId,
            node.id,
            result.outputHash,
            JSON.stringify(result.output),
            result.latencyMs,
            '0', // Cost calculation TBD
          ]
        );

        return { nodeId: node.id, success: true };
      } catch (error) {
        console.error(`Failed to dispatch to node ${node.id}:`, error);
        return { nodeId: node.id, success: false, error: String(error) };
      }
    });

    await Promise.all(dispatchPromises);

    // Trigger verification queue
    const { createQueue } = await import('../queue/client.js');
    const verifyQueue = createQueue(QUEUE_NAMES.VERIFY);
    await verifyQueue.add('verify-task', { taskId });
  });
}


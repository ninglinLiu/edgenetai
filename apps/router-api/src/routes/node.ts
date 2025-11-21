/**
 * @file node.ts
 * @description tRPC router for node operations
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { getDbPool } from '../db/client.js';
import { RegisterNodeRequestSchema, NodeHeartbeatSchema } from '@edgenetai/proto';
import { randomUUID } from 'crypto';

export const nodeRouter = router({
  /**
   * Register a new node
   */
  register: publicProcedure
    .input(RegisterNodeRequestSchema)
    .mutation(async ({ input }) => {
      const db = getDbPool();
      const nodeId = randomUUID();

      await db.query(
        `INSERT INTO nodes (id, addr, stake, region, registered_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET
           addr = EXCLUDED.addr,
           stake = EXCLUDED.stake,
           region = EXCLUDED.region`,
        [nodeId, input.addr, input.stake, input.region]
      );

      return { nodeId, challenge: `sign-${nodeId}-${Date.now()}` };
    }),

  /**
   * Node heartbeat
   */
  heartbeat: publicProcedure
    .input(NodeHeartbeatSchema)
    .mutation(async ({ input }) => {
      const db = getDbPool();

      await db.query(
        `UPDATE nodes SET last_heartbeat = NOW(), latency_score = $1
         WHERE id = $2`,
        [1 - Math.min(input.latency / 1000, 1), input.nodeId] // Normalize latency to 0-1
      );

      return { success: true };
    }),
});


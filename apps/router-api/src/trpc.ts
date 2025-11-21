/**
 * @file trpc.ts
 * @description tRPC initialization
 */

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

/**
 * Initialize tRPC
 */
const t = initTRPC.context<{ req: unknown; res: unknown }>().create();

export const router = t.router;
export const publicProcedure = t.procedure;


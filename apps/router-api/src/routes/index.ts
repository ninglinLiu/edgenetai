/**
 * @file index.ts
 * @description Main tRPC router
 */

import { router } from '../trpc.js';
import { taskRouter } from './task.js';
import { nodeRouter } from './node.js';

export const appRouter = router({
  task: taskRouter,
  node: nodeRouter,
});

export type AppRouter = typeof appRouter;


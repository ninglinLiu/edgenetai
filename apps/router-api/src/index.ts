/**
 * @file index.ts
 * @description Router API entry point
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
// @ts-ignore - Fastify adapter import
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routes/index.js';
import { initDb, closeDb } from './db/client.js';
import { SERVER_CONFIG, LOG_CONFIG } from './config.js';
import { createDispatchWorker } from './workers/dispatch.js';
import pino from 'pino';

// Logger
const logger = pino({
  level: LOG_CONFIG.level,
  transport:
    LOG_CONFIG.format === 'pretty'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
});

async function main() {
  // Initialize database
  await initDb();
  logger.info('Database initialized');

  // Start dispatch worker
  const dispatchWorker = createDispatchWorker();
  logger.info('Dispatch worker started');

  // Create Fastify instance
  const server = Fastify({
    logger,
  });

  // Register plugins
  await server.register(cors, {
    origin: true,
  });

  // Register tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: () => ({}),
    },
  });

  // Health check
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Start server
  try {
    await server.listen({ port: SERVER_CONFIG.port, host: SERVER_CONFIG.host });
    logger.info(`Router API listening on http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down...');
    await dispatchWorker.close();
    await closeDb();
    await server.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


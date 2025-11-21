/**
 * @file index.ts
 * @description Verifier service entry point
 */

import { createVerifyWorker } from './workers/verify.js';
import { createSettleWorker } from './workers/settle.js';
import { VERIFIER_CONFIG, LOG_CONFIG } from './config.js';
import { closeDb } from './db/client.js';
import pino from 'pino';

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
  logger.info('Starting verifier service...');

  // Start workers
  const verifyWorker = createVerifyWorker();
  const settleWorker = createSettleWorker();

  logger.info('Verifier workers started');

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down verifier...');
    await verifyWorker.close();
    await settleWorker.close();
    await closeDb();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


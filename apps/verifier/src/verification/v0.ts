/**
 * @file v0.ts
 * @description v0 verification: N-of-M redundancy consistency
 */

import { getDbPool } from '../db/client.js';
import { VERIFICATION_CONFIG } from '../config.js';
import type { Execution, Verification, TaskType } from '@edgenetai/proto';
import { randomUUID } from 'crypto';

/**
 * Calculate cosine similarity between two texts
 */
function cosineSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const allWords = new Set([...words1, ...words2]);

  const vec1: number[] = [];
  const vec2: number[] = [];

  for (const word of allWords) {
    vec1.push(words1.filter((w) => w === word).length);
    vec2.push(words2.filter((w) => w === word).length);
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Calculate Levenshtein distance (edit distance)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate normalized edit distance (0-1, higher = more similar)
 */
function normalizedEditDistance(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Verify N-of-M consistency for a task
 */
export async function verifyNofM(taskId: string): Promise<Verification> {
  const db = getDbPool();

  // Get task
  const taskResult = await db.query(
    `SELECT id, type, model_id FROM tasks WHERE id = $1`,
    [taskId]
  );

  if (taskResult.rows.length === 0) {
    throw new Error(`Task ${taskId} not found`);
  }

  const task = taskResult.rows[0];
  const taskType: TaskType = task.type;

  // Get all executions
  const execResult = await db.query(
    `SELECT id, task_id, node_id, output_hash, raw_output, latency_ms
     FROM executions WHERE task_id = $1`,
    [taskId]
  );

  if (execResult.rows.length < VERIFICATION_CONFIG.minConsensusNodes) {
    throw new Error(
      `Not enough executions: need ${VERIFICATION_CONFIG.minConsensusNodes}, got ${execResult.rows.length}`
    );
  }

  const executions: Execution[] = execResult.rows.map((row) => ({
    id: row.id,
    taskId: row.task_id,
    nodeId: row.node_id,
    outputHash: row.output_hash,
    rawOutput: row.raw_output,
    latencyMs: row.latency_ms,
    cost: '0',
    createdAt: new Date(),
  }));

  // Extract outputs
  const outputs = executions
    .map((e) => {
      try {
        return e.rawOutput ? JSON.parse(e.rawOutput) : null;
      } catch {
        return e.rawOutput || null;
      }
    })
    .filter((o) => o !== null);

  if (outputs.length < 2) {
    throw new Error('Not enough valid outputs for comparison');
  }

  // Compare outputs based on task type
  let similarities: number[] = [];
  let consensusCount = 0;
  const differences: string[] = [];

  if (taskType === 'LLM_SUMMARY') {
    // Use cosine similarity for LLM
    for (let i = 0; i < outputs.length; i++) {
      for (let j = i + 1; j < outputs.length; j++) {
        const sim = cosineSimilarity(String(outputs[i]), String(outputs[j]));
        similarities.push(sim);

        if (sim >= VERIFICATION_CONFIG.llmSimilarityThreshold) {
          consensusCount++;
        } else {
          differences.push(
            `Output ${i} vs ${j}: similarity ${sim.toFixed(3)} < threshold ${VERIFICATION_CONFIG.llmSimilarityThreshold}`
          );
        }
      }
    }
  } else if (taskType === 'OCR_IMAGE') {
    // Use normalized edit distance for OCR
    for (let i = 0; i < outputs.length; i++) {
      for (let j = i + 1; j < outputs.length; j++) {
        const sim = normalizedEditDistance(String(outputs[i]), String(outputs[j]));
        similarities.push(sim);

        if (sim >= VERIFICATION_CONFIG.ocrEditDistanceThreshold) {
          consensusCount++;
        } else {
          differences.push(
            `Output ${i} vs ${j}: similarity ${sim.toFixed(3)} < threshold ${VERIFICATION_CONFIG.ocrEditDistanceThreshold}`
          );
        }
      }
    }
  }

  // Determine result
  const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
  const threshold =
    taskType === 'LLM_SUMMARY'
      ? VERIFICATION_CONFIG.llmSimilarityThreshold
      : VERIFICATION_CONFIG.ocrEditDistanceThreshold;

  let result: 'PASS' | 'FAIL' | 'DISPUTE';
  if (avgSimilarity >= threshold && consensusCount >= similarities.length * 0.5) {
    result = 'PASS';
  } else if (avgSimilarity < threshold * 0.7) {
    result = 'FAIL';
  } else {
    result = 'DISPUTE';
  }

  // Create verification record
  const verificationId = randomUUID();
  await db.query(
    `INSERT INTO verifications (id, task_id, policy, result, details)
     VALUES ($1, $2, 'N_OF_M', $3, $4)`,
    [
      verificationId,
      taskId,
      result,
      JSON.stringify({
        similarity: avgSimilarity,
        consensusCount,
        totalNodes: executions.length,
        differences: differences.length > 0 ? differences : undefined,
      }),
    ]
  );

  // Update task status
  await db.query(`UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2`, [
    result === 'PASS' ? 'COMPLETED' : result === 'FAIL' ? 'FAILED' : 'DISPUTE',
    taskId,
  ]);

  // Update node reputation
  if (result === 'PASS') {
    const nodeIds = executions.map((e) => e.nodeId);
    await db.query(
      `UPDATE nodes SET reputation = reputation + 1, success_rate = LEAST(success_rate + 0.01, 1.0)
       WHERE id = ANY($1)`,
      [nodeIds]
    );
  }

  return {
    id: verificationId,
    taskId,
    policy: 'N_OF_M',
    result,
    details: {
      similarity: avgSimilarity,
      consensusCount,
      totalNodes: executions.length,
      differences: differences.length > 0 ? differences : undefined,
    },
    createdAt: new Date(),
  };
}


/**
 * @package @edgenetai/proto
 * @description Shared Zod schemas and TypeScript types for EdgeNet.AI
 */

import { z } from 'zod';

// ============ Task Types ============

export const TaskTypeSchema = z.enum(['LLM_SUMMARY', 'OCR_IMAGE']);
export type TaskType = z.infer<typeof TaskTypeSchema>;

export const TaskStatusSchema = z.enum([
  'PENDING',
  'DISPATCHED',
  'EXECUTING',
  'VERIFYING',
  'COMPLETED',
  'FAILED',
  'DISPUTE',
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const SLATierSchema = z.enum(['BRONZE', 'SILVER', 'GOLD']);
export type SLATier = z.infer<typeof SLATierSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  type: TaskTypeSchema,
  payloadURI: z.string().url().optional(),
  payloadBlob: z.string().optional(), // Base64 encoded
  modelId: z.string(),
  slaTier: SLATierSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  status: TaskStatusSchema,
  userId: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

// ============ Node Types ============

export const NodeSchema = z.object({
  id: z.string(),
  addr: z.string(), // Node address/URL
  stake: z.string(), // Wei amount as string
  region: z.string(),
  latencyScore: z.number().min(0).max(1),
  successRate: z.number().min(0).max(1),
  reputation: z.number().min(0),
  teeProofURI: z.string().url().optional(),
  registeredAt: z.date(),
  lastHeartbeat: z.date().optional(),
});

export type Node = z.infer<typeof NodeSchema>;

// ============ Execution Types ============

export const ExecutionSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  nodeId: z.string(),
  outputHash: z.string(), // SHA256 hash of output
  rawURI: z.string().url().optional(),
  rawOutput: z.string().optional(), // For small outputs
  latencyMs: z.number().positive(),
  cost: z.string(), // Wei as string
  teeQuote: z.string().optional(), // TEE attestation (v1)
  createdAt: z.date(),
});

export type Execution = z.infer<typeof ExecutionSchema>;

// ============ Verification Types ============

export const VerificationPolicySchema = z.enum(['N_OF_M', 'SPOT']);
export type VerificationPolicy = z.infer<typeof VerificationPolicySchema>;

export const VerificationResultSchema = z.enum(['PASS', 'FAIL', 'DISPUTE']);
export type VerificationResult = z.infer<typeof VerificationResultSchema>;

export const VerificationSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  policy: VerificationPolicySchema,
  result: VerificationResultSchema,
  detailURI: z.string().url().optional(),
  details: z
    .object({
      similarity: z.number().optional(),
      consensusCount: z.number().optional(),
      totalNodes: z.number().optional(),
      differences: z.array(z.string()).optional(),
    })
    .optional(),
  createdAt: z.date(),
});

export type Verification = z.infer<typeof VerificationSchema>;

// ============ Receipt Types ============

export const ReceiptSchema = z.object({
  jobId: z.string(),
  modelHash: z.string(),
  latencyMs: z.number(),
  verifierSig: z.string().optional(),
  blockHash: z.string().optional(),
  txHash: z.string().optional(),
  blockNumber: z.number().optional(),
  timestamp: z.number().optional(),
  nodeSetRoot: z.string().optional(),
  ipfsCID: z.string().optional(),
});

export type Receipt = z.infer<typeof ReceiptSchema>;

// ============ API Request/Response Types ============

export const CreateTaskRequestSchema = z.object({
  type: TaskTypeSchema,
  payload: z.union([
    z.string(), // Text for LLM
    z.string().base64(), // Image for OCR
  ]),
  modelId: z.string().default('llama3:8b'),
  slaTier: SLATierSchema.default('SILVER'),
});

export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

export const CreateTaskResponseSchema = z.object({
  taskId: z.string().uuid(),
  status: TaskStatusSchema,
  estimatedCost: z.string().optional(),
});

export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

export const TaskStatusResponseSchema = z.object({
  task: TaskSchema,
  executions: z.array(ExecutionSchema).optional(),
  verification: VerificationSchema.optional(),
  receipt: ReceiptSchema.optional(),
});

export type TaskStatusResponse = z.infer<typeof TaskStatusResponseSchema>;

export const RegisterNodeRequestSchema = z.object({
  addr: z.string().url(),
  region: z.string(),
  stake: z.string(),
});

export type RegisterNodeRequest = z.infer<typeof RegisterNodeRequestSchema>;

export const NodeHeartbeatSchema = z.object({
  nodeId: z.string(),
  latency: z.number().positive(),
  load: z.number().min(0).max(1),
  available: z.boolean(),
});

export type NodeHeartbeat = z.infer<typeof NodeHeartbeatSchema>;

// ============ Error Response ============

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  detail: z.unknown().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ============ Helper Functions ============

export function createErrorResponse(
  code: string,
  message: string,
  detail?: unknown
): ErrorResponse {
  return { code, message, detail };
}

// SLA Tier to Node Count mapping
export const SLA_NODE_COUNTS: Record<SLATier, number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
};

export function getNodeCountForSLA(slaTier: SLATier): number {
  return SLA_NODE_COUNTS[slaTier];
}


// EdgeApi Types - 统一的数据类型定义

export enum TaskType {
  LLM_SUMMARY = 'LLM_SUMMARY',
  OCR_IMAGE = 'OCR_IMAGE',
}

export enum TaskStatus {
  QUEUED = 'QUEUED',
  ASSIGNED = 'ASSIGNED',
  INFERENCE = 'INFERENCE',
  PROOF = 'PROOF',
  VERIFIED = 'VERIFIED',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
}

export enum SLATier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
}

export enum VerificationResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  DISPUTE = 'DISPUTE',
}

export interface Task {
  id: string;
  type: TaskType;
  payload: string;
  slaTier: SLATier;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  selectedNodes?: string[];
  modelHash?: string;
  latency?: number;
  result?: TaskResult;
  receiptId?: string;
}

export interface TaskResult {
  summary?: string; // For LLM_SUMMARY
  ocrText?: string; // For OCR_IMAGE
  similarityScore?: number;
  editDistance?: number;
  verificationResult: VerificationResult;
}

export interface Node {
  id: string;
  address: string;
  status: 'online' | 'offline';
  stake: string;
  uptime: number; // percentage
  throughput: number; // tasks/hour
  avgLatency: number; // ms
  passRate: number; // percentage
  slashingEvents: number;
  region?: string;
  reputation?: number;
}

export interface Receipt {
  receiptId: string;
  jobId: string;
  txHash: string;
  blockNumber: number;
  chain: string;
  verifier: string;
  nodeSet: string[];
  modelHash: string;
  latency: number;
  timestamp: string;
  ipfsCID?: string;
}

export interface NetworkStats {
  onlineNodes: number;
  totalNodes: number;
  tasks24h: number;
  avgLatency: number;
  passRate: number;
  settlement24h: number; // amount in ETH
  tps: number; // transactions per second
  disputeRate: number;
}

export interface ActivityItem {
  id: string;
  type: 'task_created' | 'task_verified' | 'receipt_mined' | 'node_online' | 'node_offline';
  timestamp: string;
  data: {
    taskId?: string;
    receiptId?: string;
    nodeId?: string;
    status?: string;
    [key: string]: any;
  };
}

export interface ThroughputDataPoint {
  timestamp: string;
  value: number;
}

export interface LatencyDataPoint {
  timestamp: string;
  value: number;
}

export interface OutcomeData {
  pass: number;
  fail: number;
  dispute: number;
}

export interface CreateTaskRequest {
  type: TaskType;
  payload: string;
  slaTier: SLATier;
}

export interface CreateTaskResponse {
  taskId: string;
  status: TaskStatus;
}

export interface TaskTimelineStep {
  status: TaskStatus;
  timestamp: string;
  duration?: number; // ms
}

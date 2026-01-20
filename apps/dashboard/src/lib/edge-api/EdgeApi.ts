// EdgeApi Interface - 定义统一的数据访问接口
import type {
  Task,
  Node,
  Receipt,
  NetworkStats,
  ActivityItem,
  ThroughputDataPoint,
  LatencyDataPoint,
  OutcomeData,
  CreateTaskRequest,
  CreateTaskResponse,
  TaskTimelineStep,
} from './types';

export interface EdgeApi {
  // Network
  getNetworkStats(): Promise<NetworkStats>;
  getThroughputData(hours: number): Promise<ThroughputDataPoint[]>;
  getLatencyData(hours: number): Promise<LatencyDataPoint[]>;
  getOutcomeData(): Promise<OutcomeData>;
  
  // Tasks
  listTasks(filters?: {
    status?: string;
    type?: string;
    slaTier?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  getTaskTimeline(id: string): Promise<TaskTimelineStep[]>;
  createTask(request: CreateTaskRequest): Promise<CreateTaskResponse>;
  
  // Nodes
  listNodes(filters?: {
    status?: 'online' | 'offline';
    region?: string;
  }): Promise<Node[]>;
  getNode(id: string): Promise<Node | null>;
  getNodeTasks(nodeId: string, limit?: number): Promise<Task[]>;
  getNodeChartData(nodeId: string, hours: number): Promise<{
    tasks: ThroughputDataPoint[];
    successRate: ThroughputDataPoint[];
  }>;
  
  // Receipts
  listReceipts(filters?: {
    jobId?: string;
    txHash?: string;
  }): Promise<Receipt[]>;
  getReceipt(id: string): Promise<Receipt | null>;
  
  // Activity Feed
  subscribeActivity(
    callback: (activity: ActivityItem) => void
  ): () => void; // Returns unsubscribe function
}

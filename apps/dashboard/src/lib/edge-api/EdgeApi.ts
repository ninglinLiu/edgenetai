// EdgeApi defines the dashboard's data-access boundary.
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

export interface TaskFilters {
  status?: string;
  type?: string;
  slaTier?: string;
  startTime?: string;
  endTime?: string;
}

export interface NodeFilters {
  status?: 'online' | 'offline';
  region?: string;
}

export interface ReceiptFilters {
  jobId?: string;
  txHash?: string;
}

export interface EdgeApi {
  // Network
  getNetworkStats(): Promise<NetworkStats>;
  getThroughputData(hours: number): Promise<ThroughputDataPoint[]>;
  getLatencyData(hours: number): Promise<LatencyDataPoint[]>;
  getOutcomeData(): Promise<OutcomeData>;
  
  // Tasks
  listTasks(filters?: TaskFilters): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  getTaskTimeline(id: string): Promise<TaskTimelineStep[]>;
  createTask(request: CreateTaskRequest): Promise<CreateTaskResponse>;
  
  // Nodes
  listNodes(filters?: NodeFilters): Promise<Node[]>;
  getNode(id: string): Promise<Node | null>;
  getNodeTasks(nodeId: string, limit?: number): Promise<Task[]>;
  getNodeChartData(nodeId: string, hours: number): Promise<{
    tasks: ThroughputDataPoint[];
    successRate: ThroughputDataPoint[];
  }>;
  
  // Receipts
  listReceipts(filters?: ReceiptFilters): Promise<Receipt[]>;
  getReceipt(id: string): Promise<Receipt | null>;
  
  // Activity Feed
  subscribeActivity(
    callback: (activity: ActivityItem) => void
  ): () => void;
}

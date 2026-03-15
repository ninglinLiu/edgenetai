// TrpcEdgeApi is a scaffold for the future live client implementation.
import type { EdgeApi, NodeFilters, ReceiptFilters, TaskFilters } from '../EdgeApi';
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
} from '../types';

// TODO: Import the generated tRPC client when the live API is ready.
// import { trpc } from '@/lib/trpc';

export class TrpcEdgeApi implements EdgeApi {
  async getNetworkStats(): Promise<NetworkStats> {
    // TODO: Call the live tRPC procedure.
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getThroughputData(hours: number): Promise<ThroughputDataPoint[]> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getLatencyData(hours: number): Promise<LatencyDataPoint[]> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getOutcomeData(): Promise<OutcomeData> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async listTasks(filters?: TaskFilters): Promise<Task[]> {
    void filters;
    // TODO: Call the live task.list procedure.
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getTask(id: string): Promise<Task | null> {
    void id;
    // TODO: Call the live task.status procedure.
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getTaskTimeline(id: string): Promise<TaskTimelineStep[]> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    void request;
    // TODO: Call the live task.create procedure.
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async listNodes(filters?: NodeFilters): Promise<Node[]> {
    void filters;
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getNode(id: string): Promise<Node | null> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getNodeTasks(nodeId: string, limit?: number): Promise<Task[]> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getNodeChartData(nodeId: string, hours: number): Promise<{
    tasks: ThroughputDataPoint[];
    successRate: ThroughputDataPoint[];
  }> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async listReceipts(filters?: ReceiptFilters): Promise<Receipt[]> {
    void filters;
    // TODO: Call the live receipt procedure.
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getReceipt(id: string): Promise<Receipt | null> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  subscribeActivity(callback: (activity: ActivityItem) => void): () => void {
    void callback;
    // TODO: Use a live tRPC subscription when available.
    return () => {};
  }
}

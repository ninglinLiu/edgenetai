// TrpcEdgeApi - tRPC 实现（待完善）
import type { EdgeApi } from '../EdgeApi';
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

// TODO: 导入 tRPC client
// import { trpc } from '@/lib/trpc';

export class TrpcEdgeApi implements EdgeApi {
  async getNetworkStats(): Promise<NetworkStats> {
    // TODO: 调用 tRPC procedure
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

  async listTasks(filters?: any): Promise<Task[]> {
    // TODO: 调用 tRPC task.list procedure
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getTask(id: string): Promise<Task | null> {
    // TODO: 调用 tRPC task.status procedure
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getTaskTimeline(id: string): Promise<TaskTimelineStep[]> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    // TODO: 调用 tRPC task.create procedure
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async listNodes(filters?: any): Promise<Node[]> {
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

  async listReceipts(filters?: any): Promise<Receipt[]> {
    // TODO: 调用 tRPC task.receipt procedure
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  async getReceipt(id: string): Promise<Receipt | null> {
    throw new Error('Not implemented: Use MockEdgeApi for now');
  }

  subscribeActivity(callback: (activity: ActivityItem) => void): () => void {
    // TODO: 使用 tRPC subscription
    return () => {};
  }
}

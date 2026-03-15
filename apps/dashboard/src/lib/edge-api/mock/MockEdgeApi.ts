// MockEdgeApi powers the static dashboard demo with seeded data.
// Future work could add state transitions, activity events, and persistence.

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
import {
  TaskStatus,
  TaskType,
  SLATier,
  VerificationResult,
} from '../types';

export class MockEdgeApi implements EdgeApi {
  private tasks: Map<string, Task> = new Map();
  private nodes: Map<string, Node> = new Map();
  private receipts: Map<string, Receipt> = new Map();
  private activityCallbacks: Set<(activity: ActivityItem) => void> = new Set();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed nodes
    for (let i = 0; i < 10; i++) {
      const nodeId = `node-${i}`;
      this.nodes.set(nodeId, {
        id: nodeId,
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        status: i < 8 ? 'online' : 'offline',
        stake: (Math.random() * 1000).toFixed(4),
        uptime: 85 + Math.random() * 15,
        throughput: 10 + Math.random() * 20,
        avgLatency: 100 + Math.random() * 200,
        passRate: 80 + Math.random() * 20,
        slashingEvents: Math.floor(Math.random() * 3),
        region: ['US', 'EU', 'ASIA'][Math.floor(Math.random() * 3)],
        reputation: 70 + Math.random() * 30,
      });
    }

    // Seed tasks
    const statuses: TaskStatus[] = [
      TaskStatus.QUEUED,
      TaskStatus.ASSIGNED,
      TaskStatus.INFERENCE,
      TaskStatus.PROOF,
      TaskStatus.VERIFIED,
      TaskStatus.SETTLED,
    ];
    for (let i = 0; i < 30; i++) {
      const taskId = `task-${i}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      this.tasks.set(taskId, {
        id: taskId,
        type: Math.random() > 0.5 ? TaskType.LLM_SUMMARY : TaskType.OCR_IMAGE,
        payload: 'mock payload',
        slaTier: [SLATier.BRONZE, SLATier.SILVER, SLATier.GOLD][Math.floor(Math.random() * 3)],
        status,
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        latency: status !== TaskStatus.QUEUED ? Math.floor(100 + Math.random() * 500) : undefined,
        result: status === 'VERIFIED' || status === 'SETTLED' ? {
          summary: 'Mock summary result',
          verificationResult: Math.random() > 0.15 ? VerificationResult.PASS : VerificationResult.DISPUTE,
          similarityScore: 0.85 + Math.random() * 0.15,
        } : undefined,
      });
    }

    // Seed receipts
    for (let i = 0; i < 10; i++) {
      const receiptId = `receipt-${i}`;
      this.receipts.set(receiptId, {
        receiptId,
        jobId: `task-${i}`,
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        blockNumber: 1000000 + i,
        chain: 'anvil',
        verifier: `0x${Math.random().toString(16).slice(2, 42)}`,
        nodeSet: Array.from({ length: 3 }, () => `node-${Math.floor(Math.random() * 10)}`),
        modelHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        latency: Math.floor(100 + Math.random() * 500),
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      });
    }
  }

  async getNetworkStats(): Promise<NetworkStats> {
    return Promise.resolve({
      onlineNodes: 8,
      totalNodes: 10,
      tasks24h: 150,
      avgLatency: 250,
      passRate: 92.5,
      settlement24h: 12.5,
      tps: 2.5,
      disputeRate: 5.2,
    });
  }

  async getThroughputData(hours: number): Promise<ThroughputDataPoint[]> {
    const now = Date.now();
    return Promise.resolve(Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
      value: 1.5 + Math.random() * 2,
    })));
  }

  async getLatencyData(hours: number): Promise<LatencyDataPoint[]> {
    const now = Date.now();
    return Promise.resolve(Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
      value: 200 + Math.random() * 300,
    })));
  }

  async getOutcomeData(): Promise<OutcomeData> {
    return Promise.resolve({
      pass: 85,
      fail: 5,
      dispute: 10,
    });
  }

  async listTasks(filters?: TaskFilters): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values());
    if (filters?.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters?.type) {
      tasks = tasks.filter(t => t.type === filters.type);
    }
    if (filters?.slaTier) {
      tasks = tasks.filter(t => t.slaTier === filters.slaTier);
    }
    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTask(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async getTaskTimeline(id: string): Promise<TaskTimelineStep[]> {
    const task = this.tasks.get(id);
    if (!task) return [];

    const statusOrder: TaskStatus[] = [
      TaskStatus.QUEUED,
      TaskStatus.ASSIGNED,
      TaskStatus.INFERENCE,
      TaskStatus.PROOF,
      TaskStatus.VERIFIED,
      TaskStatus.SETTLED,
    ];
    const currentIndex = statusOrder.indexOf(task.status);
    const baseTime = new Date(task.createdAt).getTime();

    return statusOrder.slice(0, currentIndex + 1).map((status, index) => ({
      status,
      timestamp: new Date(baseTime + index * 2000).toISOString(),
      duration: index > 0 ? 2000 : undefined,
    }));
  }

  async createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    const taskId = `task-${Date.now()}`;
    const task: Task = {
      id: taskId,
      type: request.type,
      payload: request.payload,
      slaTier: request.slaTier,
      status: TaskStatus.QUEUED as TaskStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(taskId, task);

    // Future demo work: simulate status transitions and emit activity events.

    return { taskId, status: TaskStatus.QUEUED };
  }

  async listNodes(filters?: NodeFilters): Promise<Node[]> {
    let nodes = Array.from(this.nodes.values());
    if (filters?.status) {
      nodes = nodes.filter(n => n.status === filters.status);
    }
    if (filters?.region) {
      nodes = nodes.filter(n => n.region === filters.region);
    }
    return nodes;
  }

  async getNode(id: string): Promise<Node | null> {
    return this.nodes.get(id) || null;
  }

  async getNodeTasks(nodeId: string, limit = 10): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(t => t.selectedNodes?.includes(nodeId))
      .slice(0, limit);
  }

  async getNodeChartData(nodeId: string, hours: number): Promise<{
    tasks: ThroughputDataPoint[];
    successRate: ThroughputDataPoint[];
  }> {
    const now = Date.now();
    return {
      tasks: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
        value: Math.floor(5 + Math.random() * 15),
      })),
      successRate: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
        value: 85 + Math.random() * 15,
      })),
    };
  }

  async listReceipts(filters?: ReceiptFilters): Promise<Receipt[]> {
    let receipts = Array.from(this.receipts.values());
    if (filters?.jobId) {
      receipts = receipts.filter(r => r.jobId === filters.jobId);
    }
    if (filters?.txHash) {
      receipts = receipts.filter(r => r.txHash.includes(filters.txHash));
    }
    return receipts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getReceipt(id: string): Promise<Receipt | null> {
    return this.receipts.get(id) || null;
  }

  subscribeActivity(callback: (activity: ActivityItem) => void): () => void {
    this.activityCallbacks.add(callback);
    // Future demo work: emit synthetic activity events to subscribers.
    return () => {
      this.activityCallbacks.delete(callback);
    };
  }
}

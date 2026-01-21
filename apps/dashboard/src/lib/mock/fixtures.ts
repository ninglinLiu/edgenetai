// Mock Fixtures - 完整的 Dashboard 数据
// 支持 Quiet / Busy / Congested 三种场景

export type DemoScenario = 'quiet' | 'busy' | 'congested';

export interface DashboardSummary {
  activeNodes: number;
  registeredNodes: number;
  tps: number;
  latencyP50: number;
  latencyP95: number;
  passRate: number;
  queueDepth: {
    router: number;
    verify: number;
    settlement: number;
  };
  disputeRate: number;
  failedRate: number;
  tasks24h: number;
  settlement24h: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  pending: number;
  avgDuration: number;
  successRate: number;
  description: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface Node {
  id: string;
  address: string;
  region: string;
  uptime: number;
  modelSupport: string[];
  latency: number;
  successRate: number;
  health: 'healthy' | 'degraded' | 'offline';
  tasksCompleted: number;
  reputation: number;
}

export interface Task {
  id: string;
  type: 'LLM_SUMMARY' | 'OCR_IMAGE';
  status: 'QUEUED' | 'ASSIGNED' | 'INFERENCE' | 'VERIFIED' | 'SETTLED' | 'FAILED';
  slaTier: 'BRONZE' | 'SILVER' | 'GOLD';
  createdAt: string;
  latency?: number;
  nodes?: string[];
  similarityScore?: number;
  verdict?: 'PASS' | 'FAIL' | 'DISPUTE';
  receiptTxHash?: string;
}

export interface Receipt {
  receiptId: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  taskId: string;
  verdict: 'PASS' | 'FAIL' | 'DISPUTE';
  gasUsed: number;
}

export interface Event {
  id: string;
  type: 'node_joined' | 'dispute' | 'queue_backlog' | 'contract_event' | 'task_verified';
  timestamp: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastHeartbeat: string;
  latency?: number;
}

export interface QueueStatus {
  name: string;
  depth: number;
  processing: number;
  avgWaitTime: number;
}

// Scenario-based data generators
const scenarios: Record<DemoScenario, Partial<DashboardSummary>> = {
  quiet: {
    tps: 0.8,
    latencyP50: 180,
    latencyP95: 320,
    passRate: 96.5,
    disputeRate: 2.1,
    failedRate: 1.4,
    queueDepth: { router: 3, verify: 1, settlement: 0 },
  },
  busy: {
    tps: 3.2,
    latencyP50: 280,
    latencyP95: 520,
    passRate: 93.2,
    disputeRate: 4.8,
    failedRate: 2.0,
    queueDepth: { router: 12, verify: 5, settlement: 2 },
  },
  congested: {
    tps: 5.8,
    latencyP50: 450,
    latencyP95: 880,
    passRate: 88.5,
    disputeRate: 8.2,
    failedRate: 3.3,
    queueDepth: { router: 45, verify: 18, settlement: 8 },
  },
};

export function getDashboardSummary(scenario: DemoScenario = 'busy'): DashboardSummary {
  const base = scenarios[scenario];
  return {
    activeNodes: scenario === 'congested' ? 9 : scenario === 'busy' ? 8 : 7,
    registeredNodes: 10,
    tps: base.tps!,
    latencyP50: base.latencyP50!,
    latencyP95: base.latencyP95!,
    passRate: base.passRate!,
    queueDepth: base.queueDepth!,
    disputeRate: base.disputeRate!,
    failedRate: base.failedRate!,
    tasks24h: scenario === 'congested' ? 420 : scenario === 'busy' ? 280 : 120,
    settlement24h: scenario === 'congested' ? 18.5 : scenario === 'busy' ? 12.3 : 5.2,
  };
}

export function getPipelineStages(scenario: DemoScenario = 'busy'): PipelineStage[] {
  const queueDepth = scenarios[scenario]!.queueDepth!;
  return [
    {
      id: 'submit',
      name: 'Submit',
      pending: 0,
      avgDuration: 50,
      successRate: 100,
      description: 'Task submission and validation',
    },
    {
      id: 'dispatch',
      name: 'Dispatch',
      pending: queueDepth.router,
      avgDuration: 120,
      successRate: 99.5,
      description: 'Router API dispatches tasks to node agents via BullMQ',
    },
    {
      id: 'execute',
      name: 'N-of-M Execute',
      pending: 0,
      avgDuration: scenario === 'congested' ? 450 : scenario === 'busy' ? 280 : 180,
      successRate: 98.2,
      description: 'Multiple nodes execute inference in parallel (N-of-M redundancy)',
    },
    {
      id: 'verify',
      name: 'Verify',
      pending: queueDepth.verify,
      avgDuration: 80,
      successRate: 95.8,
      description: 'Verifier compares N-of-M results using cosine similarity (LLM) or edit distance (OCR)',
    },
    {
      id: 'settle',
      name: 'Settle',
      pending: queueDepth.settlement,
      avgDuration: 200,
      successRate: 99.9,
      description: 'Settlement worker creates on-chain receipt via Solidity contract',
    },
    {
      id: 'receipt',
      name: 'On-chain Receipt',
      pending: 0,
      avgDuration: 150,
      successRate: 100,
      description: 'Receipt mined on-chain, task complete',
    },
  ];
}

export function getTimeSeriesData(
  hours: number,
  scenario: DemoScenario = 'busy',
  type: 'tps' | 'latencyP50' | 'latencyP95' | 'passRate'
): TimeSeriesPoint[] {
  const now = Date.now();
  const baseValue = scenarios[scenario]![type === 'tps' ? 'tps' : type === 'latencyP50' ? 'latencyP50' : type === 'latencyP95' ? 'latencyP95' : 'passRate'] as number;
  
  return Array.from({ length: hours }, (_, i) => {
    const timestamp = new Date(now - (hours - 1 - i) * 3600000).toISOString();
    const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
    let value = baseValue * (1 + variance);
    
    if (type === 'passRate') {
      value = Math.max(85, Math.min(99, value));
    } else if (type === 'tps') {
      value = Math.max(0.1, value);
    } else {
      value = Math.max(100, value);
    }
    
    return { timestamp, value: Number(value.toFixed(2)) };
  });
}

export function getNodes(scenario: DemoScenario = 'busy'): Node[] {
  const count = scenario === 'congested' ? 9 : scenario === 'busy' ? 8 : 7;
  const baseLatency = scenarios[scenario]!.latencyP50!;
  
  return Array.from({ length: 10 }, (_, i) => {
    const isOnline = i < count;
    return {
      id: `node-${i}`,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      region: ['US-East', 'EU-West', 'APAC', 'US-West'][i % 4],
      uptime: isOnline ? 95 + Math.random() * 5 : 0,
      modelSupport: Math.random() > 0.5 ? ['LLM', 'OCR'] : ['LLM'],
      latency: isOnline ? baseLatency + (Math.random() - 0.5) * 100 : 0,
      successRate: isOnline ? 90 + Math.random() * 8 : 0,
      health: isOnline ? (Math.random() > 0.15 ? 'healthy' : 'degraded') : 'offline',
      tasksCompleted: isOnline ? Math.floor(50 + Math.random() * 200) : 0,
      reputation: isOnline ? 70 + Math.random() * 30 : 0,
    };
  });
}

export function getTasks(scenario: DemoScenario = 'busy'): Task[] {
  const count = scenario === 'congested' ? 50 : scenario === 'busy' ? 30 : 15;
  const statuses: Task['status'][] = ['QUEUED', 'ASSIGNED', 'INFERENCE', 'VERIFIED', 'SETTLED', 'FAILED'];
  const types: Task['type'][] = ['LLM_SUMMARY', 'OCR_IMAGE'];
  const slaTiers: Task['slaTier'][] = ['BRONZE', 'SILVER', 'GOLD'];
  
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.random() * 86400000).toISOString();
    
    return {
      id: `task-${Date.now()}-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      status,
      slaTier: slaTiers[Math.floor(Math.random() * slaTiers.length)],
      createdAt,
      latency: status !== 'QUEUED' ? Math.floor(200 + Math.random() * 400) : undefined,
      nodes: status !== 'QUEUED' ? [`node-${Math.floor(Math.random() * 10)}`] : undefined,
      similarityScore: status === 'VERIFIED' || status === 'SETTLED' ? 0.85 + Math.random() * 0.15 : undefined,
      verdict: status === 'VERIFIED' || status === 'SETTLED' ? (Math.random() > 0.1 ? 'PASS' as const : 'DISPUTE' as const) : undefined,
      receiptTxHash: status === 'SETTLED' ? `0x${Math.random().toString(16).slice(2, 66)}` : undefined,
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReceipts(scenario: DemoScenario = 'busy'): Receipt[] {
  const count = scenario === 'congested' ? 25 : scenario === 'busy' ? 15 : 8;
  
  return Array.from({ length: count }, (_, i) => ({
    receiptId: `receipt-${i}`,
    txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
    blockNumber: 1000000 + i,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    taskId: `task-${i}`,
    verdict: (Math.random() > 0.1 ? 'PASS' as const : (Math.random() > 0.5 ? 'FAIL' as const : 'DISPUTE' as const)),
    gasUsed: Math.floor(80000 + Math.random() * 40000),
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getEvents(scenario: DemoScenario = 'busy'): Event[] {
  const eventTypes: Event['type'][] = ['node_joined', 'dispute', 'queue_backlog', 'contract_event', 'task_verified'];
  const severities: Event['severity'][] = ['info', 'warning', 'error'];
  
  return Array.from({ length: 20 }, (_, i) => {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = type === 'dispute' ? 'warning' : type === 'queue_backlog' && scenario === 'congested' ? 'error' : 'info';
    
    return {
      id: `event-${i}`,
      type,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      message: `${type.replace('_', ' ')} event occurred`,
      severity,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getServiceStatuses(scenario: DemoScenario = 'busy'): ServiceStatus[] {
  const services = ['Router API', 'Verifier', 'Node Agents', 'Redis', 'Postgres'];
  const isCongested = scenario === 'congested';
  
  return services.map((name, i) => ({
    name,
    status: isCongested && i === 1 ? 'degraded' : 'healthy',
    lastHeartbeat: new Date(Date.now() - Math.random() * 5000).toISOString(),
    latency: Math.floor(10 + Math.random() * 50),
  }));
}

export function getQueueStatuses(scenario: DemoScenario = 'busy'): QueueStatus[] {
  const queueDepth = scenarios[scenario]!.queueDepth!;
  
  return [
    {
      name: 'Router Queue',
      depth: queueDepth.router,
      processing: Math.floor(queueDepth.router * 0.3),
      avgWaitTime: queueDepth.router * 50,
    },
    {
      name: 'Verify Queue',
      depth: queueDepth.verify,
      processing: Math.floor(queueDepth.verify * 0.4),
      avgWaitTime: queueDepth.verify * 80,
    },
    {
      name: 'Settlement Queue',
      depth: queueDepth.settlement,
      processing: Math.floor(queueDepth.settlement * 0.2),
      avgWaitTime: queueDepth.settlement * 200,
    },
  ];
}

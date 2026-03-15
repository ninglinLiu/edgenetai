'use client';

import { useState, useMemo } from 'react';
import type { DemoScenario } from '@/lib/mock/fixtures';
import {
  getDashboardSummary,
  getPipelineStages,
  getTimeSeriesData,
  getNodes,
  getTasks,
  getReceipts,
  getEvents,
  getServiceStatuses,
  getQueueStatuses,
} from '@/lib/mock/fixtures';

export function useDemoData(initialScenario: DemoScenario = 'busy') {
  const [scenario, setScenario] = useState<DemoScenario>(initialScenario);

  const data = useMemo(() => {
    try {
      // Fixture generation is synchronous, so return data immediately.
      return {
        summary: getDashboardSummary(scenario),
        pipelineStages: getPipelineStages(scenario),
        tpsData: getTimeSeriesData(24, scenario, 'tps'),
        latencyP50Data: getTimeSeriesData(24, scenario, 'latencyP50'),
        latencyP95Data: getTimeSeriesData(24, scenario, 'latencyP95'),
        passRateData: getTimeSeriesData(24, scenario, 'passRate'),
        nodes: getNodes(scenario),
        tasks: getTasks(scenario),
        receipts: getReceipts(scenario),
        events: getEvents(scenario),
        services: getServiceStatuses(scenario),
        queues: getQueueStatuses(scenario),
      };
    } catch (error) {
      console.error('[useDemoData] Error generating data:', error);
      // Fall back to the default demo scenario if fixture generation fails.
      const defaultScenario: DemoScenario = 'busy';
      return {
        summary: getDashboardSummary(defaultScenario),
        pipelineStages: getPipelineStages(defaultScenario),
        tpsData: getTimeSeriesData(24, defaultScenario, 'tps'),
        latencyP50Data: getTimeSeriesData(24, defaultScenario, 'latencyP50'),
        latencyP95Data: getTimeSeriesData(24, defaultScenario, 'latencyP95'),
        passRateData: getTimeSeriesData(24, defaultScenario, 'passRate'),
        nodes: getNodes(defaultScenario),
        tasks: getTasks(defaultScenario),
        receipts: getReceipts(defaultScenario),
        events: getEvents(defaultScenario),
        services: getServiceStatuses(defaultScenario),
        queues: getQueueStatuses(defaultScenario),
      };
    }
  }, [scenario]);

  return {
    ...data,
    scenario,
    setScenario,
  };
}

'use client';

import { useEffect, useState } from 'react';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import type { NetworkStats } from '@/lib/edge-api/types';

export function useNetworkStats() {
  let api;
  try {
    api = useEdgeApi();
  } catch (err) {
    console.error('[useNetworkStats] useEdgeApi failed:', err);
    return { stats: null, loading: false };
  }
  
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const data = await api.getNetworkStats();
        if (mounted) {
          setStats(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('[useNetworkStats] Failed to fetch network stats:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [api]);

  return { stats, loading };
}

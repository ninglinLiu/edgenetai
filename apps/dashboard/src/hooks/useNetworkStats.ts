'use client';

import { useEffect, useState } from 'react';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import type { NetworkStats } from '@/lib/edge-api/types';

export function useNetworkStats() {
  console.log('[useNetworkStats] Hook called');
  let api;
  try {
    api = useEdgeApi();
    console.log('[useNetworkStats] useEdgeApi succeeded');
  } catch (err) {
    console.error('[useNetworkStats] useEdgeApi failed:', err);
    return { stats: null, loading: false };
  }
  
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[useNetworkStats] useEffect running');
    let mounted = true;

    const fetchStats = async () => {
      try {
        console.log('[useNetworkStats] Calling getNetworkStats...');
        const data = await api.getNetworkStats();
        console.log('[useNetworkStats] getNetworkStats result:', data);
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

'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { EdgeApi } from './EdgeApi';
import { TrpcEdgeApi } from './trpc/TrpcEdgeApi';

// 直接导入 MockEdgeApi
import { MockEdgeApi } from './mock/MockEdgeApi';

const EdgeApiContext = createContext<EdgeApi | null>(null);

export function EdgeApiProvider({ children }: { children: React.ReactNode }) {
  const api = useMemo(() => {
    if (typeof window === 'undefined') {
      // Server-side: return a dummy API to avoid errors
      console.log('[EdgeApiProvider] Server-side render, returning dummy API');
      return new MockEdgeApi();
    }
    
    const mode = process.env.NEXT_PUBLIC_EDGE_API_MODE || 'mock';
    console.log('[EdgeApiProvider] Client-side, mode:', mode);
    
    if (mode === 'trpc') {
      return new TrpcEdgeApi();
    } else {
      const mockApi = new MockEdgeApi();
      console.log('[EdgeApiProvider] Using MockEdgeApi mode, instance created');
      return mockApi;
    }
  }, []);

  return (
    <EdgeApiContext.Provider value={api}>
      {children}
    </EdgeApiContext.Provider>
  );
}

export function useEdgeApi(): EdgeApi {
  const api = useContext(EdgeApiContext);
  if (!api) {
    throw new Error('useEdgeApi must be used within EdgeApiProvider');
  }
  return api;
}

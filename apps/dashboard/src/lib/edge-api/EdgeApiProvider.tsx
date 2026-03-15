'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { EdgeApi } from './EdgeApi';
import { MockEdgeApi } from './mock/MockEdgeApi';

const EdgeApiContext = createContext<EdgeApi | null>(null);

export function EdgeApiProvider({ children }: { children: React.ReactNode }) {
  const api = useMemo(() => {
    if (typeof window === 'undefined') {
      // Return the mock implementation during server rendering.
      return new MockEdgeApi();
    }

    const configuredMode = process.env.NEXT_PUBLIC_EDGE_API_MODE || 'mock';

    // The tRPC client is scaffolded but not ready for demo use yet.
    if (configuredMode === 'trpc') {
      return new MockEdgeApi();
    }

    return new MockEdgeApi();
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

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { anvil, sepolia } from 'wagmi/chains';
import { useState } from 'react';

const chains = [anvil, sepolia] as const;

const config = createConfig({
  chains,
  transports: {
    [anvil.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'),
    [sepolia.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}


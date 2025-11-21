# EdgeNet.AI - PoI (Proof-of-Inference) DePIN MVP

> **48-hour MVP**: End-to-end PoI system with on-chain settlement and real-time dashboard.

## 🎯 Overview

EdgeNet.AI is a decentralized inference network that provides **Proof-of-Inference (PoI)** verification for AI tasks. Users submit inference jobs (LLM summarization or OCR), which are executed redundantly across multiple nodes, verified for consistency, and settled on-chain with verifiable receipts.

## 🏗️ Architecture

```
┌─────────────┐
│  Dashboard  │ (Next.js + tRPC + wagmi)
└──────┬──────┘
       │
┌──────▼──────────┐
│  Router API     │ (Fastify + tRPC + BullMQ)
└──────┬──────────┘
       │
   ┌───┴───┬──────────┐
   │       │          │
┌──▼──┐ ┌─▼───┐  ┌───▼────┐
│Node1│ │Node2│  │Verifier│
└──┬──┘ └─┬───┘  └───┬────┘
   │      │          │
   └──────┴──────────┘
          │
    ┌─────▼─────┐
    │  Contract │ (Foundry + Solidity)
    └───────────┘
```

## 📦 Tech Stack

- **Monorepo**: pnpm workspaces + Turbo
- **Frontend**: Next.js 14 (App Router) + tRPC + Tailwind + shadcn + wagmi + viem
- **Backend**: Node 20 + Fastify + tRPC + BullMQ + Zod
- **Verifier**: TypeScript (Node 20)
- **Node Agent**: Python 3.11 + FastAPI + Ollama + PaddleOCR
- **Contracts**: Foundry + Solidity 0.8.24
- **Infra**: Docker Compose (Redis, Postgres, Ollama)
- **Chain**: Anvil (local) / Sepolia (testnet)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- Foundry (for contracts)
- Python 3.11+ (for node-agent)
- Ollama (or will be pulled via Docker)

### Installation

```bash
# Install dependencies
make install
# or
pnpm install

# Start infrastructure (Redis, Postgres, Ollama)
make up

# Start Anvil (in separate terminal)
make anvil

# In another terminal, deploy contracts
cd packages/contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast

# Start all apps in dev mode
pnpm dev
```

### Access Points

- **Dashboard**: http://localhost:3000
- **Router API**: http://localhost:3001
- **Verifier**: http://localhost:3002
- **Node Agent 1**: http://localhost:8001
- **Node Agent 2**: http://localhost:8002
- **Anvil RPC**: http://localhost:8545

## 📋 Project Structure

```
edgenetai/
├── apps/
│   ├── dashboard/          # Next.js frontend
│   ├── router-api/         # Fastify + tRPC API
│   ├── verifier/           # Verification service
│   └── node-agent/         # Python FastAPI agent
├── packages/
│   ├── contracts/          # Foundry Solidity contracts
│   ├── proto/              # tRPC/JSON schemas
│   └── sdk/                # JS/TS client SDK
├── infra/
│   ├── docker-compose.yml  # Infrastructure services
│   └── anvil.json          # Anvil config
└── Makefile                # Common commands
```

## 🎬 Demo Flow

1. Navigate to `/submit` in dashboard
2. Upload text (for LLM summary) or image (for OCR)
3. Select SLA tier (Bronze/Silver/Gold → determines N redundancy)
4. Router dispatches to N nodes
5. Nodes execute in parallel
6. Verifier checks N-of-M consistency
7. On-chain receipt emitted via contract
8. Dashboard shows txHash and receipt details
9. Leaderboard updates with node reputation

## 🔧 Makefile Commands

- `make install` - Install all dependencies
- `make up` - Start Docker services
- `make down` - Stop Docker services
- `make anvil` - Start local Anvil chain
- `make seed` - Seed database
- `make demo` - Run demo script
- `make receipts` - Query on-chain receipts
- `make test` - Run all tests
- `make clean` - Clean build artifacts

## 📝 Environment Variables

Copy `.env.example` to `.env` and fill in:

- `RPC_URL` - Anvil or Sepolia RPC
- `PRIVATE_KEY` - Verifier wallet private key
- `POSTGRES_URL` - Database connection
- `REDIS_URL` - Redis connection
- `OLLAMA_HOST` - Ollama service URL

See `.env.example` for full list.

## 🧪 Testing

```bash
# Run all tests
make test

# Test contracts only
cd packages/contracts && forge test

# Test specific app
pnpm --filter router-api test
```

## 📚 Documentation

- [Architecture](./docs/architecture.md) - System design details
- [API Reference](./docs/api.md) - tRPC endpoints
- [Contracts](./packages/contracts/README.md) - Smart contract docs
- [Verification](./docs/verification.md) - PoI verification logic

## 🔐 Security Notes

- Never commit `.env` files
- Use environment-specific keys for testnet/mainnet
- Rate limiting enabled on all public endpoints
- Input validation via Zod schemas
- File upload size limits enforced

## 🗺️ Roadmap

- **v0 (MVP)**: N-of-M redundancy + consistency verification ✅
- **v1 (Next)**: TEE remote attestation (SGX/SEV/TDX)
- **v2 (Future)**: zkML selective proofs

## 📄 License

MIT


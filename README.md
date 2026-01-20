# EdgeNet.AI - Proof-of-Inference DePIN

Decentralized inference network with on-chain verification. Users submit AI tasks (LLM/OCR), executed redundantly across nodes, verified for consistency, and settled on-chain.

## 🏗️ System Architecture

```
┌─────────────┐
│  Dashboard  │ Next.js 14 + tRPC + wagmi (Port 3000)
└──────┬──────┘
       │ HTTP/tRPC
┌──────▼──────────┐
│  Router API     │ Fastify + tRPC + BullMQ (Port 3001)
└──────┬──────────┘
       │ Queue Dispatch
   ┌───┴───┬──────────┐
   │       │          │
┌──▼──┐ ┌─▼───┐  ┌───▼────┐
│Node1│ │Node2│  │Verifier│ Python FastAPI + Ollama/PaddleOCR
└──┬──┘ └─┬───┘  └───┬────┘ (Ports 8001, 8002)
   │      │          │
   └──────┴──────────┘
          │
    ┌─────▼─────┐
    │  Contract │ Solidity 0.8.24 (Foundry)
    └───────────┘ Anvil/Sepolia
```

## 📊 Data Flow

```
User Submit → Router API → Dispatch Queue
                    ↓
            Node Agents (N-of-M redundancy)
                    ↓
            Execution Results
                    ↓
            Verify Queue → Verifier (consistency check)
                    ↓
            Settlement Queue → Smart Contract
                    ↓
            On-Chain Receipt → Dashboard
```

## 🔧 Core Components

| Component | Tech Stack | Purpose |
|-----------|-----------|---------|
| **Dashboard** | Next.js 14, tRPC, Tailwind, wagmi | User interface & task submission |
| **Router API** | Fastify, tRPC, BullMQ, PostgreSQL | Task dispatch & status tracking |
| **Verifier** | TypeScript, BullMQ | N-of-M consistency verification |
| **Node Agent** | Python 3.11, FastAPI, Ollama, PaddleOCR | Execute LLM/OCR inference |
| **Contracts** | Solidity 0.8.24, Foundry | On-chain receipt storage |

## 🔄 Verification Flow (v0)

1. **N-of-M Redundancy**: Task dispatched to N nodes (Bronze=2/3, Silver=3/5, Gold=5/7)
2. **Parallel Execution**: Nodes execute independently
3. **Consistency Check**:
   - **LLM**: Cosine similarity between outputs (threshold: 85%)
   - **OCR**: Normalized edit distance
4. **Result**:
   - **PASS** (≥85%): Emit on-chain receipt
   - **FAIL** (<70%): Mark failed
   - **DISPUTE** (70-85%): Flag for review

## 📦 Project Structure

```
edgenetai/
├── apps/
│   ├── dashboard/      # Next.js frontend
│   ├── router-api/      # Fastify + tRPC API
│   ├── verifier/        # Verification workers
│   └── node-agent/      # Python FastAPI agent
├── packages/
│   ├── contracts/      # Foundry Solidity contracts
│   ├── proto/           # Shared TypeScript types
│   └── sdk/             # Client SDK
└── infra/
    └── docker-compose.yml  # Redis, Postgres, Ollama
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start infrastructure
make up

# Start Anvil (local chain)
make anvil

# Deploy contracts
cd packages/contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast

# Start all services
pnpm dev
```

**Access Points:**
- Dashboard: http://localhost:3000
- Router API: http://localhost:3001
- Node Agents: http://localhost:8001, 8002

## 🗺️ Roadmap

- **v0 (MVP)**: N-of-M redundancy + consistency verification ✅
- **v1**: TEE remote attestation (SGX/SEV/TDX)
- **v2**: zkML selective proofs

## 📄 License

MIT

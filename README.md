# EdgeNet.AI - Proof-of-Inference DePIN

A decentralized inference network that enables users to submit AI tasks (LLM/OCR) for redundant execution across distributed nodes, with on-chain verification and settlement.

## 🌟 Overview

EdgeNet.AI is a DePIN (Decentralized Physical Infrastructure Network) that provides verifiable AI inference through redundant execution and consensus verification. Tasks are dispatched to multiple nodes in parallel, results are verified for consistency, and successful completions are settled on-chain with cryptographic receipts.

### Key Features

- **N-of-M Redundancy**: Tasks execute on multiple nodes simultaneously for fault tolerance
- **Consistency Verification**: Automated verification ensures result integrity (85% similarity threshold)
- **On-Chain Settlement**: Immutable receipts stored on Ethereum-compatible chains
- **Multi-Task Support**: LLM summarization and OCR image processing
- **SLA Tiers**: Bronze, Silver, and Gold tiers with varying redundancy levels
- **Real-time Dashboard**: Monitor tasks, nodes, and network health

## 🏗️ Architecture

```
┌─────────────┐
│  Dashboard  │ Next.js 14 + tRPC + wagmi (Port 3000)
│             │ Static Export (Deployed on Netlify)
└──────┬──────┘
       │ HTTP/tRPC
┌──────▼──────────┐
│  Router API     │ Fastify + tRPC + BullMQ (Port 3001)
│                 │ PostgreSQL + Redis
└──────┬──────────┘
       │ Queue Dispatch
   ┌───┴───┬──────────┐
   │       │          │
┌──▼──┐ ┌─▼───┐  ┌───▼────┐
│Node1│ │Node2│  │Verifier│ Python FastAPI + Ollama/PaddleOCR
│     │ │ ... │  │        │ TypeScript Workers
└──┬──┘ └─┬───┘  └───┬────┘ (Ports 8001, 8002)
   │      │          │
   └──────┴──────────┘
          │
    ┌─────▼─────┐
    │  Contract │ Solidity 0.8.24 (Foundry)
    │InferenceReceipt│ Anvil/Sepolia
    └───────────┘
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

## 🔄 Verification Flow (v0)

1. **Task Submission**: User submits task with SLA tier specification
2. **N-of-M Dispatch**: 
   - Bronze: 2-of-3 nodes
   - Silver: 3-of-5 nodes
   - Gold: 5-of-7 nodes
3. **Parallel Execution**: Nodes execute independently
4. **Consistency Check**:
   - **LLM Tasks**: Cosine similarity between outputs (threshold: 85%)
   - **OCR Tasks**: Normalized edit distance comparison
5. **Result Classification**:
   - **PASS** (≥85% similarity): Emit on-chain receipt
   - **FAIL** (<70% similarity): Mark as failed
   - **DISPUTE** (70-85% similarity): Flag for manual review

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Dashboard** | Next.js 14, React 18, TypeScript, Tailwind CSS, tRPC, wagmi, ECharts | User interface & task submission |
| **Router API** | Fastify, tRPC, BullMQ, PostgreSQL, Redis | Task dispatch & status tracking |
| **Verifier** | TypeScript, BullMQ, PostgreSQL | N-of-M consistency verification |
| **Node Agent** | Python 3.11, FastAPI, Ollama, PaddleOCR | Execute LLM/OCR inference |
| **Contracts** | Solidity 0.8.24, Foundry | On-chain receipt storage |
| **Infrastructure** | Docker Compose, Redis, PostgreSQL, Anvil | Development environment |

## 📦 Project Structure

```
edgenetai/
├── apps/
│   ├── dashboard/          # Next.js frontend (static export)
│   │   ├── src/
│   │   │   ├── app/        # App Router pages
│   │   │   ├── components/ # React components
│   │   │   ├── lib/        # API clients, types, utilities
│   │   │   └── hooks/      # Custom React hooks
│   │   └── next.config.js  # Next.js config (static export)
│   ├── router-api/         # Fastify + tRPC API server
│   │   ├── src/
│   │   │   ├── routes/     # API route handlers
│   │   │   ├── db/         # Database schema & client
│   │   │   └── queue/      # BullMQ queue setup
│   ├── verifier/           # Verification workers
│   │   └── src/
│   │       └── verification/ # Consistency checking logic
│   └── node-agent/         # Python FastAPI agent
│       └── main.py         # Inference execution
├── packages/
│   ├── contracts/          # Foundry Solidity contracts
│   │   └── src/
│   │       └── InferenceReceipt.sol
│   ├── proto/              # Shared TypeScript types
│   └── sdk/                # Client SDK
├── infra/
│   ├── docker-compose.yml  # Redis, PostgreSQL, Ollama
│   └── anvil.json          # Local chain config
├── netlify.toml            # Netlify deployment config
├── pnpm-workspace.yaml     # PNPM monorepo config
└── turbo.json              # Turborepo config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >=20.0.0
- **PNPM**: >=8.0.0 (we use pnpm@10.28.1)
- **Python**: 3.11+
- **Docker**: For local infrastructure
- **Foundry**: For smart contract development

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd edgenetai

# Install dependencies
pnpm install

# Enable corepack (if not already enabled)
corepack enable
```

### Local Development

1. **Start Infrastructure**

```bash
# Start Redis and PostgreSQL
make up
# or
docker-compose -f infra/docker-compose.yml up -d
```

2. **Start Local Blockchain**

```bash
# Start Anvil (local Ethereum node)
make anvil
# or
cd infra && anvil --config anvil.json
```

3. **Deploy Smart Contracts**

```bash
cd packages/contracts

# Deploy to local Anvil
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url http://localhost:8545 \
  --broadcast
```

4. **Start Services**

```bash
# Start all services (dashboard, router-api, verifier)
pnpm dev

# Or start individually:
pnpm --filter @edgenetai/dashboard dev
pnpm --filter @edgenetai/router-api dev
pnpm --filter @edgenetai/verifier dev
```

5. **Start Node Agents**

```bash
cd apps/node-agent

# Install Python dependencies
pip install -r requirements.txt

# Start agent (in separate terminals)
python main.py --port 8001
python main.py --port 8002
```

**Access Points:**
- Dashboard: http://localhost:3000
- Router API: http://localhost:3001
- Node Agents: http://localhost:8001, http://localhost:8002

## 🌐 Deployment

### Dashboard (Static Export)

The dashboard is configured for static export and deployed on Netlify:

```bash
# Build for production
cd apps/dashboard
pnpm build

# Output is generated in apps/dashboard/out
```

**Deployment Branch**: `deploy-dashboard`
- **Build Command**: `pnpm -C apps/dashboard build`
- **Publish Directory**: `apps/dashboard/out`
- **Node Version**: 20
- **PNPM Version**: 10.28.1

### Other Services

- **Router API**: Deploy to your preferred Node.js hosting (Railway, Render, etc.)
- **Verifier**: Same as Router API (Node.js service)
- **Node Agents**: Deploy Python FastAPI services (Fly.io, Railway, etc.)

## 📝 Scripts

```bash
# Development
pnpm dev              # Start all services in dev mode
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm test             # Run tests
pnpm format           # Format code with Prettier

# Specific packages
pnpm --filter @edgenetai/dashboard dev
pnpm --filter @edgenetai/router-api dev
```

## 🗺️ Roadmap

- [x] **v0 (MVP)**: N-of-M redundancy + consistency verification
- [ ] **v1**: TEE remote attestation (SGX/SEV/TDX)
- [ ] **v2**: zkML selective proofs
- [ ] **v3**: Economic incentives & tokenomics
- [ ] **v4**: Multi-chain support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Smart contracts powered by [Foundry](https://getfoundry.sh/)
- Queue management with [BullMQ](https://bullmq.io/)
- AI inference via [Ollama](https://ollama.ai/) and [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is an MVP version. Production deployments should include additional security measures, monitoring, and scalability considerations.

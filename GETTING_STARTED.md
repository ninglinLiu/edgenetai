# Getting Started - EdgeNet.AI PoI MVP

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Docker** & Docker Compose
- **Foundry** (for contracts)
- **Python** 3.11+ (for node-agent)
- **Ollama** (will be pulled via Docker)

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Infrastructure

```bash
# Start Redis, Postgres, Ollama, MinIO
make up
# or
docker compose -f infra/docker-compose.yml up -d
```

Wait a few seconds for services to be ready.

### 3. Setup Ollama Model

```bash
# Pull the model (if not already available)
docker exec edgenetai-ollama ollama pull llama3:8b
```

### 4. Start Anvil (Local Blockchain)

In a separate terminal:

```bash
make anvil
# or
anvil --host 0.0.0.0 --port 8545
```

### 5. Deploy Contracts

In another terminal:

```bash
cd packages/contracts

# Set environment variables
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export VERIFIER_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8

# Deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast
```

Copy the deployed contract address and set it in `.env` files.

### 6. Setup Environment Variables

Copy `.env.example` to `.env` and `.env.development`:

```bash
cp .env.example .env
cp .env.example .env.development
```

Update the following in `.env`:
- `CONTRACT_ADDRESS` - from step 5
- `VERIFIER_ADDRESS` - verifier wallet address
- `PRIVATE_KEY` - verifier private key

### 7. Initialize Database

```bash
# Seed initial nodes
make seed
# or
pnpm --filter router-api exec tsx scripts/seed.ts
```

### 8. Start Services

In separate terminals:

**Terminal 1 - Router API:**
```bash
pnpm --filter router-api dev
```

**Terminal 2 - Verifier:**
```bash
pnpm --filter verifier dev
```

**Terminal 3 - Node Agent 1:**
```bash
cd apps/node-agent
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
NODE_AGENT_ID=node-1 NODE_AGENT_PORT=8001 python main.py
```

**Terminal 4 - Node Agent 2:**
```bash
cd apps/node-agent
source venv/bin/activate  # Windows: venv\Scripts\activate
NODE_AGENT_ID=node-2 NODE_AGENT_PORT=8002 python main.py
```

**Terminal 5 - Dashboard:**
```bash
pnpm --filter dashboard dev
```

### 9. Run Demo

```bash
make demo
# or
pnpm --filter dashboard exec tsx scripts/demo.ts
```

Or visit http://localhost:3000 and submit a task manually.

## Access Points

- **Dashboard**: http://localhost:3000
- **Router API**: http://localhost:3001
- **Verifier**: Running as worker (no HTTP server)
- **Node Agent 1**: http://localhost:8001
- **Node Agent 2**: http://localhost:8002
- **Anvil RPC**: http://localhost:8545

## Troubleshooting

### Database Connection Issues

Ensure Postgres is running:
```bash
docker ps | grep postgres
```

### Redis Connection Issues

Ensure Redis is running:
```bash
docker ps | grep redis
```

### Ollama Not Responding

Check Ollama container:
```bash
docker logs edgenetai-ollama
```

### Contract Deployment Fails

Ensure Anvil is running and RPC_URL is correct in `.env`.

## Next Steps

1. Submit a task via dashboard
2. Monitor execution in `/tasks/[id]`
3. Check on-chain receipt after verification
4. View node leaderboard


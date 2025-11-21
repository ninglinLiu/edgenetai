# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install & Start Infrastructure

```bash
# Install dependencies
pnpm install

# Start Docker services (Redis, Postgres, Ollama)
make up

# Wait 10 seconds for services to initialize
sleep 10
```

### Step 2: Setup Blockchain

```bash
# Terminal 1: Start Anvil
make anvil

# Terminal 2: Deploy contracts
cd packages/contracts
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export VERIFIER_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast
```

Copy contract address from output and add to `.env`:
```
CONTRACT_ADDRESS=0x...
```

### Step 3: Seed Database

```bash
make seed
```

### Step 4: Start All Services

**Terminal 3 - Router API:**
```bash
pnpm --filter router-api dev
```

**Terminal 4 - Verifier:**
```bash
pnpm --filter verifier dev
```

**Terminal 5 - Node Agent 1:**
```bash
cd apps/node-agent
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
NODE_AGENT_ID=node-1 NODE_AGENT_PORT=8001 python main.py
```

**Terminal 6 - Node Agent 2:**
```bash
cd apps/node-agent
source venv/bin/activate
NODE_AGENT_ID=node-2 NODE_AGENT_PORT=8002 python main.py
```

**Terminal 7 - Dashboard:**
```bash
pnpm --filter dashboard dev
```

### Step 5: Run Demo

Visit http://localhost:3000 or run:
```bash
make demo
```

## ✅ Verification Checklist

- [ ] Docker services running (`docker ps`)
- [ ] Anvil running on port 8545
- [ ] Contract deployed and address in `.env`
- [ ] Database seeded with nodes
- [ ] Router API on port 3001
- [ ] Verifier worker running
- [ ] Node agents on ports 8001, 8002
- [ ] Dashboard on port 3000

## 🎯 Test Flow

1. Go to http://localhost:3000/submit
2. Select "LLM Summary"
3. Paste some text
4. Choose "Silver" (2 nodes)
5. Submit
6. Watch task progress at `/tasks/[id]`
7. See on-chain receipt after verification

## 🐛 Common Issues

**Port already in use:**
- Change ports in `.env` files

**Database connection error:**
- Ensure Postgres container is running: `docker ps | grep postgres`

**Ollama model not found:**
- Run: `docker exec edgenetai-ollama ollama pull llama3:8b`

**Contract deployment fails:**
- Ensure Anvil is running
- Check RPC_URL in `.env`


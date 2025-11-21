# EdgeNet.AI Contracts

Smart contracts for PoI (Proof-of-Inference) verification and on-chain settlement.

## Contracts

### InferenceReceipt.sol

Main contract that emits verifiable receipts for completed inference tasks.

**Events:**
- `ReceiptEmitted(jobId, modelHash, latencyMs, nodeSetRoot, verifier, ipfsCID)`

**Functions:**
- `emitReceipt(jobId, modelHash, latencyMs, nodeSetRoot, ipfsCID)` - Only callable by verifier
- `getReceipt(jobId)` - Query receipt by job ID
- `slash(nodeAddr, amount)` - Slash node stake (stub for v1)

## Development

```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Build
forge build

# Test
forge test -vvv

# Deploy to Anvil
forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast

# Deploy to Sepolia
forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

## Testing

```bash
forge test
forge test -vvv  # Verbose output
forge test --match-test testEmitReceipt  # Run specific test
```


# Architecture Overview

## System Components

### 1. Dashboard (Next.js)
- **Port**: 3000
- **Tech**: Next.js 14, tRPC, wagmi, Tailwind
- **Purpose**: User interface for submitting tasks and viewing results

### 2. Router API (Fastify)
- **Port**: 3001
- **Tech**: Fastify, tRPC, BullMQ, PostgreSQL
- **Purpose**: Task creation, dispatch, and status tracking

### 3. Verifier (TypeScript Worker)
- **Tech**: Node.js, BullMQ, PostgreSQL
- **Purpose**: Verify N-of-M consistency and emit on-chain receipts

### 4. Node Agent (Python FastAPI)
- **Ports**: 8001, 8002 (multiple instances)
- **Tech**: FastAPI, Ollama, PaddleOCR
- **Purpose**: Execute LLM and OCR inference tasks

### 5. Smart Contracts (Foundry)
- **Tech**: Solidity 0.8.24, Foundry
- **Purpose**: On-chain receipt storage and verification

## Data Flow

```
User → Dashboard → Router API → Dispatch Queue
                                    ↓
                              Node Agents (N nodes)
                                    ↓
                              Execution Results
                                    ↓
                              Verify Queue → Verifier
                                    ↓
                              Settlement Queue → Contract
                                    ↓
                              On-Chain Receipt
                                    ↓
                              Dashboard (via polling)
```

## Verification Flow (v0)

1. **N-of-M Redundancy**: Task dispatched to N nodes (based on SLA)
2. **Execution**: Nodes execute in parallel
3. **Consistency Check**:
   - LLM: Cosine similarity between outputs
   - OCR: Normalized edit distance
4. **Result**:
   - PASS: Similarity >= threshold → Emit receipt
   - FAIL: Similarity < 70% threshold → Mark failed
   - DISPUTE: In between → Flag for review

## Database Schema

- **tasks**: Task metadata and status
- **nodes**: Node registration and reputation
- **executions**: Individual node execution results
- **verifications**: Verification results and details
- **receipts**: On-chain receipt mirror

## Queue System

- **dispatch**: Routes tasks to nodes
- **verify**: Validates execution consistency
- **settle**: Writes receipts to chain

## Security Considerations

- Input validation via Zod schemas
- Rate limiting on API endpoints
- File size limits
- Node reputation system
- On-chain verification

## Future Enhancements (v1/v2)

- **v1**: TEE remote attestation (SGX/SEV/TDX)
- **v2**: zkML selective proofs
- Slashing mechanism for malicious nodes


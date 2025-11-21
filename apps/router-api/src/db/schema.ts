/**
 * @file schema.ts
 * @description Database schema and migrations (using raw SQL for MVP)
 */

export const CREATE_TABLES_SQL = `
-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('LLM_SUMMARY', 'OCR_IMAGE')),
  payload_uri TEXT,
  payload_blob TEXT,
  model_id VARCHAR(100) NOT NULL,
  sla_tier VARCHAR(10) NOT NULL CHECK (sla_tier IN ('BRONZE', 'SILVER', 'GOLD')),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DISPATCHED', 'EXECUTING', 'VERIFYING', 'COMPLETED', 'FAILED', 'DISPUTE')),
  user_id VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Nodes table
CREATE TABLE IF NOT EXISTS nodes (
  id VARCHAR(255) PRIMARY KEY,
  addr TEXT NOT NULL,
  stake NUMERIC(78, 0) NOT NULL DEFAULT 0,
  region VARCHAR(50) NOT NULL,
  latency_score NUMERIC(3, 2) NOT NULL DEFAULT 0.5 CHECK (latency_score >= 0 AND latency_score <= 1),
  success_rate NUMERIC(3, 2) NOT NULL DEFAULT 0.5 CHECK (success_rate >= 0 AND success_rate <= 1),
  reputation INTEGER NOT NULL DEFAULT 0,
  tee_proof_uri TEXT,
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_heartbeat TIMESTAMP
);

-- Executions table
CREATE TABLE IF NOT EXISTS executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  node_id VARCHAR(255) NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  output_hash VARCHAR(64) NOT NULL,
  raw_uri TEXT,
  raw_output TEXT,
  latency_ms INTEGER NOT NULL CHECK (latency_ms > 0),
  cost NUMERIC(78, 0) NOT NULL DEFAULT 0,
  tee_quote TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  policy VARCHAR(10) NOT NULL CHECK (policy IN ('N_OF_M', 'SPOT')),
  result VARCHAR(10) NOT NULL CHECK (result IN ('PASS', 'FAIL', 'DISPUTE')),
  detail_uri TEXT,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Receipts table (mirrors on-chain data)
CREATE TABLE IF NOT EXISTS receipts (
  job_id VARCHAR(255) PRIMARY KEY,
  model_hash VARCHAR(64) NOT NULL,
  latency_ms INTEGER NOT NULL,
  verifier_sig TEXT,
  block_hash VARCHAR(66),
  tx_hash VARCHAR(66),
  block_number BIGINT,
  timestamp BIGINT,
  node_set_root VARCHAR(66),
  ipfs_cid TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_executions_task_id ON executions(task_id);
CREATE INDEX IF NOT EXISTS idx_executions_node_id ON executions(node_id);
CREATE INDEX IF NOT EXISTS idx_verifications_task_id ON verifications(task_id);
CREATE INDEX IF NOT EXISTS idx_nodes_region ON nodes(region);
CREATE INDEX IF NOT EXISTS idx_nodes_reputation ON nodes(reputation DESC);
`;


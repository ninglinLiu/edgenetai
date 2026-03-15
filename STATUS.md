# EdgeNet.AI Status

This document is intentionally conservative. Its goal is to make the current state of the repository easy to evaluate without overstating what is already integrated.

## Snapshot

EdgeNet.AI is currently strongest as a mock-backed systems prototype with a polished dashboard and visible service boundaries. The repository contains backend and contract implementations at different levels of completeness, but the dependable default path today is the dashboard demo rather than a full end-to-end network.

## Component Status

| Component | Status | What exists | Reviewer note |
| --- | --- | --- | --- |
| `apps/dashboard` | Implemented | Multi-page Next.js dashboard, static export config, mock-backed task/node/receipt views | Primary showcase artifact |
| `EdgeApi` + provider pattern | Implemented | Clean interface between UI and data source | Strong architectural signal |
| `MockEdgeApi` | Mock-backed | Seeded nodes, tasks, receipts, network stats, leaderboard source | Powers the current demo |
| `TrpcEdgeApi` | Scaffolded | Placeholder client methods only | Not ready for live use |
| `apps/router-api` | Partial | Fastify app, tRPC routes, DB access, queue wiring | Not the active dashboard data source today |
| `apps/verifier` | Partial | Verification and settlement workers | Present in code, not presented as proven E2E flow |
| `apps/node-agent` LLM path | Partial | FastAPI service and summarization path | Requires broader integration work |
| `apps/node-agent` OCR path | Placeholder | Stubbed OCR output path | Not a complete implementation |
| `packages/contracts` | Implemented | Solidity receipt contract and Foundry tests | Should not be described as live deployment |
| `packages/proto` | Implemented | Shared schemas and types for backend-side modeling | Good architecture signal |
| `packages/sdk` | Implemented | Contract SDK utilities | Contains prototype-level assumptions |
| Full multi-service workflow | Scaffolded | Pieces exist across the repo | Current repo state does not package this as a dependable default run path |

## What Works Today

- The dashboard can be run as a standalone demo and presents a coherent view of the intended network.
- Task, node, receipt, and network-health views are populated through the mock data layer.
- Scenario-based data allows reviewers to inspect different network states.
- The leaderboard now reads from mocked node data through the same `EdgeApi` boundary used elsewhere.
- The contracts package includes a receipt contract and test coverage for core receipt behavior.

## What Is Simulated

- network-level activity shown in the dashboard
- task throughput, latency, and outcome metrics
- node registry data displayed in the dashboard
- receipt data displayed in the dashboard
- SLA-driven behavior as presented in the frontend

These simulations are not hidden. They are part of the prototype strategy and should be described as such.

## What Is Architected But Not Fully Wired

- dashboard-to-router live client integration
- end-to-end task flow from UI to real backend services
- verifier-driven receipt emission demonstrated from the frontend
- production-quality OCR execution
- deployed chain or production settlement environment

## Repository-State Notes

The current checked-in `pnpm-workspace.yaml` includes:

- `apps/dashboard`
- `packages/*`

This matters because it means the dashboard and shared packages are the default workspace members today. The backend app directories are still present in the repository, but they are not part of the current default workspace install/build path.

## Logical Next Steps

1. Restore a full workspace definition for backend experimentation.
2. Implement one reliable live `EdgeApi` path from dashboard to router API.
3. Validate a single local happy path across router, node agent, verifier, and receipt emission.
4. Replace placeholder OCR behavior with a real execution path.
5. Add focused integration tests around the most credible end-to-end flow.

## Recommended Reviewer Framing

Accurate ways to describe the project:

- proof-of-concept
- systems prototype
- mock-backed dashboard with partial backend implementation
- architecture exploration of decentralized inference and verification

Descriptions to avoid:

- live decentralized inference marketplace
- production-ready GPU network
- fully integrated verification and settlement stack
- deployed competitor to io.net

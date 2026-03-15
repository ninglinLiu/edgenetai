# EdgeNet.AI

EdgeNet.AI is a proof-of-concept systems prototype exploring decentralized edge inference, SLA-aware task routing, quorum-based verification concepts, and an on-chain receipt design.

Additional project notes:

- `ARCHITECTURE.md` explains the intended system boundaries and task lifecycle.
- `STATUS.md` gives an honest implementation-status view.
- `DESIGN_DECISIONS.md` summarizes the most important trade-offs behind the prototype.

## Overview

EdgeNet.AI explores a systems problem that sits at the intersection of distributed systems, AI infrastructure, and blockchain-adjacent accountability:

- how to route inference work across distributed nodes
- how to reason about results returned by untrusted or heterogeneous participants
- how to model verification, settlement, and receipts in a way that is inspectable

The repository is best understood as a university showcase prototype rather than a product launch. The current strength of the project is not that it runs a live decentralized marketplace today, but that it demonstrates a credible architecture for one and exposes the key interfaces cleanly enough to discuss, critique, and extend.

## Why This Project Matters

For a university audience, EdgeNet.AI is valuable because it turns a broad idea like "decentralized inference" into a concrete software system with visible boundaries:

- a typed dashboard layer for presenting system state
- a router/verifier/node-agent decomposition instead of a monolithic app
- shared packages that signal interface-first design
- a mock-backed frontend that still visualizes queues, verification stages, receipts, and network health

That combination makes the project useful as both a technical prototype and a teaching artifact. It shows system decomposition, data modeling, interface design, and honest product scoping.

## System Architecture Overview

At a high level, the repository is organized around six responsibilities:

- `apps/dashboard`: Next.js dashboard for task submission, task inspection, network views, and architecture visualization
- `apps/router-api`: Fastify + tRPC API intended to receive tasks, persist them, and enqueue downstream work
- `apps/verifier`: BullMQ-based workers for verification and settlement steps
- `apps/node-agent`: Python FastAPI service intended to execute task types such as LLM summarization or OCR
- `packages/contracts`: Foundry-based Solidity contracts for receipt emission and settlement-related primitives
- `packages/proto` and `packages/sdk`: shared schemas/types and contract-facing SDK utilities

Important implementation note:

- The dashboard is the most complete and presentation-ready component today.
- The dashboard currently runs in mock mode through the `EdgeApi` abstraction.
- The tRPC/live dashboard client is scaffolded but intentionally disabled for the showcase build.
- The repository contains backend and contract implementations at different levels of completeness, but the dependable default path today is the dashboard demo rather than a fully integrated network.

## Repository Structure

| Path | Role |
| --- | --- |
| `apps/dashboard` | Static-exportable Next.js dashboard and demo UI |
| `apps/router-api` | Fastify + tRPC API and queue orchestration prototype |
| `apps/verifier` | Verification and settlement workers |
| `apps/node-agent` | Python execution agent for inference tasks |
| `packages/contracts` | Solidity receipt contract and Foundry tests |
| `packages/proto` | Shared Zod schemas and backend-oriented TypeScript types |
| `packages/sdk` | Contract interaction SDK built on `viem` |
| `infra` | Local infrastructure configuration such as Anvil and Docker Compose |
| `scripts` | Seed/demo scripts and deployment helpers |

## Implementation Status

| Component | Status | Notes |
| --- | --- | --- |
| Dashboard UI | Implemented | The strongest part of the repo; statically deployable and mock-backed |
| `EdgeApi` provider pattern | Implemented | Clean interface boundary between demo UI and future live data sources |
| Scenario-based mock data | Mock-backed | Supports quiet, busy, and congested network narratives |
| Dashboard tRPC/live mode | Scaffolded | Client exists as a placeholder and is deliberately not enabled for demos |
| Router API | Partial | Fastify/tRPC routes, queue hooks, and DB access exist, but this is not the current demo path |
| Verifier workers | Partial | Verification and settlement workers exist, but are not showcased as a proven end-to-end flow |
| Node agent LLM path | Partial | FastAPI execution path exists for summarization |
| Node agent OCR path | Placeholder | OCR currently uses placeholder behavior rather than a complete production-quality flow |
| Smart contracts | Implemented | Receipt contract and tests exist; this repo does not present a live deployed contract system |
| Shared packages | Implemented | `proto` and `sdk` show intended package boundaries and typed interfaces |
| Full multi-service deployment | Scaffolded | The checked-in workspace is currently narrowed around the dashboard and shared packages |

For a fuller breakdown, see `STATUS.md`.

## Data Flow / Lifecycle

The intended system lifecycle is:

1. Submit: a client creates a task with a task type and SLA tier.
2. Dispatch: a router service decides how many nodes should execute the task.
3. Execute: node agents perform inference work and return outputs plus telemetry.
4. Verify: a verifier compares outputs and classifies the result as pass, fail, or dispute.
5. Settle: successful work can produce a receipt or settlement record.
6. Receipt: the dashboard exposes the resulting audit trail.

This lifecycle already appears in the domain model and UI, even where the live wiring is still incomplete. That is why the project works well as a systems prototype: reviewers can inspect the intended flow without being asked to believe that every layer is production-complete today.

## Key Design Decisions

### `EdgeApi` abstraction

The dashboard does not call backend code directly. Instead, it depends on a local `EdgeApi` interface with provider-based injection. This makes it possible to:

- ship a polished mock-backed dashboard
- preserve the future option of switching to a live client
- test UI flows independently from backend readiness

### Scenario-based mocking

The mock system is not random filler. It is structured around scenarios such as quiet, busy, and congested so the dashboard can illustrate how the system should behave under different operating conditions.

### Static dashboard export

The dashboard is configured for static export because the repository’s current showcase priority is presentation quality and reliability, not full-stack runtime integration. This keeps the demo easy to host and reduces operational noise during review.

### Monorepo boundaries

Separating dashboard, router, verifier, node-agent, contracts, and shared packages helps communicate systems thinking. Even where some modules are incomplete, the decomposition itself is informative and intentional.

### Typed shared models

The project includes typed domain models and shared schemas because decentralized-inference workflows are easiest to reason about when task state, verification state, and receipt structure are explicit.

More detail is available in `DESIGN_DECISIONS.md`.

## Related Systems / Comparison

EdgeNet.AI is inspired by problem spaces explored by projects such as io.net, Akash, and Gensyn, but it should not be described as a comparable production system.

- `io.net` focuses on a real-world distributed GPU marketplace and operational network scale.
- `Akash` centers on decentralized infrastructure marketplaces at deployment/infrastructure level.
- `Gensyn` is associated with distributed machine learning and verification-oriented compute research.

EdgeNet.AI is closer to a research-inspired architecture exploration. It prototypes ideas around routing, verification, receipts, and system decomposition in a student-built codebase. It is not a live competitor, and it is not presented here as one.

## Running The Project

### Supported path today

The most reliable thing to run in the current repository is the dashboard demo:

```bash
pnpm install
pnpm --filter @edgenetai/dashboard dev
```

Or build the static version:

```bash
pnpm --filter @edgenetai/dashboard build
```

### Important repository-state note

The checked-in `pnpm-workspace.yaml` is currently narrowed to:

- `apps/dashboard`
- `packages/*`

That means the dashboard and shared packages are the default runnable workspace today. Backend directories such as `apps/router-api` and `apps/verifier` are present in the repository, but they are not part of the current default workspace install/build path.

## Roadmap

### Current prototype phase

- polish the dashboard as a mock-backed systems demo
- keep the architecture narrative and typed boundaries clear
- make implementation status explicit and honest

### Next integration phase

- restore a full workspace configuration for backend experimentation
- wire the dashboard `EdgeApi` abstraction to a real client path
- validate one local end-to-end happy path across router, verifier, and node agent

### Future systems phase

- strengthen verification logic and evidence capture
- improve settlement/receipt handling
- explore stronger cryptographic or trusted-execution proofs

## Limitations

- The dashboard is currently mock-driven.
- The live dashboard tRPC mode is scaffolded but not ready for demo use.
- Backend services are only partially wired into a repeatable end-to-end workflow.
- The OCR execution path is still placeholder-level.
- Contract code exists, but this repository should not be described as operating a live on-chain settlement system.
- The current checked-in workspace is optimized for the dashboard showcase rather than full monorepo execution.

## Academic / Portfolio Value

EdgeNet.AI demonstrates:

- distributed-systems decomposition
- interface-first frontend architecture
- typed state and contract modeling
- queue- and workflow-oriented thinking
- a pragmatic prototype strategy that separates UI validation from backend completeness

That makes it a strong portfolio or capstone-style artifact even in advance of full backend completion.

## License

This project is licensed under the MIT License.

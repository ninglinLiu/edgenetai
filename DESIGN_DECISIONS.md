# Design Decisions

This file summarizes the most important design choices behind EdgeNet.AI as it exists today.

## Why Mock-First For The Dashboard

The dashboard is the part of the repository that external reviewers are most likely to evaluate first. A mock-first approach made it possible to:

- stabilize the UI early
- communicate the intended workflow before backend integration was complete
- demonstrate system states such as quiet, busy, and congested operation

This choice improves clarity for a showcase project, even though it reduces the amount of live backend behavior visible from the frontend.

## Why `EdgeApi` Exists

The `EdgeApi` abstraction separates the dashboard from any specific backend implementation.

That matters because the project currently needs to support two realities at once:

- a reliable demo path backed by seeded data
- a future live path backed by a real API

Without that boundary, the UI would either be tightly coupled to mock fixtures or unstable while backend work is still in progress.

## Why A Monorepo

The monorepo structure makes the system boundaries explicit:

- dashboard
- router API
- verifier
- node agent
- contracts
- shared packages

For a systems prototype, that visibility is valuable in itself. It shows how responsibilities are meant to be divided even before every component is fully mature.

## Why Static Deployment For The Demo

The dashboard is configured for static export because the showcase objective is presentation reliability, not operational complexity.

A static deployment:

- reduces moving parts during demos
- avoids tying the presentation layer to incomplete services
- keeps review focused on architecture and interface design

## Why Scenario-Based Simulation

The quiet, busy, and congested scenarios are a deliberate modeling tool rather than cosmetic mock data.

They let the project demonstrate:

- how KPIs change under load
- how queue depth and pass rate might move together
- how the same dashboard can communicate different operating conditions

That is useful for both teaching and design review.

## Why This Is Positioned As A Systems Prototype

EdgeNet.AI is not currently a live decentralized compute network, and the repository should not pretend otherwise.

Positioning it as a systems prototype is the most accurate framing because:

- the dashboard is more complete than the service integration
- several backend pieces are partial or scaffolded
- the architecture is stronger than the current operational depth

That framing is still a strength. It signals honesty, good technical judgment, and a clear understanding of what has and has not been implemented yet.

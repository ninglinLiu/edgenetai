.PHONY: help up down anvil seed demo receipts test clean install build

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	pnpm install

build: ## Build all packages
	pnpm build

up: ## Start all services with Docker Compose
	docker compose -f infra/docker-compose.yml up -d
	@echo "Waiting for services to be ready..."
	@sleep 5
	@echo "Services started. Dashboard: http://localhost:3000"

down: ## Stop all services
	docker compose -f infra/docker-compose.yml down

anvil: ## Start Anvil local blockchain
	@if [ -f infra/anvil.json ]; then \
		anvil --config infra/anvil.json; \
	else \
		anvil --host 0.0.0.0 --port 8545; \
	fi

seed: ## Seed database with initial data
	pnpm --filter router-api exec tsx scripts/seed.ts

demo: ## Run the 3-minute demo script
	pnpm --filter dashboard exec tsx scripts/demo.ts

receipts: ## Query on-chain receipts
	pnpm --filter verifier exec tsx scripts/query-receipts.ts

test: ## Run all tests
	pnpm test
	cd packages/contracts && forge test

clean: ## Clean all build artifacts
	pnpm clean
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules


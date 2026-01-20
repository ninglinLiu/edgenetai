#!/bin/bash
# Temporary workspace config for Vercel build (excludes problematic packages)
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/dashboard"
  - "packages/*"
EOF

# Install dependencies
npx pnpm@latest install

# Build dashboard
npx pnpm@latest --filter @edgenetai/dashboard build

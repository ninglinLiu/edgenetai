#!/bin/bash
# Cloudflare Pages build script for EdgeNet.AI Dashboard
# This script handles monorepo setup and builds only the dashboard app

set -e

echo "🚀 Starting Cloudflare Pages build for EdgeNet.AI Dashboard"

# Remove problematic packages that cause dependency issues
echo "📦 Removing problematic packages..."
rm -rf apps/router-api apps/verifier

# Update pnpm-workspace.yaml to only include dashboard and packages
echo "📝 Updating workspace configuration..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/dashboard"
  - "packages/*"
EOF

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install --frozen-lockfile

# Build dashboard
echo "🔨 Building dashboard..."
cd apps/dashboard
pnpm build

echo "✅ Build completed successfully!"
echo "📦 Output directory: apps/dashboard/.next"

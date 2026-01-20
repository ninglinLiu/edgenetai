#!/bin/bash
set -e

# Remove problematic packages
echo "Removing router-api and verifier..."
rm -rf apps/router-api apps/verifier

# Create minimal workspace config
echo "Creating workspace config..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/dashboard"
  - "packages/*"
EOF

# Install dependencies
echo "Installing dependencies..."
pnpm install

echo "Install complete!"

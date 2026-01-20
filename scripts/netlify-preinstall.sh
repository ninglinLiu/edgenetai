#!/bin/bash
# This script runs before pnpm install on Netlify
# Remove problematic packages and update workspace config

echo "Netlify preinstall: Removing problematic packages..."
rm -rf apps/router-api apps/verifier

echo "Netlify preinstall: Updating workspace config..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/dashboard"
  - "packages/*"
EOF

echo "Netlify preinstall: Done!"

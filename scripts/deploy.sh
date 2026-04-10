#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Rebuild gallery index with latest experiments data
npx tsx engine/build-index.ts

# Deploy to Cloudflare
export PATH="/opt/homebrew/bin:/opt/homebrew/opt/node/bin:$PATH"
unset CLOUDFLARE_API_TOKEN
export CLOUDFLARE_API_KEY="REDACTED_CLOUDFLARE_KEY"
export CLOUDFLARE_EMAIL="REDACTED_EMAIL"

cd gallery
npx wrangler deploy

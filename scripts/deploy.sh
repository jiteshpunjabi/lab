#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Rebuild gallery index with latest experiments data
npx tsx engine/build-index.ts

# Deploy to Cloudflare
export PATH="/opt/homebrew/bin:/opt/homebrew/opt/node/bin:$PATH"

# Load secrets from .env (gitignored)
if [ -f .env ]; then
  set -a
  . ./.env
  set +a
else
  echo "ERROR: .env file not found. Create one with CLOUDFLARE_API_TOKEN=..." >&2
  exit 1
fi

# Ensure we use the API token, not the stale Global API Key
unset CLOUDFLARE_API_KEY
unset CLOUDFLARE_EMAIL

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "ERROR: CLOUDFLARE_API_TOKEN not set in .env" >&2
  exit 1
fi

cd gallery
npx wrangler deploy

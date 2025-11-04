#!/bin/bash
# Script to initialize Turso database
# Usage: ./INIT_DB_SCRIPT.sh "libsql://your-db.turso.io?authToken=..."

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Missing connection string"
  echo "Usage: ./INIT_DB_SCRIPT.sh 'libsql://your-db.turso.io?authToken=...'"
  exit 1
fi

CONNECTION_STRING="$1"

echo "🔧 Setting up Turso database..."
echo ""

# Backup current .env.local
if [ -f .env.local ]; then
  cp .env.local .env.local.backup
  echo "✅ Backed up .env.local"
fi

# Add DATABASE_URL to .env.local (temporarily)
if grep -q "DATABASE_URL" .env.local 2>/dev/null; then
  # Update existing DATABASE_URL
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$CONNECTION_STRING\"|" .env.local
  else
    # Linux
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$CONNECTION_STRING\"|" .env.local
  fi
  echo "✅ Updated DATABASE_URL in .env.local"
else
  # Add new DATABASE_URL
  echo "" >> .env.local
  echo "DATABASE_URL=\"$CONNECTION_STRING\"" >> .env.local
  echo "✅ Added DATABASE_URL to .env.local"
fi

echo ""
echo "📦 Creating database tables..."
npm run db:push

echo ""
echo "🌱 Seeding feature flags..."
npm run db:seed-flags

echo ""
echo "✅ Database initialized successfully!"
echo ""
echo "⚠️  Remember: DATABASE_URL is already in Vercel, so you can remove it from .env.local if you want"
echo "   (It was backed up to .env.local.backup)"
echo ""
echo "Next steps:"
echo "1. Redeploy on Vercel"
echo "2. Test: Visit https://www.uploadcaffeine.com/api/debug-stats"


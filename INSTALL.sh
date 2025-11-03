#!/bin/bash

# 🚀 Buy Me a Coffee - Quick Install Script
# Run this to set up your enhanced app

echo "☕ Setting up Buy Me a Coffee app..."
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
else
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database
DATABASE_URL="file:./dev.db"

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MONTHLY_GOAL_CENTS=15000
EOF
    echo "⚠️  Please update .env.local with your Stripe keys"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
npm run db:push

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Stripe keys"
echo "2. Run 'stripe listen --forward-to localhost:3000/api/webhook' (in new terminal)"
echo "3. Add webhook secret to .env.local"
echo "4. Run 'npm run dev'"
echo ""
echo "📚 See QUICK_START.md for detailed instructions"
echo ""
echo "Happy coding! ☕⚡"



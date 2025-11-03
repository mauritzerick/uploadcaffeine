# 🚀 Enhanced Buy Me a Coffee - Setup Guide

## Overview

This is a production-ready, conversion-optimized Buy Me a Coffee app with:
- ✅ **Database storage** (Prisma + SQLite)
- ✅ **Stripe webhooks** (auto-save supporters)
- ✅ **Monthly subscriptions** (toggle between one-time and recurring)
- ✅ **Real-time stats** (SWR for live updates)
- ✅ **Goal progress bar** (monthly funding target)
- ✅ **Analytics tracking** (conversion funnel)
- ✅ **A/B testing** (headline variants)
- ✅ **Enhanced success page** (share buttons + upsell CTAs)

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@prisma/client` - Database ORM
- `prisma` - Prisma CLI
- `swr` - Real-time data fetching

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Update with your values:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Get this after creating webhook (Step 4)

# Database
DATABASE_URL="file:./dev.db"

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MONTHLY_GOAL_CENTS=15000  # $150 goal
```

### 3. Initialize Database

```bash
# Push schema to database (creates tables)
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

This creates:
- `Supporter` table - Stores supporters and donations
- `Event` table - Tracks analytics events
- `Experiment` table - A/B test results

### 4. Set Up Stripe Webhook (Critical!)

#### Local Development (using Stripe CLI):

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook signing secret from the output:
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

Add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### Production Deployment:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter: `https://yourdomain.com/api/webhook`
4. Select event: `checkout.session.completed`
5. Copy the signing secret and add to your hosting platform's env vars

---

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test the Full Flow

1. **Click "Buy Me a Coffee"** on hero
2. **Select amount** or choose preset ($3, $5, $10)
3. **Toggle monthly** (test both one-time and subscription)
4. **Click checkout** - redirects to Stripe
5. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
6. **Success!** - Supporter is saved to database automatically

### Verify Data Saved

```bash
# Open database viewer
npm run db:studio
```

Navigate to [http://localhost:5555](http://localhost:5555) to see:
- Supporters table with your test data
- Events table with analytics

---

## 🎨 Key Features Explained

### 1. Monthly Subscriptions

Users can toggle between **one-time** and **monthly recurring** support.

- **One-time**: Creates Stripe `payment` mode session
- **Monthly**: Creates Stripe `subscription` mode session
- Supporters are marked with `monthly: true` in database
- Monthly supporters get special trophy icon in Hall of Fame

**Code**: `components/CoffeeOptions.tsx`

### 2. Goal Progress Bar

Displays real-time funding progress toward monthly goal.

- Auto-calculates from database using SWR (refreshes every 30s)
- Shows one-time vs monthly breakdown
- Animated progress bar with neon effects

**Code**: `components/GoalProgress.tsx`

**Configure goal**: Change `NEXT_PUBLIC_MONTHLY_GOAL_CENTS` in `.env.local`

### 3. Live Supporters Wall

Shows recent supporters from database with:
- Name (or "Anonymous" if not provided)
- Amount donated
- Monthly badge for recurring supporters
- Custom message (if provided)

**Code**: `components/Supporters.tsx`

### 4. Analytics Tracking

Tracks conversion funnel:
- `cta_click` - User clicks "Buy Me a Coffee"
- `checkout_start` - Checkout session created
- `checkout_success` - Payment completed (via webhook)

**View analytics**:
```bash
# Get analytics summary
curl http://localhost:3000/api/track
```

Returns conversion rate and event counts.

### 5. A/B Testing

Tests two headline variants:
- **Variant A**: "If my work helped you, buy me a coffee"
- **Variant B**: "Fuel my late-night coding sessions"

Randomly assigned on first visit, stored in localStorage.

**Code**: `components/Hero.tsx`

**View results**: Check `Experiment` table in Prisma Studio

### 6. Enhanced Success Page

After payment, users see:
- ✅ Success confirmation
- 🔗 Share buttons (Twitter, LinkedIn)
- 🔄 "Make it monthly?" CTA (if was one-time)
- 🏠 Return home button

**Code**: `app/success/page.tsx`

---

## 🔧 Customization

### Change Coffee Presets

Edit `components/CoffeeOptions.tsx`:

```typescript
const coffeeTiers = [
  { id: 3, name: 'Small', icon: Coffee, ... },
  { id: 5, name: 'Medium', icon: Zap, ... },   // ← Change amounts here
  { id: 10, name: 'Large', icon: Rocket, ... },
]
```

### Change Monthly Goal

Edit `.env.local`:

```env
NEXT_PUBLIC_MONTHLY_GOAL_CENTS=25000  # $250 goal
```

### Change Headlines

Edit `components/Hero.tsx`:

```typescript
const headlines = {
  a: {
    main: "Your custom headline",
    sub: "Secondary line",
    tagline: "Tagline text",
  },
  b: { ... }
}
```

### Add More Supporters Info

Update Prisma schema `prisma/schema.prisma`:

```prisma
model Supporter {
  // ... existing fields
  country      String?
  avatarUrl    String?
}
```

Then run:
```bash
npm run db:push
```

---

## 🚀 Deployment

### Recommended Platforms

1. **Vercel** (Easiest)
2. **Netlify**
3. **Railway**
4. **Render**

### Deployment Steps (Vercel Example)

#### 1. Push to GitHub

```bash
git add .
git commit -m "Enhanced Buy Me a Coffee app"
git push origin main
```

#### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=file:./prod.db
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_MONTHLY_GOAL_CENTS=15000
```

#### 3. Set Up Production Webhook

1. Deploy app first (to get URL)
2. Go to Stripe Dashboard → Webhooks
3. Add endpoint: `https://yourdomain.com/api/webhook`
4. Select event: `checkout.session.completed`
5. Copy webhook secret
6. Add to Vercel env vars: `STRIPE_WEBHOOK_SECRET=whsec_...`
7. Redeploy

#### 4. Test Live Payments

- Switch Stripe to **live mode** (toggle in dashboard)
- Use your real publishable/secret keys
- Test with real card (small amount)
- Verify supporter appears in database

---

## 📊 Database Management

### View Data

```bash
npm run db:studio
```

### Backup Database

```bash
# SQLite database file
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db
```

### Reset Database

```bash
# WARNING: Deletes all data!
rm prisma/dev.db
npm run db:push
```

### Production Database Options

SQLite is great for MVP, but for production consider:

1. **PostgreSQL** (Neon, Supabase, Railway)
2. **MySQL** (PlanetScale)
3. **MongoDB** (MongoDB Atlas)

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

---

## 🐛 Troubleshooting

### Webhook Not Working

**Symptoms**: Payments succeed but supporters don't save

**Fix**:
1. Check `.env.local` has correct `STRIPE_WEBHOOK_SECRET`
2. Restart dev server after adding secret
3. Check webhook logs in Stripe Dashboard
4. Verify endpoint URL is correct

### Prisma Client Not Found

**Symptoms**: `Cannot find module '@prisma/client'`

**Fix**:
```bash
npm run db:push  # Regenerates Prisma Client
npm run dev      # Restart server
```

### SWR Not Updating

**Symptoms**: Stats/supporters not refreshing

**Fix**:
- Check `/api/stats` returns data: `curl http://localhost:3000/api/stats`
- Clear browser cache
- Check console for errors

### Build Fails

**Symptoms**: `prisma generate` fails during build

**Fix**:
```bash
# Ensure postinstall script runs
npm install
npm run build
```

---

## 📈 Monitoring & Analytics

### View Conversion Rate

```bash
curl http://localhost:3000/api/track
```

Returns:
```json
{
  "events": [
    { "type": "cta_click", "_count": { "type": 45 } },
    { "type": "checkout_start", "_count": { "type": 30 } },
    { "type": "checkout_success", "_count": { "type": 18 } }
  ],
  "conversionRate": "60.00%",
  "totals": {
    "checkoutStarts": 30,
    "checkoutSuccesses": 18
  }
}
```

### A/B Test Results

Check `Experiment` table in Prisma Studio to see:
- Which variant is winning
- Conversion rates by variant

### Stripe Dashboard

Monitor:
- Total revenue
- Subscription churn
- Failed payments
- Customer list

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use environment variables** - Never hardcode secrets
3. **Verify webhook signatures** - Already implemented in `/api/webhook`
4. **Use HTTPS in production** - Required by Stripe
5. **Rate limit APIs** - Add rate limiting to prevent abuse

---

## 📚 Additional Resources

- [Stripe Testing](https://stripe.com/docs/testing)
- [Prisma Docs](https://www.prisma.io/docs)
- [SWR Docs](https://swr.vercel.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎯 Next Steps / Future Enhancements

- [ ] Email thank-you via Resend/SendGrid
- [ ] Supporter badges system
- [ ] Multi-currency support
- [ ] Admin dashboard
- [ ] Public leaderboard
- [ ] Webhook for failed payments
- [ ] Dunning management for subscriptions
- [ ] Export data to CSV

---

## 💬 Support

If you run into issues:

1. Check this guide's troubleshooting section
2. Review error logs in terminal
3. Check Stripe webhook logs
4. Inspect database with `npm run db:studio`

---

**Happy coding! ☕⚡**



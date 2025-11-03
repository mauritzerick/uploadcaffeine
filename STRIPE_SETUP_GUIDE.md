# 🚀 Stripe Integration Setup Guide

## ✅ Integration Status: **COMPLETE**

Your Buy Me a Coffee app has a **full, production-ready Stripe integration** with all features implemented.

---

## 🎯 What's Already Built

### ✅ Payment Features
- **One-time payments** (Buy a coffee - $3, $5, $10, or custom)
- **Monthly subscriptions** (Recurring support with toggle)
- **Custom amounts** (Users can enter any amount)
- **Multiple payment methods** (Credit/debit cards via Stripe)
- **Secure checkout** (Stripe Checkout hosted page)
- **Coffee type selector** (Espresso, Nitro, Matcha, Cyber-Latte)

### ✅ Backend Infrastructure
- **API Routes**:
  - `/api/create-checkout-session` - Creates Stripe checkout sessions
  - `/api/webhook` - Handles Stripe webhooks (payment confirmations)
  - `/api/stats` - Fetches supporter statistics
- **Database Models**:
  - `Supporter` - Stores supporter information and payment details
  - `Event` - Tracks analytics events
- **Webhook Handling**:
  - Automatic supporter record creation on successful payment
  - Subscription vs one-time payment detection
  - Analytics event tracking

### ✅ User Experience
- **Success Page** (`/success`):
  - AI-generated cyberpunk thank you message
  - Spinning holo-coin animation
  - Achievement unlock notification
  - Social sharing buttons (Twitter, LinkedIn)
  - CTA to upgrade to monthly support
  - Session ID display
- **Cancel Page** (`/cancel`):
  - Friendly "no charge" message
  - Easy return to home
- **Real-time Updates**:
  - Goal progress bar updates live
  - Supporters wall shows recent backers
  - Tip streak indicator

---

## 🔧 Setup Instructions

### Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete business verification (required for live payments)

### Step 2: Get Your API Keys

#### For Development (Test Mode)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Copy your **Test mode** keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

#### For Production (Live Mode)
1. Toggle to **Live mode** in the Stripe dashboard
2. Copy your **Live mode** keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### Step 3: Set Up Environment Variables

Create or update your `.env` file with the following:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"

# App Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_MONTHLY_GOAL_CENTS="100000"  # $1000 monthly goal

# Web Admin
WEB_ADMIN_TOKEN="your-secure-admin-token-here"
```

### Step 4: Set Up Stripe Webhook

Webhooks notify your app when payments succeed.

#### For Local Development (Using Stripe CLI)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

#### For Production Deployment

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhook`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated` (optional)
   - ✅ `customer.subscription.deleted` (optional)
5. Copy the **Signing secret** and add to your production environment variables

### Step 5: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed feature flags
npm run db:seed-flags

# (Optional) Seed dev quotes
npm run db:seed
```

### Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Scroll to the **"Upload caffeine to my system"** section

4. Select an amount or enter a custom amount

5. Choose one-time or monthly

6. Click **"Buy me a coffee"**

7. Use [Stripe test card numbers](https://stripe.com/docs/testing):
   - **Success**: `4242 4242 4242 4242`
   - **Declined**: `4000 0000 0000 0002`
   - **Requires auth**: `4000 0025 0000 3155`
   - Use any future expiry date, any CVC, any ZIP

8. Complete the payment

9. You should be redirected to `/success` with animations! 🎉

10. Check your database:
   ```bash
   npx prisma studio
   ```
   You should see a new `Supporter` record

---

## 💰 Payment Flow Explained

### User Journey
1. User lands on home page
2. User scrolls to coffee section
3. User selects amount and payment type (one-time or monthly)
4. User clicks "Buy me a coffee"
5. Particle burst animation fires! ✨
6. Redirect to Stripe Checkout (secure, hosted page)
7. User enters payment details
8. Payment processed by Stripe
9. Webhook notifies your app
10. Supporter record created in database
11. User redirected to success page
12. Holo-coin spins! 🪙
13. Achievement unlocked! 🏆
14. User can share or return home

### Backend Flow
```
CoffeeOptions.tsx
    ↓ (handleCheckout)
/api/create-checkout-session
    ↓ (creates Stripe session)
Stripe Checkout Page
    ↓ (user pays)
Stripe Webhook
    ↓ (checkout.session.completed)
/api/webhook
    ↓ (saves to database)
Supporter + Event records created
    ↓
/success page
    ↓
User sees celebration! 🎉
```

---

## 🔒 Security Features

✅ **Server-side validation** - All payment logic runs on the server  
✅ **Webhook signature verification** - Ensures events are from Stripe  
✅ **Environment variable protection** - Keys never exposed to client  
✅ **Stripe-hosted checkout** - PCI compliance handled by Stripe  
✅ **HTTPS required in production** - Encrypted communication  
✅ **Amount validation** - Minimum $1.00 enforced  

---

## 📊 Testing Checklist

Before going live, test these scenarios:

### ✅ One-time Payments
- [ ] $3 preset amount
- [ ] $5 preset amount
- [ ] $10 preset amount
- [ ] Custom amount ($1 - $999)
- [ ] Card success (4242...)
- [ ] Card declined (4000 0000 0000 0002)
- [ ] Success page displays correctly
- [ ] Supporter appears in database
- [ ] Supporter appears in wall
- [ ] Goal progress updates

### ✅ Monthly Subscriptions
- [ ] Toggle to monthly mode
- [ ] Create subscription
- [ ] Verify subscription in Stripe dashboard
- [ ] Supporter record has `monthly: true`
- [ ] Success page shows subscription message

### ✅ Webhooks
- [ ] Webhook receives events (check Stripe logs)
- [ ] Supporter record created automatically
- [ ] Analytics event logged
- [ ] No duplicate records

### ✅ Error Handling
- [ ] Cancelled payment redirects to `/cancel`
- [ ] Invalid amounts rejected
- [ ] Missing webhook secret logs error
- [ ] Network errors handled gracefully

---

## 🚀 Going Live

### Pre-Launch Checklist

1. **Switch to Live Keys**
   - Update `.env` with `pk_live_...` and `sk_live_...`
   - Never commit these to Git!

2. **Set Up Production Webhook**
   - Add webhook endpoint in Stripe dashboard
   - Update `STRIPE_WEBHOOK_SECRET` in production

3. **Update URLs**
   - Set `NEXT_PUBLIC_BASE_URL` to your production domain
   - Verify success/cancel URLs work

4. **Test with Real Card**
   - Use a real (small amount) test transaction
   - Verify end-to-end flow

5. **Enable Stripe Live Mode**
   - Complete business verification
   - Activate your account

6. **Set Up Payout Schedule**
   - Configure bank account in Stripe
   - Choose payout frequency (daily, weekly, monthly)

### Deployment Platforms

Your app works on:
- ✅ **Vercel** (recommended - zero config)
- ✅ **Netlify**
- ✅ **Railway**
- ✅ **Fly.io**
- ✅ **DigitalOcean App Platform**

For Vercel deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

---

## 💡 Pro Tips

### Customize Payment Amounts
Edit `components/CoffeeOptions.tsx`:
```typescript
const coffeeTiers = [
  { id: 3, name: 'Small', ... },
  { id: 5, name: 'Medium', ... },
  { id: 10, name: 'Large', ... },
  // Add more tiers!
]
```

### Change Monthly Goal
Update `.env`:
```bash
NEXT_PUBLIC_MONTHLY_GOAL_CENTS="500000"  # $5000 goal
```

### Add More Coffee Types
Edit `coffeeTypes` in `components/CoffeeOptions.tsx`:
```typescript
const coffeeTypes = [
  { id: 'custom', name: '🔥 Your Custom Type', color: '...', particleColor: '#...' },
  // ...
]
```

### Track Conversions
All events are logged to the `Event` table:
- `cta_click`
- `checkout_start`
- `checkout_success`

Query analytics:
```typescript
const stats = await prisma.event.groupBy({
  by: ['type'],
  _count: true,
})
```

---

## 🐛 Troubleshooting

### "Webhook signature verification failed"
- ✅ Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
- ✅ Use Stripe CLI for local development
- ✅ Check webhook endpoint in Stripe dashboard matches your URL

### "No supporters showing up"
- ✅ Verify webhook is receiving events (Stripe dashboard → Webhooks)
- ✅ Check database: `npx prisma studio`
- ✅ Ensure `checkout.session.completed` event is enabled

### "Payment successful but no database record"
- ✅ Check server logs for webhook errors
- ✅ Verify `prisma.supporter.create()` isn't throwing errors
- ✅ Test webhook locally with Stripe CLI

### "Redirect loop after payment"
- ✅ Check `NEXT_PUBLIC_BASE_URL` is set
- ✅ Verify success URL doesn't have trailing issues
- ✅ Clear browser cookies/cache

---

## 📚 Resources

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Reference](https://stripe.com/docs/api)

---

## 🎉 You're All Set!

Your Stripe integration is:
- ✅ **Secure** - Industry-standard encryption
- ✅ **Seamless** - 3-click checkout flow
- ✅ **Beautiful** - Cyberpunk UI with animations
- ✅ **Flexible** - One-time or recurring
- ✅ **Tracked** - Analytics on all actions

**Ready to accept payments!** 🚀💰

---

## 🆘 Need Help?

- Check Stripe logs: [dashboard.stripe.com/logs](https://dashboard.stripe.com/logs)
- Test webhooks: `stripe trigger checkout.session.completed`
- View database: `npx prisma studio`
- Check server logs: `npm run dev` output

Happy collecting! ☕⚡



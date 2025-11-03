# ⚡ Quick Start - Stripe Integration

## 🎯 Your site is already integrated with Stripe! Here's how to activate it:

---

## ⏱️ 5-Minute Setup

### Step 1: Create Stripe Account (2 minutes)
```bash
# Visit and sign up
https://stripe.com
```

### Step 2: Get API Keys (1 minute)
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)

### Step 3: Create .env File (1 minute)
```bash
# Create .env in project root
touch .env
```

Add this content (replace with YOUR keys):
```bash
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_will_get_in_next_step"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_MONTHLY_GOAL_CENTS="100000"
WEB_ADMIN_TOKEN="admin123"
```

### Step 4: Set Up Local Webhook (1 minute)
```bash
# Install Stripe CLI (if not installed)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks (keep this running!)
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook secret (`whsec_...`) and add to `.env`

### Step 5: Start Your App (30 seconds)
```bash
# Run database setup
npm run db:push

# Start dev server
npm run dev
```

---

## 🧪 Test Payment (1 minute)

1. Open: http://localhost:3000
2. Scroll to coffee section
3. Click **"Buy me a coffee - $5"**
4. Use test card: **4242 4242 4242 4242**
5. Expiry: Any future date
6. CVC: Any 3 digits
7. ZIP: Any 5 digits
8. Click **Pay**
9. Watch the success animations! 🎉

---

## ✅ Verification Checklist

- [ ] Redirected to success page
- [ ] Saw holo-coin animation
- [ ] Achievement unlocked notification
- [ ] Supporter appears in "Hall of Fame"
- [ ] Goal progress bar updated
- [ ] Webhook logged in Stripe CLI
- [ ] Database record created (check with `npx prisma studio`)

---

## 🚀 Go Live Checklist

When ready for production:

1. **Switch to Live Keys**
   - Get live keys from: https://dashboard.stripe.com/apikeys
   - Update `.env` with `pk_live_...` and `sk_live_...`

2. **Set Up Production Webhook**
   - Go to: https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://yourdomain.com/api/webhook`
   - Select event: `checkout.session.completed`
   - Copy signing secret
   - Update `STRIPE_WEBHOOK_SECRET` in production env

3. **Update URLs**
   - Set `NEXT_PUBLIC_BASE_URL="https://yourdomain.com"`

4. **Test with Real Card**
   - Make a small test purchase ($1)
   - Verify full flow works

5. **Enable Payouts**
   - Add bank account in Stripe Dashboard
   - Complete business verification

---

## 🎨 What's Included

Your integration has:

### Payment Features
- ✅ One-time payments
- ✅ Monthly subscriptions
- ✅ Custom amounts
- ✅ Multiple coffee types
- ✅ Secure Stripe Checkout
- ✅ Cancel anytime (for subscriptions)

### User Experience
- ✅ Particle burst animation
- ✅ Support heatwave (button glow)
- ✅ Spinning holo-coin celebration
- ✅ Achievement notifications
- ✅ AI-generated thank you message
- ✅ Social sharing buttons
- ✅ Real-time goal tracker
- ✅ Live supporters wall

### Backend
- ✅ Webhook handling
- ✅ Database storage
- ✅ Analytics tracking
- ✅ Error handling
- ✅ Security validation

---

## 📱 Test These Scenarios

### Success Payments
```
4242 4242 4242 4242  → Success
```

### Failed Payments
```
4000 0000 0000 0002  → Declined
4000 0000 0000 9995  → Insufficient funds
```

### 3D Secure (requires auth)
```
4000 0025 0000 3155  → Auth required
```

Full list: https://stripe.com/docs/testing

---

## 🐛 Troubleshooting

### "Webhook error"
```bash
# Make sure Stripe CLI is running
stripe listen --forward-to localhost:3000/api/webhook
```

### "No supporters showing"
```bash
# Check database
npx prisma studio

# Check webhook logs
# Look at your terminal running Stripe CLI
```

### "Redirect not working"
```bash
# Verify in .env
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # No trailing slash!
```

---

## 📚 Full Documentation

For complete details, see: `STRIPE_SETUP_GUIDE.md`

---

## 🎉 You're Ready!

Your Stripe integration is **production-ready** and waiting for your API keys!

**Total setup time: ~5 minutes** ⚡

Start accepting payments NOW! 💰☕

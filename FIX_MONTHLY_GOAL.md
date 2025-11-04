# 🔧 Fix Monthly Goal Not Updating

## Problem
You've received $8 in payments, but the monthly goal progress bar shows $0.

## Quick Diagnosis

### Step 1: Check if payments are in the database

Visit (in production, add `ALLOW_DIAGNOSTICS=true` to Vercel env vars first):
```
https://www.uploadcaffeine.com/api/debug-stats
```

This will show:
- All supporters in database
- Total amounts
- Whether webhook secret is configured

### Step 2: Check if webhook is configured

The most common issue is that **Stripe webhooks are not configured in production**.

## 🔴 Common Issues & Fixes

### Issue 1: Webhook Not Configured in Stripe

**Symptoms:**
- Payments succeed but don't appear in goal progress
- Database shows no supporters
- `debug-stats` shows empty array

**Fix:**

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/webhooks
   - Make sure you're in **Live mode** (not Test mode)

2. **Add Webhook Endpoint:**
   - Click **"Add endpoint"**
   - **Endpoint URL:** `https://www.uploadcaffeine.com/api/webhook`
   - **Description:** "Buy Me a Coffee webhook"
   - **Events to send:** Select:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`

3. **Copy Webhook Secret:**
   - After creating, click on the webhook
   - Click **"Reveal"** next to "Signing secret"
   - Copy the secret (starts with `whsec_...`)

4. **Add to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
     ```
   - Set for **Production** environment
   - **Redeploy** your project

### Issue 2: Webhook Secret Not Set in Vercel

**Symptoms:**
- Webhook endpoint exists in Stripe
- But payments still not saving

**Fix:**
- Check if `STRIPE_WEBHOOK_SECRET` is in Vercel environment variables
- Make sure it's set for **Production**
- Redeploy after adding

### Issue 3: Past Payments Not in Database

**Symptoms:**
- Webhook configured correctly now
- But past $8 payment is missing

**Fix:**
You have two options:

**Option A: Manual Entry (Quick Fix)**
1. Go to Stripe Dashboard → Payments
2. Find the $8 payment
3. Manually add it to database using Prisma Studio:
   ```bash
   npx prisma studio
   ```
4. Create a new supporter record with:
   - `amountCents`: 800 (for $8)
   - `currency`: "aud"
   - `monthly`: false
   - `createdAt`: The payment date

**Option B: Replay Webhook Event (Better)**
1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook endpoint
3. Find the payment event in the events list
4. Click **"..."** → **"Send test webhook"** or **"Replay"**
5. This will trigger the webhook again and save the payment

### Issue 4: Database Not Synced (Vercel)

**Symptoms:**
- Local database has data
- Production database is empty

**Fix:**
- Vercel uses a separate database file
- Need to ensure database is persisted
- Check Vercel function logs for database errors

## 🔍 How to Verify It's Working

### 1. Make a Test Payment

1. Go to your live site
2. Make a small test payment ($1)
3. Wait 30 seconds (SWR refresh interval)
4. Check if goal progress updates

### 2. Check Vercel Logs

1. Go to Vercel Dashboard → Deployments → Latest
2. Click **Functions** → `/api/webhook`
3. Look for:
   - `✅ Supporter saved (checkout):` or
   - `✅ Supporter saved (inline payment):`

If you see errors, that's the problem!

### 3. Check Stripe Webhook Logs

1. Go to Stripe Dashboard → Webhooks
2. Click your webhook endpoint
3. Check **"Recent events"**
4. Look for:
   - ✅ Green checkmarks (success)
   - ❌ Red X marks (failed)

## 📋 Complete Setup Checklist

- [ ] Stripe webhook endpoint created in **Live mode**
- [ ] Webhook URL: `https://www.uploadcaffeine.com/api/webhook`
- [ ] Events configured: `checkout.session.completed` and `payment_intent.succeeded`
- [ ] Webhook secret copied from Stripe
- [ ] `STRIPE_WEBHOOK_SECRET` added to Vercel environment variables
- [ ] Vercel environment variable set for **Production**
- [ ] Project redeployed after adding webhook secret
- [ ] Test payment made and verified in database
- [ ] Goal progress bar updates after 30 seconds

## 🚀 Quick Fix Script

If you want to manually add the $8 payment to the database:

```bash
# Connect to your production database
# (You'll need to access Vercel's database or use Prisma Studio)

# Or use Prisma Studio locally if database is synced
npx prisma studio

# Create a supporter record:
# - amountCents: 800
# - currency: "aud"
# - monthly: false
# - createdAt: [payment date]
```

## 🆘 Still Not Working?

1. **Check Vercel Function Logs:**
   - Look for errors in `/api/webhook`
   - Look for errors in `/api/stats`

2. **Check Stripe Dashboard:**
   - Verify webhook is receiving events
   - Check if events are failing

3. **Test Webhook Manually:**
   - Use Stripe CLI: `stripe listen --forward-to https://www.uploadcaffeine.com/api/webhook`
   - Or use Stripe Dashboard → Send test webhook

4. **Verify Database:**
   - Visit `/api/debug-stats` (with `ALLOW_DIAGNOSTICS=true`)
   - See what's actually in the database

## 📞 Need More Help?

- Check Vercel function logs for errors
- Check Stripe webhook logs for delivery issues
- Verify database connection in Vercel
- Make sure database file is persisted (not reset on each deployment)


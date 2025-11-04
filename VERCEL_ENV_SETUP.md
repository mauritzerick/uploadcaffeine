# Vercel Environment Variables Setup

## ⚠️ Payment Error Fix

If you're seeing: `"STRIPE_SECRET_KEY is not set in environment variables"` in production, you need to add your Stripe keys to Vercel.

## Quick Setup Steps

### 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Make sure you're in **Live mode** (toggle in top right)
3. Copy:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### 2. Add to Vercel

1. Go to your project on [Vercel Dashboard](https://vercel.com)
2. Navigate to: **Settings** → **Environment Variables**
3. Add these variables:

```
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

### 3. Important: Set Environment

Make sure to set these for **ALL environments**:
- ✅ Production
- ✅ Preview  
- ✅ Development

Or at minimum, set them for **Production**.

### 4. Redeploy

After adding the variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger a new deployment

## Verification

After redeploying, test a payment:
1. Go to your live site
2. Try to make a test payment
3. The error should be gone

## Troubleshooting

### Still getting errors?

1. **Check variable names are exact:**
   - `STRIPE_SECRET_KEY` (not `STRIPE_SECRET_KEY_LIVE` or `STRIPE_API_KEY`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (must start with `NEXT_PUBLIC_`)

2. **Verify you're using Live keys:**
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`
   - NOT test keys (`pk_test_...`, `sk_test_...`)

3. **Check deployment logs:**
   - Go to Vercel Dashboard → Deployments → Your deployment → Logs
   - Look for any environment variable warnings

4. **Try redeploying:**
   - Sometimes Vercel needs a fresh deployment to pick up new env vars

### Alternative: Test Mode First

If you want to test with test keys first:

1. Get test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add to Vercel:
   ```
   STRIPE_SECRET_KEY=sk_test_your_test_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
   ```
3. Test with Stripe test card: `4242 4242 4242 4242`

### Security Notes

- ✅ Secret keys are server-side only (never exposed to client)
- ✅ Publishable keys are safe to expose (they're public)
- ✅ Never commit keys to git
- ✅ Use different keys for test/production

## Need Help?

If issues persist:
1. Check Vercel deployment logs
2. Verify Stripe dashboard shows your keys
3. Ensure keys match your Stripe account mode (test vs live)


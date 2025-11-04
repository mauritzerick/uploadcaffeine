# 🔍 Debugging Payment Intent 500 Error

## Quick Diagnostic Steps

### 1. Check Vercel Logs

Go to your Vercel Dashboard → Your Project → Deployments → Latest Deployment → Functions → `/api/create-payment-intent`

Look for error logs with:
- `❌ Stripe PaymentIntent error:`
- `❌ Unexpected error in create-payment-intent:`
- `⚠️ Stripe Configuration Error:`

### 2. Check Environment Variables

Visit: `https://www.uploadcaffeine.com/api/stripe-diagnostic`

This will show:
- Whether `STRIPE_SECRET_KEY` is set
- Whether `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- What Stripe-related env vars exist

**Note:** This endpoint is protected in production. Add `ALLOW_DIAGNOSTICS=true` to Vercel env vars if you want to use it.

### 3. Most Common Causes

#### ❌ STRIPE_SECRET_KEY Not Set

**Symptom:** Error message contains "STRIPE_SECRET_KEY is not set"

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `STRIPE_SECRET_KEY=sk_live_your_key_here`
3. Redeploy

#### ❌ Invalid Stripe Key

**Symptom:** Stripe API error with code like `api_key_expired` or `invalid_api_key`

**Fix:**
- Get fresh keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Make sure you're using **Live mode** keys for production
- Update in Vercel and redeploy

#### ❌ Wrong Currency Configuration

**Symptom:** Stripe error about currency

**Fix:**
- Check if your Stripe account supports AUD
- Verify currency is set to `'aud'` in the code (already correct)

#### ❌ Network/Timeout Issues

**Symptom:** Timeout errors or connection refused

**Fix:**
- Check Vercel function logs for timeout
- May need to increase function timeout in Vercel settings

## What the New Error Logging Shows

After deploying these changes, check Vercel logs for:

1. **JSON Parse Errors:**
   ```
   ❌ JSON parse error: ...
   ```
   - Means the request body is malformed

2. **Stripe PaymentIntent Errors:**
   ```
   ❌ Stripe PaymentIntent error: {
     type: "StripeInvalidRequestError",
     code: "...",
     message: "...",
     statusCode: 400
   }
   ```
   - Shows exactly what Stripe rejected

3. **Stripe Checkout Session Errors:**
   ```
   ❌ Stripe Checkout Session error: { ... }
   ```
   - For subscription payments

4. **Configuration Errors:**
   ```
   ⚠️ Stripe Configuration Error: {
     availableEnvVars: [...],
     nodeEnv: "production",
     vercel: true
   }
   ```
   - Shows what env vars are available

5. **Unexpected Errors:**
   ```
   ❌ Unexpected error in create-payment-intent: {
     message: "...",
     stack: "...",
     name: "..."
   }
   ```
   - Catches any other errors

## Next Steps

1. **Deploy these changes** (better error logging)
2. **Check Vercel logs** after someone tries to pay
3. **Look for the specific error** in the logs
4. **Fix based on the error message**

## Quick Test

After deploying, test with:
```bash
curl -X POST https://www.uploadcaffeine.com/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 500, "monthly": false}'
```

Check the response - it should now give you a specific error code!


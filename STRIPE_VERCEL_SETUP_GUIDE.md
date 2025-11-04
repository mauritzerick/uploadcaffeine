# 🚀 Complete Guide: Adding Stripe Keys to Vercel

## Step 1: Get Your Stripe Keys

### Option A: Live Mode (Production) - **RECOMMENDED**

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/apikeys
   - Or: https://dashboard.stripe.com → Click **Developers** (left sidebar) → **API keys**

2. **Switch to Live Mode:**
   - Look at the top-right corner of the Stripe dashboard
   - You'll see a toggle: **"Test mode"** / **"Live mode"**
   - Click it to switch to **"Live mode"**
   - ⚠️ **Important:** You need to activate your Stripe account first if you haven't already

3. **Copy Your Keys:**
   - **Publishable key** (starts with `pk_live_...`)
     - Click the **"Reveal"** or **"Copy"** button next to it
   - **Secret key** (starts with `sk_live_...`)
     - Click **"Reveal test key"** or **"Reveal live key"** button
     - ⚠️ **Security:** Only reveal this once, copy it immediately

### Option B: Test Mode (For Testing First)

If you want to test before going live:

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/test/apikeys
   - Make sure you're in **"Test mode"** (toggle in top-right)

2. **Copy Your Keys:**
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

---

## Step 2: Add Keys to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit: https://vercel.com/dashboard
   - Click on your project: **"buymeacoffee"** (or whatever you named it)

2. **Navigate to Settings:**
   - Click **Settings** tab (top navigation)
   - Click **Environment Variables** (left sidebar)

3. **Add First Variable (Secret Key):**
   - Click **"Add New"** button
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** Paste your secret key (e.g., `sk_live_51...` or `sk_test_51...`)
   - **Environment:** Select **Production** (and optionally Preview/Development)
   - Click **"Save"**

4. **Add Second Variable (Publishable Key):**
   - Click **"Add New"** again
   - **Key:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Value:** Paste your publishable key (e.g., `pk_live_51...` or `pk_test_51...`)
   - **Environment:** Select **Production** (and optionally Preview/Development)
   - Click **"Save"**

5. **Verify:**
   - You should see both variables listed:
     - ✅ `STRIPE_SECRET_KEY`
     - ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Method 2: Via Vercel CLI (Alternative)

If you prefer command line:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add STRIPE_SECRET_KEY production
# (It will prompt you to paste the value)

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# (It will prompt you to paste the value)
```

---

## Step 3: Redeploy Your Project

After adding the environment variables, you **must redeploy** for them to take effect:

1. **Go to Deployments tab:**
   - In Vercel Dashboard → Your Project → **Deployments** tab

2. **Redeploy:**
   - Click the **"..."** (three dots) menu on your latest deployment
   - Click **"Redeploy"**
   - Or: Push a new commit to trigger a new deployment

3. **Wait for deployment:**
   - Wait for the deployment to complete (usually 1-2 minutes)

---

## Step 4: Verify It Works

### Quick Test:

1. **Visit your site:** https://www.uploadcaffeine.com
2. **Try to make a payment:**
   - Click "Buy Me a Coffee"
   - Enter an amount
   - Click to pay
3. **Check:**
   - If using **test keys**: Use test card `4242 4242 4242 4242`
   - Payment should work without the 500 error!

### Diagnostic Endpoint:

Visit: `https://www.uploadcaffeine.com/api/stripe-diagnostic`

This will show you if the keys are detected (you may need to add `ALLOW_DIAGNOSTICS=true` to Vercel env vars first).

---

## 📋 Checklist

Before going live, make sure:

- [ ] Stripe account is activated (for live mode)
- [ ] Business information is verified in Stripe
- [ ] Bank account added for payouts
- [ ] Live mode keys copied from Stripe dashboard
- [ ] Both keys added to Vercel environment variables
- [ ] Keys set for **Production** environment
- [ ] Project redeployed after adding keys
- [ ] Test payment works successfully

---

## 🔒 Security Best Practices

1. **Never commit keys to Git:**
   - ✅ Keys are in `.env.local` (already in `.gitignore`)
   - ✅ Keys are in Vercel (secure)

2. **Use different keys for test/production:**
   - Test keys: `pk_test_...`, `sk_test_...`
   - Live keys: `pk_live_...`, `sk_live_...`

3. **Rotate keys if compromised:**
   - Go to Stripe Dashboard → API keys
   - Click "Roll key" if needed

4. **Limit access:**
   - Only share secret keys with team members who need them
   - Use Vercel's team access controls

---

## 🆘 Troubleshooting

### "Keys not working after redeploy"

1. **Check variable names:**
   - Must be exactly: `STRIPE_SECRET_KEY`
   - Must be exactly: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Case-sensitive!

2. **Check environment:**
   - Make sure keys are set for **Production**
   - Check the "Environment" dropdown when adding

3. **Try redeploying again:**
   - Sometimes Vercel needs a fresh deploy

### "Still getting 500 error"

1. **Check Vercel logs:**
   - Go to Deployments → Latest → Functions → `/api/create-payment-intent`
   - Look for error messages

2. **Verify keys are correct:**
   - Secret key should start with `sk_live_` or `sk_test_`
   - Publishable key should start with `pk_live_` or `pk_test_`

3. **Check Stripe account status:**
   - Make sure your Stripe account is activated
   - For live mode, complete business verification

---

## 📞 Need More Help?

- **Stripe Support:** https://support.stripe.com
- **Vercel Support:** https://vercel.com/support
- **Check Vercel Logs:** Your deployment logs will show exactly what's wrong

---

## 🎯 Quick Reference

**Stripe Dashboard:**
- Test keys: https://dashboard.stripe.com/test/apikeys
- Live keys: https://dashboard.stripe.com/apikeys

**Vercel Dashboard:**
- Environment Variables: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Variable Names:**
- `STRIPE_SECRET_KEY` (secret key - server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (publishable key - client-side safe)


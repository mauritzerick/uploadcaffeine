# 🔍 Debug: Goal Progress Not Updating

## Quick Diagnosis Steps

### Step 1: Check if Data is in Database

**Option A: Use Debug Endpoint (if enabled)**
```
Visit: https://www.uploadcaffeine.com/api/debug-stats
(Add ALLOW_DIAGNOSTICS=true to Vercel env vars first)
```

**Option B: Check Browser Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs:
   - `📊 Stats API response:` - Shows what the API returns
   - `📊 Stats data updated:` - Shows what the component received

### Step 2: Check if Webhook Saved Data

**Check Vercel Logs:**
1. Go to Vercel Dashboard → Deployments → Latest
2. Click **Functions** → `/api/webhook`
3. Look for:
   - `✅ Supporter saved (inline payment):` or
   - `✅ Supporter saved (checkout):`
4. If you see errors, that's the problem!

**Check Stripe Dashboard:**
1. Go to Stripe Dashboard → Webhooks
2. Click your webhook endpoint
3. Check **Recent events**
4. Look for the payment event you resent
5. Check if it shows ✅ (success) or ❌ (failed)

### Step 3: Test Stats API Directly

**In Browser Console:**
```javascript
fetch('/api/stats')
  .then(r => r.json())
  .then(data => console.log('Stats API:', data))
```

**What to look for:**
- `goal.currentCents` - Should show your $8 (800 cents)
- `goal.progressPercentage` - Should show percentage
- `goal.oneTimeTotal` - Should show $8 (800 cents)

### Step 4: Check if Mutate is Being Called

**In Browser Console:**
1. After resending webhook, look for:
   - `🔄 Payment success event received, refreshing stats...`
   - `🔄 Payment succeeded, refreshing stats...`
2. If you DON'T see these, the mutate isn't being triggered

### Step 5: Manually Trigger Refresh

**In Browser Console:**
```javascript
// This will force a refresh
fetch('/api/stats')
  .then(r => r.json())
  .then(data => {
    console.log('Fresh stats:', data)
    // Check if data.goal.currentCents shows your $8
  })
```

## Common Issues & Fixes

### Issue 1: Webhook Not Saving to Database

**Symptoms:**
- Webhook event shows ✅ in Stripe
- But no `✅ Supporter saved` in Vercel logs
- `/api/debug-stats` shows empty array

**Possible Causes:**
1. Webhook secret mismatch
2. Database connection error
3. Duplicate prevention (payment already processed)

**Fix:**
- Check Vercel logs for errors
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check if payment was already saved (duplicate check)

### Issue 2: Stats API Returning Wrong Data

**Symptoms:**
- Database has data (check `/api/debug-stats`)
- But `/api/stats` returns `currentCents: 0`

**Possible Causes:**
1. Date calculation issue (wrong month)
2. Monthly filter excluding the payment
3. Amount in wrong currency

**Fix:**
- Check `/api/debug-stats` to see actual data
- Compare with `/api/stats` response
- Check if `createdAt` is in current month

### Issue 3: SWR Cache Not Updating

**Symptoms:**
- Stats API returns correct data
- But UI shows old data
- Console shows `📊 Stats data updated:` with old values

**Possible Causes:**
1. SWR cache not invalidating
2. Mutate not being called
3. Browser cache

**Fix:**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check console for mutate logs
- Try manual refresh button (dev mode)

### Issue 4: Payment Outside Current Month

**Symptoms:**
- Payment was made last month
- Stats only counts current month
- `startOfMonth` filter excludes it

**Fix:**
- Check payment `createdAt` date
- If it's last month, it won't show in monthly goal
- This is expected behavior (monthly goal = current month only)

## Immediate Actions

### 1. Check Database First

**Add to Vercel env vars:**
```
ALLOW_DIAGNOSTICS=true
```

**Then visit:**
```
https://www.uploadcaffeine.com/api/debug-stats
```

**Look for:**
- `allSupporters` array - should have your payment
- `currentMonthStats.combinedTotal` - should show $8 (800 cents)

### 2. Check Stats API Response

**In browser console:**
```javascript
fetch('/api/stats')
  .then(r => r.json())
  .then(data => {
    console.log('Current:', data.goal.currentCents)
    console.log('Target:', data.goal.targetCents)
    console.log('Progress:', data.goal.progressPercentage)
  })
```

### 3. Force Refresh

**In browser console:**
```javascript
// Force SWR to refresh
import { mutate } from 'swr'
mutate('/api/stats', undefined, { revalidate: true })
```

Or use the manual refresh button (in development mode).

## Expected Console Output

After resending webhook, you should see:

```
✅ Supporter saved (inline payment): [id]
📊 Stats API response: { currentCents: 800, ... }
🔄 Payment success event received, refreshing stats...
📊 Stats data updated: { currentCents: 800, ... }
```

If you DON'T see these logs, that's where the issue is!

## Still Not Working?

1. **Check Vercel Function Logs** - Look for errors
2. **Check Stripe Webhook Logs** - Verify event was sent
3. **Check Database** - Use `/api/debug-stats` to see actual data
4. **Check Browser Console** - Look for errors or missing logs
5. **Try Hard Refresh** - Clear browser cache

## Quick Test

1. Make a NEW test payment ($1)
2. Watch browser console for logs
3. Check if progress bar updates
4. If it does, the issue is with the old $8 payment
5. If it doesn't, the issue is with the refresh mechanism


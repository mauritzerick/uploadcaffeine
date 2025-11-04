# ⚠️ Important: Webhook Retrigger vs UI Update

## Why Retriggering Webhook Doesn't Update UI

**When you retrigger a webhook from Stripe Dashboard:**
- ✅ Webhook fires server-side
- ✅ Database gets updated (if webhook works)
- ❌ Client doesn't know about it
- ❌ UI doesn't update automatically

**The client-side code only triggers when:**
- User makes a NEW payment (client-side event)
- User manually refreshes page
- 30-second polling picks it up

## Solution: Manual Refresh

After retriggering a webhook, you need to manually refresh:

1. **Click the "🔄 Refresh Stats Now" button** on the goal progress bar
2. **OR** Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
3. **OR** Wait 30 seconds for automatic polling

## Check if Webhook Actually Saved Data

1. Visit: `https://www.uploadcaffeine.com/api/debug-stats`
2. Look for your payment in `allSupporters` array
3. Check `isCurrentMonth: true/false` - if false, payment won't show in monthly goal
4. Check `currentMonthStats.combinedTotal` - should show your $8 (800 cents)

## Common Issue: Payment Outside Current Month

**If your payment shows `isCurrentMonth: false`:**
- Payment was made last month
- Monthly goal only counts **current month** payments
- This is expected behavior
- The payment exists but won't show in monthly goal

**Fix:** Make a new payment this month, or change the goal logic to count all-time.


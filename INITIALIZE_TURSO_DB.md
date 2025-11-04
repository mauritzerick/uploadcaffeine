# 🚀 Initialize Turso Database - Step by Step

## You've Completed:
✅ Signed up for Turso  
✅ Added DATABASE_URL to Vercel

## Next Steps:

### Step 1: Get Your Turso Connection String

1. Go to: https://turso.tech/dashboard
2. Click your database
3. Click **"Connect"** tab
4. Copy the connection string (looks like: `libsql://dbname.turso.io?authToken=...`)

### Step 2: Initialize Database Locally (One-Time)

**Temporarily add DATABASE_URL to `.env.local`:**

1. Open `.env.local` in your project
2. Add this line (replace with your actual Turso connection string):
   ```env
   DATABASE_URL=libsql://your-db.turso.io?authToken=your-token
   ```
3. Save the file

**Then run these commands:**

```bash
# 1. Create database tables (schema)
npm run db:push

# 2. Seed feature flags (optional but recommended)
npm run db:seed-flags
```

**After running, you can remove DATABASE_URL from `.env.local`** (it's already in Vercel)

### Step 3: Redeploy on Vercel

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait ~2-3 minutes

### Step 4: Verify It Works

Visit: `https://www.uploadcaffeine.com/api/debug-stats`

Should show:
```json
{
  "totalSupporters": 0,
  "allSupporters": [],
  "currentMonthStats": {
    "combinedTotal": 0,
    ...
  }
}
```

**No errors = Database is connected! ✅**

### Step 5: Test a Payment

1. Make a small test payment ($1)
2. Check Stripe webhook logs
3. Visit `/api/debug-stats` again
4. Should see your payment in `allSupporters` array

## 🎉 Done!

Your database is now:
- ✅ Connected to Turso
- ✅ Tables created
- ✅ Ready to store payments
- ✅ Monthly goal will update automatically

## Alternative: Initialize via API Route (No Local Setup)

If you don't want to add DATABASE_URL locally, you can create a one-time initialization API route.

But the local method above is simpler and recommended.


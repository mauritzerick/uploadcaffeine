# 📝 Step-by-Step: Add DATABASE_URL to Vercel

## Where to Add It

**Yes, add it in Vercel's Environment Variables** (not in your local `.env.local` file)

## Step-by-Step Instructions

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Click on your project: **"buymeacoffee"** (or whatever you named it)

### Step 2: Navigate to Environment Variables
1. Click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** in the left sidebar
3. You should see a list of existing variables (like `STRIPE_SECRET_KEY`, etc.)

### Step 3: Add DATABASE_URL
1. Click the **"+ Add New"** button
2. Fill in the form:
   - **Key:** `DATABASE_URL`
   - **Value:** See options below ⬇️
   - **Environment:** Select **"Production"** (or check all: Production, Preview, Development)
3. Click **"Save"**

### Step 4: Choose Your Value

#### Option A: Temporary SQLite (Quick Fix) ⚠️
```
Value: file:/tmp/prod.db
```
**Warning:** Data will be lost on redeploy!

#### Option B: Turso (Recommended) ⭐
```
Value: libsql://your-database-name.turso.io?authToken=your-auth-token
```

**How to get Turso connection string:**
1. Sign up: https://turso.tech
2. Create database
3. Click "Connect" tab
4. Copy the connection string
5. Paste it as the Value

#### Option C: Neon PostgreSQL
```
Value: postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### Step 5: Redeploy
1. After saving, go to **"Deployments"** tab
2. Click the **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 6: Verify
1. Visit: `https://www.uploadcaffeine.com/api/debug-stats`
2. Should show database info (no errors)
3. If you see an error, check:
   - DATABASE_URL is saved correctly
   - Redeployment completed
   - Connection string format is correct

## Visual Guide

```
Vercel Dashboard
  └── Your Project
      └── Settings
          └── Environment Variables
              └── + Add New
                  ├── Key: DATABASE_URL
                  ├── Value: [paste your connection string]
                  └── Environment: Production ✅
```

## Quick Checklist

- [ ] Go to Vercel Dashboard
- [ ] Click your project
- [ ] Settings → Environment Variables
- [ ] Click "+ Add New"
- [ ] Key: `DATABASE_URL`
- [ ] Value: `libsql://...` (Turso) or `file:/tmp/prod.db` (temporary)
- [ ] Environment: Production
- [ ] Click Save
- [ ] Redeploy
- [ ] Test: Visit `/api/debug-stats`

## Need Help?

- **Turso Setup:** https://turso.tech/docs
- **Neon Setup:** https://neon.tech/docs
- **Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables


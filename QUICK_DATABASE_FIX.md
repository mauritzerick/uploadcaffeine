# ⚡ Quick Fix: Add DATABASE_URL to Vercel

## Immediate Fix (5 minutes)

### Step 1: Add DATABASE_URL to Vercel

1. Go to: https://vercel.com/dashboard
2. Click your project → **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Add:
   ```
   Key: DATABASE_URL
   Value: file:/tmp/prod.db
   Environment: Production
   ```
5. Click **"Save"**
6. **Redeploy** your project

### Step 2: Initialize Database on First Request

The database will be created automatically when Prisma first connects.

### Step 3: Seed Initial Data (Optional)

After first deployment, you can seed feature flags:
```bash
# This won't work directly - need to run via API or manually
```

## ⚠️ Important: SQLite Limitations on Vercel

**This is a TEMPORARY solution.** SQLite on Vercel:
- ❌ Loses data on redeploy
- ❌ Not persistent across function invocations
- ❌ Not suitable for production

**For production, use a cloud database:**
- Turso (SQLite-compatible) - Easiest
- Neon (PostgreSQL) - Recommended
- Supabase (PostgreSQL) - Full-featured

## 🎯 Better Solution: Use Turso (5 minutes)

### Why Turso?
- ✅ SQLite-compatible (no code changes!)
- ✅ Works with your existing Prisma schema
- ✅ Free tier available
- ✅ Serverless-friendly
- ✅ Persistent data

### Setup Steps:

1. **Sign up:** https://turso.tech
2. **Create database:**
   - Click "Create Database"
   - Name it (e.g., "buymeacoffee")
   - Select a location (closest to your users)

3. **Get connection string:**
   - Click your database
   - Go to "Connect" tab
   - Copy the connection string (looks like: `libsql://dbname.turso.io`)
   - Copy the auth token

4. **Add to Vercel:**
   ```
   DATABASE_URL=libsql://your-db.turso.io?authToken=your-token-here
   ```
   - Set for **Production**
   - Click **Save**

5. **Redeploy:**
   - Go to Deployments
   - Click "..." → "Redeploy"

6. **Initialize Schema:**
   - After deployment, the database will be empty
   - You may need to run migrations or seed data

### Alternative: Neon (PostgreSQL)

If you prefer PostgreSQL:

1. **Sign up:** https://neon.tech
2. **Create project**
3. **Copy connection string**
4. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from sqlite
     url      = env("DATABASE_URL")
   }
   ```
5. **Add to Vercel:**
   ```
   DATABASE_URL=postgresql://user:pass@host/dbname
   ```
6. **Run migration:**
   ```bash
   npx prisma migrate deploy
   ```

## 📋 What to Do Right Now

### Quick Fix (Temporary):
1. Add `DATABASE_URL=file:/tmp/prod.db` to Vercel
2. Redeploy
3. Test - payments should save now

### Proper Fix (Recommended):
1. Sign up for Turso (free)
2. Create database
3. Add connection string to Vercel
4. Redeploy
5. Data will persist!

## ✅ Verification

After adding DATABASE_URL:
1. Visit: `https://www.uploadcaffeine.com/api/debug-stats`
2. Should show database info (no error)
3. Make a test payment
4. Check if payment appears in database


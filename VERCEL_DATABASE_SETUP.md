# 🗄️ Vercel Database Setup Guide

## ⚠️ Critical Issue: DATABASE_URL Not Set

Your production site is missing `DATABASE_URL` in Vercel environment variables.

## 🚨 SQLite on Vercel - Important Limitations

**SQLite on Vercel serverless functions has issues:**
- Serverless functions don't persist files between invocations
- Database file gets reset on each deployment
- Data is lost when function restarts
- **NOT recommended for production**

## ✅ Recommended Solution: Use a Cloud Database

### Option 1: Neon (PostgreSQL) - **RECOMMENDED** ⭐

1. **Create Neon Account:**
   - Go to: https://neon.tech
   - Sign up (free tier available)
   - Create a new project

2. **Get Connection String:**
   - Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)

3. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from sqlite
     url      = env("DATABASE_URL")
   }
   ```

4. **Add to Vercel:**
   ```
   DATABASE_URL=postgresql://user:pass@host/dbname
   ```

5. **Run Migration:**
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: Turso (SQLite-compatible) - **EASIEST MIGRATION**

1. **Create Turso Account:**
   - Go to: https://turso.tech
   - Sign up (free tier available)
   - Create a new database

2. **Get Connection String:**
   - Copy the connection string (looks like: `libsql://dbname.turso.io`)

3. **Keep SQLite Schema** (no changes needed!)

4. **Add to Vercel:**
   ```
   DATABASE_URL=libsql://your-db.turso.io?authToken=...
   ```

### Option 3: Supabase (PostgreSQL) - **FREE & EASY**

1. **Create Supabase Account:**
   - Go to: https://supabase.com
   - Sign up (free tier available)
   - Create a new project

2. **Get Connection String:**
   - Go to: Project Settings → Database
   - Copy "Connection string" (URI format)

3. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Add to Vercel:**
   ```
   DATABASE_URL=postgresql://postgres:password@host:5432/postgres
   ```

## 🚀 Quick Fix: Add DATABASE_URL to Vercel (Temporary)

If you want to test quickly with SQLite (will lose data on redeploy):

1. **Go to Vercel Dashboard:**
   - Your Project → Settings → Environment Variables

2. **Add:**
   ```
   DATABASE_URL=file:/tmp/prod.db
   ```
   (Note: `/tmp` is writable but gets cleared between deployments)

3. **Redeploy**

**⚠️ WARNING:** Data will be lost on redeploy with SQLite!

## 📋 Complete Vercel Environment Variables Checklist

Add ALL of these to Vercel:

```
# Database (use cloud database!)
DATABASE_URL=postgresql://...  # or libsql://... for Turso

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Config
NEXT_PUBLIC_BASE_URL=https://www.uploadcaffeine.com
NEXT_PUBLIC_MONTHLY_GOAL_CENTS=15000

# Admin (optional)
WEB_ADMIN_TOKEN=your-secure-token-here
```

## 🔧 Migration Steps (If Switching to PostgreSQL)

### Step 1: Update Prisma Schema

```prisma
datasource db {
  provider = "postgresql"  // Change this
  url      = env("DATABASE_URL")
}
```

### Step 2: Generate Migration

```bash
npx prisma migrate dev --name init
```

### Step 3: Update Vercel DATABASE_URL

Add PostgreSQL connection string to Vercel.

### Step 4: Deploy Migration

```bash
npx prisma migrate deploy
```

## 🎯 Recommended: Turso (Easiest Migration)

Since you're using SQLite, **Turso is the easiest** because:
- ✅ No schema changes needed
- ✅ Keep using SQLite
- ✅ Works with existing Prisma setup
- ✅ Free tier available
- ✅ Serverless-friendly

**Steps:**
1. Sign up at https://turso.tech
2. Create database
3. Copy connection string
4. Add to Vercel: `DATABASE_URL=libsql://...`
5. Done! No code changes needed.

## 🆘 Need Help Choosing?

- **Turso**: Easiest migration, free tier, SQLite-compatible
- **Neon**: PostgreSQL, free tier, good performance
- **Supabase**: PostgreSQL + auth + storage, free tier
- **PlanetScale**: MySQL, free tier, serverless

**For your use case, I recommend Turso** - it's the simplest migration path.


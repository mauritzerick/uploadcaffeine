# Feature Flags System - Complete Guide

## 🎯 Overview

This guide covers the **Feature Flags System**, **Terminal Console**, **Device Hologram**, and **Web Admin** features added to your Buy Me a Coffee app.

---

## 🚩 Feature Flags System

### What is it?
A runtime configuration system that lets you toggle features on/off **without redeploying** your app. Perfect for:
- A/B testing new features
- Gradual rollouts
- Emergency feature shutdowns
- Development/staging environments

### How it works
1. **Database**: Feature flags are stored in SQLite via Prisma
2. **API**: REST endpoints to read and modify flags
3. **Client**: React Context + SWR for real-time updates (30s polling)
4. **Admin**: Web UI to manage flags at `/web-admin`

### Current Feature Flags

| Key | Name | Description | Default |
|-----|------|-------------|---------|
| `terminal_console` | Terminal Console | Floating mini-console with system commands | ✅ ON |
| `device_hologram` | Device Hologram | Hologram scan overlay showing device info | ✅ ON |
| `matrix_rain` | Matrix Rain Easter Egg | Matrix-style falling characters | ✅ ON |
| `ai_agents` | Ambient AI Agents | Draggable floating AI and Coffee agents | ✅ ON |
| `particle_effects` | Particle Effects | Neon particle bursts and effects | ✅ ON |

---

## 💻 Terminal Console

### Activation
Press **backtick** (`` ` ``) to open/close the terminal

### Available Commands

```bash
help                    # List all commands
brew <type>            # Simulate fueling reactor (espresso|latte|matcha|nitro)
status                 # Show system metrics
glitch                 # Trigger glitch visual effect
matrix                 # Toggle Matrix rain mode
clear                  # Clear console output
flags                  # List all feature flags
```

### Examples

```bash
$ help                 # Show all commands
$ brew espresso        # Fuel the reactor with espresso
$ status               # Check system metrics
$ glitch               # Trigger glitch effect
$ matrix               # Toggle Matrix mode
$ flags                # View feature flags
$ clear                # Clear output
```

### Features
- ✅ Command history (Arrow Up/Down)
- ✅ Draggable window
- ✅ Persistent state (localStorage)
- ✅ Focus trap (Escape to close)
- ✅ Cyberpunk theme
- ✅ Analytics tracking

### Implementation Details
- **File**: `components/TerminalConsole.tsx`
- **State**: `localStorage` for size and open/closed state
- **Events**: Custom events for `matrix`, `glitch`, `brew`
- **Security**: Sandboxed (no eval, no network access)

---

## 🔍 Device Hologram

### Activation
- Hover over supported UI elements (will be added to CTAs)
- Or run `window.dispatchEvent(new Event('toggle-hologram'))` in console

### What it shows
- 🌐 Browser (Chrome, Firefox, Safari, Edge)
- 💻 Operating System (Windows, macOS, Linux, iOS, Android)
- 📐 Viewport dimensions
- ⚡ Pixel ratio (retina displays)
- 🌍 Locale and timezone
- 🎨 Motion preference (reduced motion detection)

### Status Indicators
- **Stable**: Reduced motion enabled
- **Overclocked**: High pixel ratio (> 2x)
- **Optimal**: Standard configuration

### Features
- ✅ Auto-closes after 6 seconds
- ✅ Dismissible on mouse leave
- ✅ Sweep scanner animation
- ✅ Floating particles
- ✅ Privacy-safe (client-side only)

### Implementation Details
- **File**: `components/DeviceHologram.tsx`
- **Privacy**: No PII, all data computed client-side
- **Effects**: Scan grid, sweep line, micro particles

---

## 🔐 Web Admin

### Access
Navigate to **`/web-admin`** in your browser

### Authentication

#### First-time setup:
1. Add to your `.env`:
   ```env
   WEB_ADMIN_TOKEN=your_secure_token_here
   ```

2. Visit: `http://localhost:3000/web-admin?token=your_secure_token_here`

3. Cookie is set for 24 hours (httpOnly, SameSite=Lax)

#### Subsequent visits:
Just go to `/web-admin` - you'll stay logged in for 24 hours

### Features

#### ✅ List All Flags
- View all feature flags
- See current state (ON/OFF)
- Last updated timestamp

#### ✅ Toggle Flags
- Click toggle switch to enable/disable
- Optimistic UI updates
- Changes reflected immediately on client (SWR revalidation)

#### ✅ Create New Flags
1. Click "Create Flag" button
2. Fill in:
   - **Key**: Unique identifier (e.g., `new_feature`)
   - **Name**: Display name (e.g., "New Feature")
   - **Description**: What this flag controls
   - **Enabled**: Default state
3. Click "Create"

#### ✅ Search/Filter
- Search by key or name
- Real-time filtering

#### ✅ Audit Trail
- Every toggle is logged to `FeatureToggleAudit` table
- Track who changed what and when

### Security
- ✅ Token-based authentication
- ✅ httpOnly cookies (can't be accessed by JavaScript)
- ✅ SameSite=Lax (CSRF protection)
- ✅ Secure flag in production
- ✅ Rate limiting (TODO: implement in production)
- ✅ No secrets exposed in HTML

---

## 📡 API Routes

### GET `/api/flags`
**Public** - List all feature flags

```javascript
const response = await fetch('/api/flags')
const { flags } = await response.json()
```

### POST `/api/flags`
**Admin only** - Create new flag

```javascript
const response = await fetch('/api/flags', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'new_feature',
    name: 'New Feature',
    description: 'Description here',
    enabled: true
  })
})
```

### PATCH `/api/flags/[key]`
**Admin only** - Toggle flag

```javascript
const response = await fetch('/api/flags/terminal_console', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ enabled: false })
})
```

### POST `/api/admin/auth`
Authenticate with token

```javascript
const response = await fetch('/api/admin/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'your_token' })
})
```

### GET `/api/admin/check`
Check if authenticated

---

## 🎨 Client Integration

### Using Feature Flags in Components

```typescript
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'

function MyComponent() {
  const { isEnabled, flags, refresh } = useFeatureFlagsContext()
  
  if (!isEnabled('my_feature')) {
    return null // Feature is disabled
  }
  
  return <div>Feature is enabled!</div>
}
```

### Available Methods

```typescript
const { 
  flags,           // Array of all flags
  isEnabled,       // (key: string) => boolean
  getFlag,         // (key: string) => FeatureFlag | undefined
  isLoading,       // boolean
  isError,         // any
  refresh,         // () => void - manually refresh flags
} = useFeatureFlagsContext()
```

### Fallback Strategy
If the API fails, the system falls back to default flags defined in `hooks/useFeatureFlags.ts`:

```typescript
const DEFAULT_FLAGS = {
  terminal_console: true,
  device_hologram: true,
  matrix_rain: true,
  ai_agents: true,
  particle_effects: true,
}
```

---

## 🗄️ Database Schema

### FeatureFlag
```prisma
model FeatureFlag {
  id          String   @id @default(cuid())
  key         String   @unique
  name        String
  description String?
  enabled     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([key])
  @@index([enabled])
}
```

### FeatureToggleAudit
```prisma
model FeatureToggleAudit {
  id        String   @id @default(cuid())
  flagKey   String
  oldValue  Boolean
  newValue  Boolean
  by        String   // "admin" or admin identifier
  createdAt DateTime @default(now())

  @@index([flagKey])
  @@index([createdAt])
}
```

---

## 🚀 Setup Instructions

### 1. Database Setup
```bash
# Already done! But if you need to reset:
npx prisma db push
npm run db:seed-flags
```

### 2. Environment Variables
Add to your `.env`:
```env
WEB_ADMIN_TOKEN=supersecret
```

**⚠️ IMPORTANT**: Change `supersecret` to a secure random string in production!

### 3. Generate Secure Token
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing

### Test Terminal Console
1. Open your app
2. Press `` ` `` (backtick)
3. Type `help` and press Enter
4. Try commands: `brew latte`, `status`, `glitch`, `matrix`

### Test Device Hologram
1. In browser console:
   ```javascript
   window.dispatchEvent(new Event('toggle-hologram'))
   ```
2. Hologram should appear with device info
3. Should auto-close after 6 seconds

### Test Web Admin
1. Visit: `http://localhost:3000/web-admin?token=supersecret`
2. Should see admin dashboard
3. Toggle a flag (e.g., `terminal_console`)
4. Refresh main page - terminal should disappear
5. Toggle back on - terminal reappears (or press `` ` ``)

### Test Feature Flags
1. Open admin, disable `ai_agents`
2. Refresh homepage - AI agents disappear
3. Enable `ai_agents` again
4. Agents reappear within 30 seconds (or refresh)

---

## 📊 Analytics Events

The following events are tracked:

### Terminal Console
- `terminal_open`
- `terminal_cmd_invoke` (with command + args)
- `terminal_close`

### Device Hologram
- `hologram_open`
- `hologram_close`
- `hologram_autoclose`

### Feature Flags
- `flags_list`
- `flag_toggle` (with key + new state)

All events go to `/api/track` and are stored in the `Event` table.

---

## 🔮 Future Enhancements

### Planned Features
- [ ] User-specific flag overrides
- [ ] Percentage-based rollouts (e.g., 20% of users)
- [ ] Time-based scheduling (enable/disable at specific times)
- [ ] Multi-environment support (dev/staging/prod)
- [ ] Bulk operations (enable/disable multiple flags)
- [ ] Export/import flag configurations
- [ ] Webhook notifications on flag changes
- [ ] Real-time updates via WebSocket (instead of 30s polling)
- [ ] Rate limiting on admin endpoints
- [ ] Multi-admin support with role-based access

---

## 🛡️ Security Best Practices

### Production Checklist
- [ ] Change `WEB_ADMIN_TOKEN` to a secure random string
- [ ] Rotate admin token regularly (monthly)
- [ ] Enable HTTPS (secure cookie flag)
- [ ] Add rate limiting to admin endpoints
- [ ] Monitor audit logs for suspicious activity
- [ ] Restrict `/web-admin` to internal IPs (if possible)
- [ ] Add multi-factor authentication (future)

---

## 🐛 Troubleshooting

### Terminal doesn't open
- Check feature flag: `terminal_console` should be enabled
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

### Device hologram not showing
- Check feature flag: `device_hologram` should be enabled
- Try manual trigger: `window.dispatchEvent(new Event('toggle-hologram'))`

### Can't access Web Admin
- Check `.env` has `WEB_ADMIN_TOKEN` set
- Try with token in URL: `/web-admin?token=your_token`
- Clear cookies and try again
- Check browser console for 401 errors

### Feature flags not updating
- Flags update every 30 seconds via SWR
- Force refresh: Reload page
- Check API: `curl http://localhost:3000/api/flags`
- Check database: `npm run db:studio`

### Database issues
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
npm run db:seed
npm run db:seed-flags
```

---

## 📚 Files Reference

### Components
- `components/TerminalConsole.tsx` - Terminal interface
- `components/DeviceHologram.tsx` - Hologram overlay

### API Routes
- `app/api/flags/route.ts` - List/create flags
- `app/api/flags/[key]/route.ts` - Get/update flag
- `app/api/admin/auth/route.ts` - Admin authentication
- `app/api/admin/check/route.ts` - Check auth status

### Pages
- `app/web-admin/page.tsx` - Admin dashboard

### Hooks & Providers
- `hooks/useFeatureFlags.ts` - Feature flags hook
- `providers/FeatureFlagsProvider.tsx` - Context provider

### Utilities
- `lib/adminAuth.ts` - Admin authentication helpers

### Database
- `prisma/schema.prisma` - Database schema
- `prisma/seed-flags.ts` - Feature flags seed script

---

## 🎉 Summary

You now have a complete **Feature Flags System** with:
- ✅ Runtime feature toggles (no redeploy needed!)
- ✅ Terminal Console (backtick to open)
- ✅ Device Hologram (shows device info)
- ✅ Web Admin dashboard (`/web-admin`)
- ✅ Real-time updates (30s polling)
- ✅ Audit logging (track all changes)
- ✅ Secure authentication (token + httpOnly cookies)
- ✅ Client-side fallback (if API fails)

**Next Steps**:
1. Test all features locally
2. Update `WEB_ADMIN_TOKEN` in `.env`
3. Deploy and test in production
4. Monitor audit logs
5. Roll out new features gradually!

**Need help?** Check the troubleshooting section or reach out!

---

**Built with ❤️ and ☕**



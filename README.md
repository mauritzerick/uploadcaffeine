# Buy Me a Coffee - Cyberpunk Edition ☕⚡

A futuristic, neon-themed donation platform built with Next.js 14, featuring stunning visual effects, AI agents, and seamless Stripe integration.

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Stripe](https://img.shields.io/badge/Stripe-Integrated-purple)

## 🌟 Features

- 🎨 **Cyberpunk UI** - Neon glows, glitch effects, and animated backgrounds
- ⚡ **AI Agents** - Interactive agents with personality
- 🎵 **Neon Radio** - YouTube-powered music player
- 💳 **Stripe Payments** - Secure one-time & monthly donations in AUD
- 🎮 **Easter Eggs** - Matrix rain, glitch mode, flying coffee mugs
- 📊 **Goal Tracking** - Visual progress towards monthly goals
- 🔧 **Feature Flags** - Dynamic feature management via admin panel
- 📱 **Fully Responsive** - Beautiful on all devices
- 🔍 **SEO Optimized** - Blog, tools, and structured data
- 🇦🇺 **Australian Focus** - Built for Australian indie developers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (Australian business account recommended)
- SQLite (included)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mauritzerick/buymeacoffee.git
cd buymeacoffee
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Stripe Keys (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
# For local development (SQLite):
DATABASE_URL="file:./dev.db"

# For production (Turso/libSQL) - Set in Vercel, not in .env.local:
# DATABASE_URL=libsql://<your-db>.turso.io
# DATABASE_AUTH_TOKEN=<your-token>
# DIAG_TOKEN=<random-string-for-diagnostics>

# Monthly Goal (in cents, e.g., 15000 = $150 AUD)
NEXT_PUBLIC_MONTHLY_GOAL_CENTS=15000

# Admin Token (Choose a secure random string)
ADMIN_TOKEN=your-secure-random-token-here

# Stripe Webhook Secret (Get after setting up webhook)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

4. **Set up database**
```bash
npm run db:push          # Create database schema
npm run db:seed          # Seed initial data
npm run db:seed-flags    # Seed feature flags
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📁 Project Structure

```
buymeacoffee/
├── app/                      # Next.js 14 App Router
│   ├── (blog)/              # Blog pages (MDX)
│   ├── api/                 # API routes
│   ├── tools/              # Free SEO tools
│   ├── success/            # Payment success page
│   └── web-admin/          # Admin dashboard
├── components/              # React components
│   ├── effects/            # Visual effects
│   └── ...                 # Core components
├── content/                 # MDX content
│   ├── posts/              # Blog posts (6 posts)
│   └── outreach/           # Marketing templates
├── lib/                     # Utility functions
├── prisma/                  # Database
└── middleware.ts            # Canonical URLs
```

## 🎨 Key Components

### AI Agents
- **Ambient Agent** - Floating motivational companion
- **Stoic Agent** - Philosophical quotes on demand
- **Glitch Agent** - Activate chaotic glitch effects (press 'G')

### Visual Effects
- **Matrix Rain** - Press 'M' three times
- **Flying Coffee Mugs** - Click any coffee icon (90 mugs!)
- **Glitch Mode** - Press 'G' for colorful chaos

### Features
- **Neon Radio** - YouTube music with playlists
- **Goal Progress** - Monthly donation tracking
- **SEO Blog** - 6 Australian-focused blog posts
- **Free Tools** - Neon quote generator, glitch SFX, gradient maker

## 💻 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Payments:** Stripe (AUD currency)
- **Database:** SQLite with Prisma ORM
- **Blog:** MDX (gray-matter + next-mdx-remote)
- **SEO:** Dynamic sitemaps, OG images, JSON-LD
- **Deployment:** Vercel (recommended)

## 🔧 Configuration

### Feature Flags

Access `/web-admin?token=YOUR_ADMIN_TOKEN` to manage:
- AI Agents (ambient, stoic, glitch)
- Visual Effects (matrix rain, terminal)
- Neon Radio settings
- Device Hologram
- Features Menu

### Stripe Setup

1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add to `.env.local`
3. Set up webhook endpoint:
   - URL: `https://uploadcaffeine.com/api/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Add webhook secret to `.env.local`

### Database (Prisma) — Turso / libSQL

Set these in Vercel → Settings → Environment Variables (Production + Preview):

```
DATABASE_URL=libsql://<your-db>.turso.io
DATABASE_AUTH_TOKEN=<your token>
# optional debug
DIAG_TOKEN=<random>
```

> Do **not** append `?authToken=` to `DATABASE_URL`. Keep the token in `DATABASE_AUTH_TOKEN`.

#### Diagnostics

After deploy, verify DB connectivity:
```
GET /api/diagnostics/db?token=<DIAG_TOKEN>
```

This returns `{ ok: true/false, mode, versions }` and masks secrets. All Prisma DB routes run on **Node.js** runtime.

#### Local Development (SQLite)

For local development, use SQLite:

```env
DATABASE_URL="file:./dev.db"
```

Using Prisma with SQLite:

```bash
# Push schema changes
npm run db:push

# Open Prisma Studio
npm run db:studio

# Seed data
npm run db:seed
npm run db:seed-flags
```

## 🎮 Easter Eggs

Try these secret interactions:

- **Konami Code** - ↑↑↓↓←→←→BA
- **Matrix Mode** - Press 'M' three times quickly
- **Glitch Effect** - Press 'G' key
- **Flying Mugs** - Click any coffee icon ☕

## 📊 Analytics

Track events via `/api/track`:
- Page views
- Button clicks
- Payment completions
- Feature usage

Web Vitals via `/api/seo-kpi`:
- LCP, FID, CLS, INP

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Environment variables needed:
```
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_BASE_URL
DATABASE_URL
DATABASE_AUTH_TOKEN          # Required for Turso/libSQL
ADMIN_TOKEN
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_MONTHLY_GOAL_CENTS
```

### Custom Domain

Add `uploadcaffeine.com` in Vercel settings and update DNS.

## 🔒 Security

- ✅ Environment variables in `.env.local` (Git ignored)
- ✅ Stripe webhook signature verification
- ✅ Admin token authentication
- ✅ HTTPS enforcement in production
- ✅ No secrets in client code

## 🎨 Customization

### Colors

Edit CSS variables in `app/globals.css`:
```css
:root {
  --neon-cyan: #00ffff;
  --neon-pink: #ff00ff;
  --neon-purple: #b000ff;
}
```

### Amounts

Update coffee tier prices in `components/CoffeeOptions.tsx`

### Monthly Goal

Set in `.env.local`:
```env
NEXT_PUBLIC_MONTHLY_GOAL_CENTS=15000  # $150 AUD
```

### SEO Configuration

Edit `lib/seo.config.ts` for site name, domain, keywords, etc.

## 🐛 Troubleshooting

### Payments not working
- Check Stripe keys are correct
- Verify webhook endpoint is configured
- Check browser console for errors

### "Automatic payment filling disabled" warning
- Normal on localhost (HTTP)
- Disappears in production (HTTPS)
- See `STRIPE_LOCALHOST_NOTES.md`

### Database errors
- Run `npm run db:push`
- Try deleting `prisma/dev.db` and re-seeding

### Build errors
- Delete `.next` folder
- Run `npm install` again
- Check for TypeScript errors

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)

**Project Docs:**
- `SEO_IMPLEMENTATION_SUMMARY.md` - Complete SEO guide
- `STRIPE_LOCALHOST_NOTES.md` - Stripe development guide
- `content/outreach/` - Marketing templates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 💖 Support

If you find this project helpful:
- ⭐ Star the repository on [GitHub](https://github.com/mauritzerick/buymeacoffee)
- 🐛 Report bugs via Issues
- 💡 Suggest features
- ☕ [Buy me a coffee!](https://uploadcaffeine.com)

## 🙏 Acknowledgments

- Design inspired by cyberpunk aesthetics
- Icons from [Lucide](https://lucide.dev)
- Animations powered by [Framer Motion](https://www.framer.com/motion)
- Payments by [Stripe](https://stripe.com)
- Font: Inter (Google Fonts)

---

**Built with 💜 and ☕ by [Mauritz Erick](https://github.com/mauritzerick)** 

🌐 **Live Site:** [uploadcaffeine.com](https://uploadcaffeine.com)  
💼 **LinkedIn:** [mauritzerick](https://www.linkedin.com/in/mauritzerick/)  
📧 **Email:** mauritz.erick@gmail.com

---

### 🇦🇺 Proudly Australian

Supporting indie developers in Australia and beyond. Upload caffeine to your favorite creators! ☕⚡

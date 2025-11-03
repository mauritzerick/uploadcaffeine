# Domain Update Summary: uploadcaffeine.com

## ✅ Changes Completed

### 1. Core Configuration Files
- ✅ **`lib/seo.config.ts`** - Updated domain to `https://uploadcaffeine.com` and canonicalHost to `uploadcaffeine.com`
- ✅ **`middleware.ts`** - Already using `SITE.canonicalHost` (auto-updated)
- ✅ **`app/layout.tsx`** - Already using `SITE.domain` (auto-updated)

### 2. Documentation Files
- ✅ **`README.md`** - Updated all references (6 instances)
- ✅ **`STRIPE_LOCALHOST_NOTES.md`** - Updated deployment URL
- ✅ **`SEO_IMPLEMENTATION_SUMMARY.md`** - Updated domain references (3 instances)

### 3. Blog Posts (MDX)
- ✅ **`content/posts/what-your-coffee-funds.mdx`** - Updated 2 links
- ✅ **`content/posts/futuristic-tip-jar-design.mdx`** - Updated 1 link
- ✅ **`content/posts/cyberpunk-donation-ui.mdx`** - Updated 1 link
- ✅ **`content/posts/how-to-tip-developers-online-australia.mdx`** - Updated 1 link
- ✅ **`content/posts/buy-me-a-coffee-australia-guide.mdx`** - Updated 2 links

### 4. Marketing & Outreach
- ✅ **`content/outreach/email-templates.md`** - Updated 6 instances
  - GitHub README badge template
  - Indie Hackers/Reddit posts
  - Twitter posts
  - LinkedIn posts
  - Email outreach templates

### 5. Components
- ✅ **`components/QRCodeBanner.tsx`** - Already set to `uploadcaffeine.com`

## 📋 Files Using Dynamic References (Auto-Updated)

These files automatically pull from `lib/seo.config.ts`:

1. **`app/layout.tsx`** - Uses `SITE.domain` for metadataBase
2. **`middleware.ts`** - Uses `SITE.canonicalHost` for redirects
3. **`app/sitemap.ts`** - Uses `SITE.domain` for sitemap URLs
4. **`app/robots/route.ts`** - Uses `SITE.domain` for sitemap reference
5. **`lib/og.tsx`** - Uses `SITE` for OG image generation
6. **`app/opengraph-image.tsx`** - Uses `ogBase()` which pulls from `SITE`
7. **`app/twitter-image.tsx`** - Uses `ogBase()` which pulls from `SITE`
8. **`app/feed.xml/route.ts`** - Uses `SITE.domain` for RSS feed
9. **`app/atom.xml/route.ts`** - Uses `SITE.domain` for Atom feed
10. **All blog posts** - Use dynamic canonical URLs

## 🔧 Environment Variables

### Development (`.env.local`)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Keep for local dev
```

### Production (Vercel/Deployment)
```env
NEXT_PUBLIC_BASE_URL=https://uploadcaffeine.com  # Update when deploying
```

## 🚀 Deployment Checklist

### Before Deploying:

1. ✅ Purchase domain `uploadcaffeine.com`
2. ⬜ Point DNS to Vercel (or hosting provider)
3. ⬜ Add domain in Vercel dashboard
4. ⬜ Update production environment variable:
   ```
   NEXT_PUBLIC_BASE_URL=https://uploadcaffeine.com
   ```
5. ⬜ Wait for SSL certificate (automatic)
6. ⬜ Deploy application
7. ⬜ Verify canonical URLs redirect correctly
8. ⬜ Test QR code banner

### After Deploying:

1. ⬜ Submit sitemap to Google Search Console: `https://uploadcaffeine.com/sitemap.xml`
2. ⬜ Update Stripe webhook URL: `https://uploadcaffeine.com/api/webhook`
3. ⬜ Test payments end-to-end
4. ⬜ Verify OG images: `https://uploadcaffeine.com/opengraph-image`
5. ⬜ Check robots.txt: `https://uploadcaffeine.com/robots.txt`
6. ⬜ Test RSS feed: `https://uploadcaffeine.com/feed.xml`
7. ⬜ Verify all blog posts load correctly
8. ⬜ Run Lighthouse audit (target: 95+ SEO score)

## 🔍 SEO Impact

### Positive Changes:
- ✅ Memorable, brandable domain
- ✅ Matches brand identity ("Upload Caffeine")
- ✅ Easier to type and remember
- ✅ .com extension (more universal)
- ✅ All internal links updated
- ✅ Canonical URLs configured
- ✅ Structured data uses correct domain

### Migration Notes:
- Since this is a new site (not migrating existing rankings), no 301 redirects needed from old domain
- Submit new domain to search engines immediately
- Use outreach templates to promote new domain
- Update GitHub repo description with new URL
- Update social media profiles with new link

## 📊 Domain Configuration Summary

| Setting | Value |
|---------|-------|
| **Domain** | `uploadcaffeine.com` |
| **Canonical Host** | `uploadcaffeine.com` |
| **Protocol** | HTTPS (enforced in production) |
| **WWW Redirect** | www → non-www (enforced) |
| **Locale** | en-AU (Australian English) |
| **Sitemap** | `https://uploadcaffeine.com/sitemap.xml` |
| **Robots** | `https://uploadcaffeine.com/robots.txt` |
| **RSS Feed** | `https://uploadcaffeine.com/feed.xml` |
| **Atom Feed** | `https://uploadcaffeine.com/atom.xml` |

## 🧪 Testing URLs

Test these after deployment:

- `https://uploadcaffeine.com` - Homepage
- `https://uploadcaffeine.com/blog` - Blog index
- `https://uploadcaffeine.com/blog/support-indie-developer-australia` - Sample post
- `https://uploadcaffeine.com/tools/neon-quote` - Free tool
- `https://uploadcaffeine.com/mission` - Mission page
- `https://uploadcaffeine.com/sitemap.xml` - Sitemap
- `https://uploadcaffeine.com/robots.txt` - Robots
- `https://uploadcaffeine.com/feed.xml` - RSS
- `https://uploadcaffeine.com/opengraph-image` - OG image
- `https://www.uploadcaffeine.com` - Should redirect to non-www

## 🎯 Next Steps

1. **Deploy to production** with updated environment variables
2. **Configure DNS** at your domain registrar
3. **Add to Vercel** and wait for SSL
4. **Update Stripe webhook** URL
5. **Submit to Google Search Console**
6. **Test all functionality** end-to-end
7. **Start outreach campaign** using templates in `content/outreach/`

---

**All domain references have been successfully updated to `uploadcaffeine.com`!** 🎉

The codebase is now ready for deployment with the new domain.


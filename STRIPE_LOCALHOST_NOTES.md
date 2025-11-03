# Stripe Localhost Development Notes

## ⚠️ About the "Automatic payment methods filling is disabled" Warning

### What is it?
When testing Stripe payments on **localhost** (http://localhost:3000), you may see:
> "Automatic payment methods filling is disabled because this form does not use secure connection"

### Why does it happen?
- Stripe's autofill features (like Link and saved payment methods) require **HTTPS** for security
- Localhost runs on **HTTP** by default (not secure)
- This is **NORMAL** and **EXPECTED** in development

### Is it a problem?
**NO!** ❌
- The payment form still works perfectly
- Manual card entry works fine
- Only autofill is disabled (which is rarely used in testing anyway)

### Will it appear in production?
**NO!** ✅
- Production sites use HTTPS (Vercel, Netlify, etc.)
- The warning disappears automatically
- All autofill features work normally

---

## 🧪 Testing on Localhost

### Option 1: Ignore the Warning (Recommended)
- ✅ Fastest approach
- ✅ Payment testing works perfectly
- ✅ Manual card entry is all you need for testing
- ❌ Warning message remains visible

### Option 2: Use HTTPS on Localhost (Advanced)
If you really want to remove the warning locally:

```bash
# Install mkcert
brew install mkcert  # Mac
# OR
choco install mkcert  # Windows

# Create local certificate
mkcert -install
mkcert localhost

# Update Next.js to use HTTPS (create server.js)
# This is complex and usually not worth it for development
```

**Not recommended** - adds complexity with minimal benefit.

---

## 🚀 Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_BASE_URL=https://buymeacoffee.au
   ```
4. Deploy ✅ HTTPS automatic, warning gone!

### Other Hosts
- Netlify: HTTPS automatic
- Railway: HTTPS automatic
- Custom server: Install Let's Encrypt certificate

---

## 🔒 Security Checklist

### Development (Localhost)
- ✅ Use live keys ONLY in `.env.local`
- ✅ Never commit `.env.local` to Git
- ✅ Test with Stripe test cards
- ⚠️ Warning message is OK

### Production
- ✅ HTTPS enabled (automatic on Vercel/Netlify)
- ✅ Environment variables set securely
- ✅ Webhook endpoint configured
- ✅ No warning messages

---

## 🎯 What I Fixed

1. **Removed Stripe Link**
   - Disabled the optional form after card entry
   - Only shows card payment option
   - Cleaner, faster checkout

2. **Explained Warning**
   - Warning is normal on localhost
   - Not a bug or security issue
   - Disappears in production

3. **Currency Fixed**
   - Changed from USD to AUD
   - $5 AUD = $5 AUD (no conversion)

---

## 📝 Testing Payment Forms

### Test Card Numbers
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184

Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Testing Flow
1. Select amount ($5, $10, $20)
2. Enter test card number
3. Fill required fields
4. Submit payment
5. ✅ Success page shows

---

## 🔍 Troubleshooting

### "Invalid API key provided"
- Check `.env.local` has correct keys
- Restart dev server after changing .env

### "No such payment_intent"
- Stripe secret key mismatch
- Using test key with live key or vice versa

### Warning still shows in production
- Check your domain has valid SSL certificate
- Verify HTTPS is enabled (https:// in URL)

---

## 📚 Resources

- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)


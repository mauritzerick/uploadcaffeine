# Buy Me a Coffee - The Best Support Platform ??

A beautiful, modern, and fully functional "Buy Me a Coffee" website built with Next.js, TypeScript, Tailwind CSS, and Stripe integration.

## ? Features

- ?? **Beautiful Modern UI** - Gorgeous gradient designs with smooth animations
- ? **Multiple Coffee Tiers** - Pre-set donation amounts plus custom amount option
- ?? **Stripe Integration** - Secure payment processing
- ?? **Fully Responsive** - Looks great on all devices
- ? **Fast & Optimized** - Built with Next.js 14 for optimal performance
- ?? **Smooth Animations** - Powered by Framer Motion
- ?? **Supporters Gallery** - Showcase your amazing supporters
- ?? **SEO Optimized** - Ready for search engines

## ?? Getting Started

### Prerequisites

- Node.js 18+ installed
- A Stripe account (get one at [stripe.com](https://stripe.com))

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd buymeacoffee
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your Stripe keys:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ?? Configuration

### Stripe Setup

1. Sign up for a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Add them to your `.env.local` file
4. For testing, use Stripe's test mode keys (they start with `sk_test_` and `pk_test_`)

### Customization

- **Edit content**: Modify the components in the `components/` directory
- **Change colors**: Update the coffee color palette in `tailwind.config.js`
- **Update coffee tiers**: Edit the `coffeeTiers` array in `components/CoffeeOptions.tsx`
- **Modify supporters**: Update the `supporters` array in `components/Supporters.tsx`

## ?? Project Structure

```
buymeacoffee/
??? app/
?   ??? api/
?   ?   ??? create-checkout-session/  # Stripe checkout API
?   ??? success/                       # Success page
?   ??? cancel/                        # Cancel page
?   ??? globals.css                    # Global styles
?   ??? layout.tsx                     # Root layout
?   ??? page.tsx                       # Home page
??? components/
?   ??? Hero.tsx                       # Hero section
?   ??? About.tsx                      # About section
?   ??? CoffeeOptions.tsx              # Donation options
?   ??? Supporters.tsx                 # Supporters gallery
?   ??? Footer.tsx                     # Footer
??? package.json
??? tailwind.config.js
??? tsconfig.json
```

## ?? Customization Guide

### Changing Colors

Edit `tailwind.config.js` to modify the coffee color palette:

```js
colors: {
  coffee: {
    // Your custom colors here
  },
}
```

### Adding New Coffee Tiers

Edit `components/CoffeeOptions.tsx`:

```tsx
const coffeeTiers = [
  // Add your new tier here
  {
    id: 'tier5',
    name: 'Premium Sponsor',
    amount: 100,
    emoji: '??',
    description: 'Become a premium sponsor!',
    icon: Crown,
    color: 'from-purple-500 to-purple-600',
  },
]
```

### Updating Content

- **Hero section**: `components/Hero.tsx`
- **About section**: `components/About.tsx`
- **Supporters**: `components/Supporters.tsx`
- **Footer**: `components/Footer.tsx`

## ?? Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Any platform that supports Next.js

## ?? Security Notes

- Never commit your `.env.local` file
- Use environment variables for all sensitive data
- Use Stripe's test mode during development
- Switch to live keys only when ready for production

## ?? License

This project is open source and available under the MIT License.

## ?? Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Icons by [Lucide](https://lucide.dev/)
- Payments by [Stripe](https://stripe.com/)

## ?? Tips

- Test payments using Stripe's test card: `4242 4242 4242 4242`
- Use any future expiry date and any CVC
- Check Stripe Dashboard for test payments
- Customize the design to match your brand!

---

Made with ? and ??

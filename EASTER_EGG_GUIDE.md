# 🎮 Easter Egg & Feature Guide

## 🔓 How to Activate Matrix Mode

There are **TWO ways** to activate the secret Matrix Rain mode:

### Method 1: Easy Mode (Recommended)
**Press the 'M' key 3 times quickly** (within 1 second)
- Look for the hint at the bottom of the page!
- Console will show: `🎮 Matrix Mode Activated! (MMM)`

### Method 2: Konami Code (Classic)
Press this sequence on your keyboard:
```
↑ ↑ ↓ ↓ ← → ← → B A
```
(Arrow Up, Arrow Up, Arrow Down, Arrow Down, Arrow Left, Arrow Right, Arrow Left, Arrow Right, then the letter 'b', then the letter 'a')

- You'll see progress in the browser console
- Console will show: `🎮 Matrix Mode Activated! (Konami Code)`

## 🤖 AI Agents (DRAGGABLE + INTERACTIVE!)

You now have **TWO draggable cyber assistants** with personalities!

### ☕ Coffee Assistant (Cyan → Amber gradient)
- Coffee cup icon
- Cyan glow effect
- **Click for coffee jokes!** (3 jokes, then asks for support)
- Starts on the **LEFT side of the hero message** 

### 🖥️ CPU Assistant (Cyan → Purple gradient)
- CPU chip icon  
- Purple glow effect
- **Click for AI/dev jokes!** (3 jokes, then asks for support)
- Starts on the **RIGHT side of the hero message**

### 🎮 What you can do:

#### 1️⃣ **DRAG** - Move them anywhere
- Click and drag to reposition
- Glow intensifies when dragging
- Tooltip shows "✋ Dragging..." while moving

#### 2️⃣ **CLICK** - Get funny jokes!
- **First 3 clicks**: Different jokes each time
- **4th click**: "Out of energy" message appears
- **Auto-scroll**: After 1.5 seconds, page smoothly scrolls to coffee section! 🎢
- **Manual option**: Click "Support Now" link for instant scroll
- Jokes auto-dismiss after 3 seconds
- Beautiful popup with glowing border

#### 3️⃣ **MOUSE FOLLOW** - They track your cursor!
- Subtly follows your mouse movement (5% sensitivity from screen center)
- Only when NOT being dragged
- Creates a playful, alive feeling
- Smooth spring animation prevents jumping
- Works from any position (even after dragging)

#### 4️⃣ **HOVER** - Show tooltips
- "Coffee Assistant" or "AI Assistant Active"
- 3 sparkles orbit around each agent

### 😂 Sample Jokes:

**AI Agent:**
- "🤖 Error 404: Coffee not found. Installing caffeine.exe..."
- "💭 I asked my AI for a joke. It said: 'Your code.'"
- "⚡ Why did the AI cross the road? To optimize the other side!"

**Coffee Agent:**
- "☕ Debugging? More like De-coffee-ing!"
- "💻 Java: The only language I drink AND code in"
- "🔥 I like my code like my coffee: Strong and keeping me up at night"

### Pro Tips:
- **Click each agent 3 times** to see all their jokes!
- **4th click**: Page auto-scrolls to coffee section after 1.5 seconds! 🎢
- **Impatient?** Click "Support Now" link for instant scroll
- **They start flanking the hero message** - one on each side
- Drag them to opposite corners for symmetry
- They follow your mouse for a playful effect
- Cursor changes to "grab" when hovering
- Perfect for drawing attention to your main message!

## 🎨 All Interactive Features

1. **Coffee Particle Burst** - Click any "Buy Me a Coffee" button
2. **Neon Tip Streak** - Appears in top-left (if supporters exist)
3. **AI Agents (x2)** - DRAGGABLE! Coffee & CPU assistants you can move anywhere
4. **Matrix Rain** - Press 'M' three times or use Konami code
5. **Daily Quote** - Changes every day (based on day of year)
6. **Holo Coin** - Appears briefly on success page
7. **Achievement** - Shows 5 seconds after coin on success page
8. **Coffee Type Selector** - Choose your brew type in the support section
9. **Support Heatwave** - Button glow increases with amount
10. **Backer Badges** - VIP/SUPER badges on supporters
11. **Mission Terminal** - Visit `/mission` page
12. **Goal Progress** - Live updating progress bar

## 🐛 Debugging Tips

- Open browser console (F12) to see Matrix mode activation logs
- Check console for Konami code progress
- All animations are optimized with Framer Motion
- Refresh page to reset Matrix mode

## 💡 Pro Tips

- **Click the agents** - Get 3 jokes from each, then they'll hint about needing coffee! 😄
- **Auto-scroll magic** - 4th click automatically scrolls to coffee section after 1.5s! 🎢
- **Instant scroll** - Or click "Support Now" link for immediate scroll
- **Drag the AI agents** to your favorite spots on the screen!
- **Watch them follow** your mouse cursor for a playful effect
- **They start flanking your hero message** - drawing attention to the center
- Try placing them near the support button for extra emphasis
- Drag them to opposite corners for a symmetrical look
- Try the Matrix mode with music playing for full cyberpunk vibes
- Check out the Mission Terminal (`/mission`) for the project roadmap
- The 1.5 second delay lets users read the "out of energy" message first!

---

**Enjoy the cyber experience! ⚡🌟**

### 🎨 Want to customize?

Edit `/app/page.tsx` to:
- Remove one agent (delete a line)
- Change icons (`icon="coffee"` or `icon="cpu"`)
- Adjust starting positions with `initialPosition={{ x: 100, y: 100 }}`


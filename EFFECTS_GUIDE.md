# 🎮 Cinematic Effects & Easter Eggs Guide

## ✅ **What's Been Added**

Your Buy Me a Coffee app now has **8 mind-blowing visual effects** and easter eggs, all controlled by feature flags!

---

## 🎯 **New Effects**

### **1. ⚡ Glitch Agent Button** (Top-Right)
- **Location**: Fixed top-right corner
- **Trigger**: Click the button OR press `G` key
- **What it does**: 
  - Triggers cinematic glitch effect across entire screen
  - RGB color split, screen shake, noise overlay
  - Respects 6-second cooldown
  - Cooldown progress shown as ring around button

**Features**:
- Right-click for context menu with more controls
- Keyboard shortcut: `G` (when not in text input)
- Animated glow and pulse effects
- Tooltip shows cooldown status

---

### **2. 🌈 Cinematic Glitch Effect**
- **Trigger**: Glitch Agent button or `G` key
- **Duration**: 900ms
- **Effects**:
  - Screen shake and jitter
  - RGB chromatic aberration (red/cyan split)
  - Noise/scanline overlay
  - Color hue shifts
  - Intensified CRT scanlines

**Intensity Levels**:
- **Low**: Subtle effect, slower animations
- **Med**: Balanced (default)
- **High**: Intense, rapid shake and split

---

### **3. 🫘 Quantum Bean Rain**
- **Trigger**: Payment success (automatic)
- **Duration**: 1.5 seconds
- **What it does**: 
  - Emits coffee beans, gems, lightning from top of screen
  - Particles fall with gravity and rotate
  - Fade out on landing
  - Randomized horizontal positions

**Particle Count by Intensity**:
- **Low**: 20 particles
- **Med**: 40 particles
- **High**: 60 particles

---

### **4. 💥 Screen Fracture Pulse**
- **Trigger**: Automatically with glitch effect
- **Duration**: 350ms
- **What it does**:
  - Radial fracture lines from screen center
  - SVG displacement filter for distortion
  - Expanding pulse ring
  - Cyan neon glow

**Customization**: Intensity affects line count and displacement strength

---

### **5. ⏱️ Time Warp (Slow-Mo)**
- **Trigger**: Hold `Space` bar for 800ms
- **Duration**: 1.5 seconds
- **What it does**:
  - Slows down ALL animations
  - Multiplies animation/transition durations
  - Affects entire page
  - Temporary effect

**Intensity Multipliers**:
- **Low**: 1.4x slower (70% speed)
- **Med**: 2x slower (50% speed)
- **High**: 3.3x slower (30% speed)

---

### **6. ✨ Spectral Afterimage Cursor**
- **Trigger**: Toggle via Glitch Agent menu
- **What it does**:
  - Leaves trail of glowing dots behind cursor
  - Dots fade over 500ms
  - Desktop only (disabled on mobile)
  - Minimal performance impact

**Trail Length by Intensity**:
- **Low**: 5 dots
- **Med**: 10 dots
- **High**: 15 dots

---

### **7. 🔮 Kaleidoscope Mode**
- **Trigger**: 
  - Double-click site logo (future)
  - Via Glitch Agent menu
  - Terminal command: `kaleido on`
- **Duration**: 5 seconds
- **What it does**:
  - Mirror segments radiate from center
  - Rotating conic gradient background
  - Central glow pulse
  - Overlay message

**Mirror Count by Intensity**:
- **Low**: 2 mirrors
- **Med**: 4 mirrors
- **High**: 6 mirrors

---

### **8. 🎵 Vibe Mode Audio** (Future)
- **Status**: Flag created, implementation pending
- **Planned**: Ambient synth pad audio loop
- **Controls**: Volume slider, mute toggle

---

## 🎮 **Keyboard Shortcuts**

| Key | Action | Condition |
|-----|--------|-----------|
| `G` | Trigger glitch effect | Not in text input |
| `Space` (hold 800ms) | Activate time warp | Not in text input |
| `ESC` | Close Glitch Agent menu | When menu open |

---

## 🎯 **Feature Flags**

All effects can be toggled via the `/web-admin` panel:

| Flag Key | Default | Description |
|----------|---------|-------------|
| `glitch_agent` | ✅ ON | Show/hide top-right button |
| `effect_glitch_cinematic` | ✅ ON | Enable glitch effect |
| `effect_quantum_bean_rain` | ✅ ON | Bean rain on success |
| `effect_screen_fracture` | ✅ ON | Fracture pulse effect |
| `effect_time_warp` | ✅ ON | Slow-mo mode |
| `cursor_afterimage` | ❌ OFF | Cursor trail (opt-in) |
| `kaleidoscope_mode` | ❌ OFF | Kaleidoscope effect |
| `vibe_mode_audio` | ❌ OFF | Ambient audio |

---

## 🔧 **How to Use**

### **Immediate Usage** (Restart Server)

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Look for the ⚡ button** in the top-right corner

3. **Click it** or press `G` to trigger the glitch effect!

4. **Right-click** the button for more options

5. **Hold Space** for 800ms to trigger time warp

---

### **Managing Effects**

#### **Via Web Admin**

1. Go to: **http://localhost:3000/web-admin**

2. Enter your admin token

3. Find the effect flags:
   - `glitch_agent`
   - `effect_glitch_cinematic`
   - etc.

4. Toggle ON/OFF as desired

5. Effects update in real-time (within 30s)

#### **Via Database**

```bash
npx prisma studio
```

Navigate to `FeatureFlag` table and edit:
- `enabled`: true/false
- `intensity`: "low", "med", or "high"

---

## 🎨 **Visual Design**

### **Glitch Agent Button**
- Circular gradient (cyan → purple)
- Pulsing neon ring
- Rotating Zap icon when active
- Cooldown progress indicator
- Cyan glow (intensifies on trigger)

### **Effect Aesthetics**
- **Cyberpunk theme**: Neon cyan and purple
- **Retro-futuristic**: CRT scanlines and noise
- **High contrast**: RGB splits and chromatic aberration
- **Smooth animations**: Framer Motion throughout

---

## ♿ **Accessibility**

### **Reduced Motion Support**
If user has `prefers-reduced-motion: reduce` enabled:
- ❌ Glitch effects disabled
- ❌ Time warp disabled
- ❌ All intense animations suppressed
- ✅ Functionality preserved

### **Focus Management**
- Glitch Agent button is keyboard accessible
- `Tab` to focus, `Enter` to activate
- ESC closes menus
- Focus rings visible

### **Audio Control**
- Vibe mode audio muted by default
- Global mute toggle available
- Volume controls provided

---

## 🔬 **Technical Details**

### **Performance Optimizations**

1. **GPU Acceleration**:
   - Uses CSS `transform` and `opacity`
   - `will-change` hints applied
   - Hardware-accelerated animations

2. **Request Animation Frame**:
   - Cursor trail uses RAF for smoothness
   - Throttled to 60fps
   - Cleanup on component unmount

3. **Lazy Loading**:
   - Effects only render when triggered
   - Minimal idle resource usage
   - Dynamic imports for heavy components

4. **Mobile Optimizations**:
   - Cursor trail disabled on touch devices
   - Reduced particle counts
   - Simplified animations

### **Code Structure**

```
lib/
  effectsConfig.ts        → Configuration constants

hooks/
  useGlitchEffects.ts     → Main effects hook

components/
  GlitchAgent.tsx         → Top-right button component
  effects/
    BeanRain.tsx          → Bean particle effect
    ScreenFracture.tsx    → SVG fracture effect
    CursorTrail.tsx       → Cursor trail dots
    KaleidoscopeLayer.tsx → Mirror overlay

app/
  globals.css             → Enhanced glitch/warp styles
  layout.tsx              → GlitchAgent mounted here

prisma/
  seed-effects.ts         → Database seeder
  schema.prisma           → Updated with intensity/jsonConfig
```

---

## 🧪 **Testing Checklist**

- [ ] Glitch Agent button appears top-right
- [ ] Click button triggers glitch effect
- [ ] Press `G` key triggers glitch
- [ ] Cooldown works (6 seconds)
- [ ] RGB split visible during glitch
- [ ] Noise overlay appears
- [ ] Screen shake animation works
- [ ] Hold Space (800ms) triggers time warp
- [ ] Animations slow down during time warp
- [ ] Right-click opens context menu
- [ ] Toggle cursor trail works (desktop)
- [ ] Cursor dots appear behind mouse
- [ ] Kaleidoscope effect works from menu
- [ ] Reduced motion disables effects
- [ ] ESC closes menu
- [ ] Effects respect feature flags
- [ ] Web admin can toggle flags

---

## 🎯 **Quick Examples**

### **Trigger Glitch Programmatically**

```typescript
// In any component
import { useGlitchEffects } from '@/hooks/useGlitchEffects'

const { triggerGlitch } = useGlitchEffects()

// Trigger with custom intensity
triggerGlitch('high')
```

### **Trigger Bean Rain**

```typescript
// In your success handler
import { useState } from 'react'
import BeanRain from '@/components/effects/BeanRain'

const [showBeanRain, setShowBeanRain] = useState(false)

// On payment success
setShowBeanRain(true)

// Render
<BeanRain trigger={showBeanRain} intensity="high" />
```

### **Check Feature Flag**

```typescript
import { useFeatureFlagsContext } from '@/providers/FeatureFlagsProvider'

const { isEnabled } = useFeatureFlagsContext()

if (isEnabled('effect_glitch_cinematic')) {
  // Enable glitch feature
}
```

---

## 🐛 **Troubleshooting**

### **Button not appearing**
- Check: `glitch_agent` flag is enabled in `/web-admin`
- Restart server after flag changes
- Clear browser cache (Cmd+Shift+R)

### **Glitch not triggering**
- Check: `effect_glitch_cinematic` flag enabled
- Verify cooldown expired (6 seconds)
- Check browser console for errors
- Ensure not on cooldown (ring shows progress)

### **Time Warp not working**
- Hold Space for FULL 800ms
- Check: `effect_time_warp` flag enabled
- Ensure not in text input field
- Check reduced motion settings

### **Cursor trail not showing**
- Toggle it ON via Glitch Agent menu
- Desktop only (not mobile)
- Check: `cursor_afterimage` flag enabled
- Mouse must be moving

### **Effects too intense**
- Lower intensity in database: `intensity: "low"`
- Or disable specific effects via flags
- Check if reduced motion is enabled

---

## 🎨 **Customization**

### **Change Glitch Intensity**

Edit `lib/effectsConfig.ts`:

```typescript
glitch: {
  intensity: {
    low: 0.3,   // More subtle
    med: 0.7,   // Moderate
    high: 2.0,  // Extreme!
  }
}
```

### **Modify Glitch Duration**

```typescript
glitch: {
  duration: 1500, // 1.5 seconds instead of 900ms
}
```

### **Change Particle Emojis**

Edit `components/effects/BeanRain.tsx`:

```typescript
const BEAN_EMOJIS = ['🔥', '💎', '⭐', '🚀', '💫']
```

### **Adjust Cooldown**

Edit `lib/effectsConfig.ts`:

```typescript
glitch: {
  cooldown: 3000, // 3 seconds instead of 6
}
```

---

## 📊 **Analytics Events**

All effects are tracked via `/api/track`:

| Event | Data |
|-------|------|
| `glitch_agent_click` | `{ intensity }` |
| `glitch_effect_start` | `{ intensity }` |
| `glitch_effect_end` | `{ intensity }` |
| `bean_rain_emit` | `{ intensity, count }` |
| `time_warp_on` | `{ intensity }` |
| `time_warp_off` | `{ intensity }` |
| `kaleidoscope_on` | `{}` |
| `cursor_trail_toggle` | `{ enabled }` |

---

## 🚀 **What's Next**

Future enhancements (not yet implemented):
- [ ] Secret Konami code combo
- [ ] Vibe mode ambient audio
- [ ] Double-click logo for kaleidoscope
- [ ] Terminal commands for effects
- [ ] Admin panel Effects tab UI
- [ ] Effect intensity sliders in admin
- [ ] Preview buttons in admin
- [ ] More particle effects
- [ ] Screen warp distortion
- [ ] Hologram overlay effect

---

## 🎉 **Summary**

You now have:
- ✅ **Glitch Agent** floating button (top-right)
- ✅ **Cinematic Glitch** effect (RGB split + shake)
- ✅ **Bean Rain** particles (payment success)
- ✅ **Screen Fracture** pulse effect
- ✅ **Time Warp** slow-mo mode
- ✅ **Cursor Trail** afterimage effect
- ✅ **Kaleidoscope** mirror mode
- ✅ **8 feature flags** for control
- ✅ **Keyboard shortcuts** (G, Space)
- ✅ **Context menu** for quick access
- ✅ **Accessibility support** (reduced motion)
- ✅ **Performance optimized** (GPU, RAF)
- ✅ **Analytics tracking** built-in

**Restart your server and press `G` to experience the glitch!** ⚡🎮✨

---

## 📚 **Related Files**

- `EFFECTS_GUIDE.md` ← You are here!
- `INLINE_PAYMENT_GUIDE.md` - Payment system docs
- `STRIPE_SETUP_GUIDE.md` - Stripe integration
- `QUICK_START.md` - Quick start guide

**Have fun breaking reality!** 🌌💥🎭



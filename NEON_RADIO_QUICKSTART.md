# 📻 Neon Radio - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Seed the Database (30 seconds)

```bash
# Run the seed script to add the neon_radio feature flag
npm run db:seed-flags
```

Expected output:
```
🚀 Seeding feature flags...
✅ Seeded 6 feature flags

📋 Current feature flags:
   ✅ ON ai_agents - Ambient AI Agents
   ✅ ON device_hologram - Device Hologram
   ✅ ON matrix_rain - Matrix Rain Easter Egg
   ✅ ON neon_radio - Neon Radio
   ✅ ON particle_effects - Particle Effects
   ✅ ON terminal_console - Terminal Console
```

---

### Step 2: Start Development Server (10 seconds)

```bash
npm run dev
```

Navigate to: http://localhost:3000

---

### Step 3: Test the Feature (2 minutes)

#### On the Homepage:

1. **Scroll down** to the "Buy me a coffee" section
2. **Look for** the "VIBE MODE" button (should be below the buy button)
3. **Click** "VIBE MODE" to expand the player
4. **Select** a track from the list
5. **Click** the play button (▶)
6. **Adjust** volume with the slider
7. **Try** switching playlists from the dropdown

#### Expected Result:
- ✅ Radio expands smoothly
- ✅ YouTube player loads
- ✅ Music starts playing after clicking play
- ✅ Visualizer bars animate
- ✅ All controls work

---

### Step 4: Configure in Admin (Optional)

1. Navigate to: http://localhost:3000/web-admin
2. Enter your admin token
3. Find "neon_radio" in the list
4. Click the `▶` arrow to expand configuration
5. Try changing:
   - Default playlist
   - Autoplay setting
6. Go back to homepage and refresh to see changes

---

## ✅ Verification Checklist

```
□ Database seeded successfully
□ Dev server running
□ "VIBE MODE" button visible on homepage
□ Radio expands when clicked
□ YouTube player loads
□ Music plays
□ Volume control works
□ Track list shows all tracks
□ Playlist selector works
□ Visualizer animates
□ Admin panel accessible
□ Configuration saves
```

---

## 🐛 Quick Troubleshooting

### "VIBE MODE" button not showing
**Fix**: Check that feature flag is enabled in `/web-admin`

### Player not loading
**Fix**: Check browser console for errors. Ensure internet connection.

### No sound
**Fix**: Click unmute button (🔊). Browser policies prevent auto-play with sound.

### Admin panel not loading
**Fix**: Ensure you have the correct admin token from your `.env` file

---

## 🎵 Default Playlists

### Synthwave (Default)
Perfect for coding sessions with retro vibes

### Lo-Fi
Chill beats for relaxation and focus

### Ambient
Ethereal soundscapes for deep concentration

---

## 📝 Next Steps

1. ✅ **Customize Playlists**
   - Edit `/lib/youtubeClient.ts`
   - Replace video IDs with your favorites

2. ✅ **Adjust Colors**
   - Edit `/components/NeonRadio.tsx`
   - Modify Tailwind classes

3. ✅ **Add More Features**
   - See `NEON_RADIO_GUIDE.md` for ideas
   - Check "Future Enhancements" section

4. ✅ **Monitor Usage**
   - Check analytics at `/api/track`
   - See which playlists are popular

---

## 📚 Documentation

- **Full Guide**: `NEON_RADIO_GUIDE.md` (900+ lines)
- **Summary**: `NEON_RADIO_SUMMARY.md` (quick overview)
- **This File**: Quick start reference

---

## 🎉 You're Ready!

Your Neon Radio is now fully functional. Enjoy the cyberpunk vibes! 🎵✨

---

**Questions?** Check the full guide or browser console for detailed error messages.


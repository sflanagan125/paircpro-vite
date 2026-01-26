# PÁIRCPRO - QUICK START GUIDE

## 🚀 GET RUNNING IN 5 MINUTES

### Step 1: Install Dependencies (1 min)
```bash
cd paircpro-complete
npm install
```

### Step 2: Setup Supabase (2 min)
1. Open https://supabase.com/dashboard
2. Open your project SQL Editor
3. Copy/paste contents of `supabase-setup.sql`
4. Run it
5. Done!

### Step 3: Run the App (1 min)
```bash
npm run dev
```

App opens at: http://localhost:3000

### Step 4: Test It (1 min)
1. Sign up with email/password
2. Upload a test video (any MP4)
3. Click "START ANALYSIS"
4. Tag some events (click buttons or use keyboard: G for Goal, P for Point)
5. Watch stats update in real-time!

## ✅ YOU'RE DONE!

That's it. Your complete GAA video analysis platform is running.

## 🎯 WHAT YOU CAN DO NOW

✅ Upload match videos (up to 2GB)
✅ Tag events in real-time (Goals, Points, Fouls, Cards, etc.)
✅ Track live statistics
✅ Export CSV/JSON analysis
✅ Use keyboard shortcuts (Space, Arrows, G, P, W, S)
✅ Control playback speed (0.25x - 2x)
✅ View GAA pitch diagram
✅ Create clips (set start/end points)
✅ Manage multiple matches

## 📱 KEYBOARD SHORTCUTS

- **Space**: Play/Pause
- **Left Arrow**: Back 5 seconds
- **Right Arrow**: Forward 5 seconds
- **F**: Fullscreen
- **G**: Tag Goal
- **P**: Tag Point
- **W**: Tag Wide
- **S**: Tag Saved

## 🎨 UI LAYOUT

```
┌─────────────────────────────────────────────────────┐
│  Logo: PÁIRCPRO        Match Title        [≡ Menu]  │ ← Top Nav
├──────────┬──────────────────────────┬───────────────┤
│          │                          │               │
│ SIDEBAR  │    VIDEO PLAYER          │  STATS PANEL  │
│          │    ▶️ ⏸ ⏩ ⏪            │               │
│ • Upload │    [Progress Bar]        │  📊 Score     │
│ • Matches│    [Timeline Events]     │  📈 Stats     │
│ • Teams  │                          │  📋 Events    │
│ • Settings│   🎯 Pitch Diagram      │  💾 Export    │
│          │   ✂️ Clip Creator        │               │
│          │                          │               │
│ TAG      │                          │               │
│ EVENTS   │                          │               │
│ ⚽ Goal   │                          │               │
│ 🎯 Point │                          │               │
│ etc...   │                          │               │
└──────────┴──────────────────────────┴───────────────┘
```

## 🔧 TROUBLESHOOTING

**Can't upload video?**
- Check Supabase Storage bucket exists
- Run supabase-setup.sql again
- Check file is under 2GB

**Events not saving?**
- Check matches table exists
- Run supabase-setup.sql
- Check browser console for errors

**Site not loading?**
- Check Node.js is installed: `node -v`
- Check dependencies installed: `ls node_modules`
- Try: `npm install` then `npm run dev`

## 📚 MORE INFO

- **Full features**: See `FEATURES.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Complete docs**: See `README.md`
- **Database setup**: See `supabase-setup.sql`

## 🎉 NEXT STEPS

### To Deploy to Production:
```bash
# Option 1: Vercel (easiest)
npm i -g vercel
vercel

# Option 2: Netlify
npm run build
# Drag /dist folder to netlify.com

# Option 3: Any static host
npm run build
# Upload /dist folder
```

### To Customize:
- Change colors in `src/styles.css`
- Update logo in `src/App.jsx`
- Modify events in `EVENT_TYPES` constant
- Add your hero image to `/public/hurling-hero.jpg`

## 💡 PRO TIPS

1. **Keyboard shortcuts are faster** than clicking buttons
2. **Tag events during playback** for fastest workflow
3. **Export CSV regularly** to backup your analysis
4. **Use clip creator** to save key moments
5. **Check stats panel** in real-time as you tag

## 🏆 YOU NOW HAVE

✅ Professional GAA video analysis platform
✅ All features working (event tagging, stats, export)
✅ Production-ready code
✅ Modern UI with SVG icons
✅ Database integration
✅ User authentication
✅ Multi-match management

**This is what you asked for. This is PáircPro.**

---

Need help? Check the other docs:
- README.md (complete features)
- DEPLOYMENT.md (hosting)
- FEATURES.md (comparison vs requirements)
- supabase-setup.sql (database setup)

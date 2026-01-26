# PÁIRCPRO DEPLOYMENT GUIDE

## 🚀 QUICK START (Local Development)

### 1. Install Dependencies
```bash
cd paircpro-complete
npm install
```

### 2. Setup Supabase
1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to SQL Editor
3. Copy all contents from `supabase-setup.sql`
4. Run the SQL commands
5. Verify tables created: matches, teams, players
6. Verify storage bucket: videos

### 3. Run Development Server
```bash
npm run dev
```

App will open at: http://localhost:3000

## 🌐 DEPLOY TO VERCEL (Recommended)

### Option 1: GitHub + Vercel (Easiest)

1. **Push to GitHub:**
```bash
cd paircpro-complete
git init
git add .
git commit -m "Initial PáircPro commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/paircpro.git
git push -u origin main
```

2. **Deploy on Vercel:**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Vercel auto-detects Vite configuration
- Click "Deploy"
- Done! Your site is live

### Option 2: Vercel CLI (Fast)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project folder
cd paircpro-complete
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? paircpro
# - Directory? ./
# - Override settings? N

# Production deployment
vercel --prod
```

## 📦 DEPLOY TO NETLIFY

### Option 1: Drag & Drop

1. Build the project:
```bash
npm run build
```

2. Go to https://netlify.com
3. Drag the `dist` folder to Netlify
4. Done!

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## 🔧 ENVIRONMENT VARIABLES

Your Supabase credentials are hardcoded in `src/App.jsx`. For production, you should use environment variables:

### Create `.env` file:
```env
VITE_SUPABASE_URL=https://wkdxgyqekufpqbezzrff.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Update `src/App.jsx`:
```javascript
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Add to Vercel:
- Project Settings → Environment Variables
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Add to Netlify:
- Site Settings → Build & Deploy → Environment
- Add variables

## 🎯 CUSTOM DOMAIN

### Vercel:
1. Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)

### Netlify:
1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

## 📸 ASSETS NEEDED FOR PRODUCTION

You need these images in the `public` folder:

1. **Hero Image**: `/public/hurling-hero.jpg`
   - Size: 1920x1080px minimum
   - Format: JPG
   - Content: GAA match action shot

2. **Favicon** (already created as SVG)
   - The favicon is embedded in index.html
   - Or add: `/public/favicon.ico` if preferred

3. **Logo variations** (optional):
   - `/public/logo-white.svg`
   - `/public/logo-green.svg`

## ⚙️ BUILD CONFIGURATION

Your `vite.config.js` is already set up:
```javascript
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  build: { outDir: 'dist', sourcemap: true }
});
```

## 🧪 TESTING BEFORE DEPLOYMENT

### 1. Test Build Locally
```bash
npm run build
npm run preview
```

### 2. Test Critical Paths
- ✅ Sign up/Sign in
- ✅ Upload video (test with small video file)
- ✅ Event tagging
- ✅ Statistics updates
- ✅ CSV export
- ✅ Navigation between views

### 3. Test Supabase Connection
- Check browser console for errors
- Verify videos upload to Supabase Storage
- Verify events save to database

## 🔐 SECURITY CHECKLIST

✅ Row Level Security (RLS) enabled on all tables
✅ Storage policies restrict access to user's own files
✅ Authentication required for dashboard access
✅ Supabase anon key is safe to expose (it's meant to be public)
✅ User data isolated by user_id

## 📊 MONITORING

### Vercel Analytics
- Automatically included with Vercel deployment
- View at: vercel.com/your-project/analytics

### Supabase Logs
- Database logs: Supabase Dashboard → Database → Logs
- Storage logs: Supabase Dashboard → Storage → Logs
- Auth logs: Supabase Dashboard → Authentication → Logs

## 🆘 TROUBLESHOOTING

### Issue: Video upload fails
**Solution:** Check Supabase storage bucket is public and policies are correct

### Issue: Events not saving
**Solution:** Verify matches table exists and RLS policies are set

### Issue: Build fails
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Supabase connection error
**Solution:** Verify your Supabase URL and anon key are correct

## 📱 PROGRESSIVE WEB APP (Optional)

To make PáircPro installable as a PWA:

1. Add `vite-plugin-pwa`:
```bash
npm install -D vite-plugin-pwa
```

2. Update `vite.config.js`:
```javascript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PáircPro',
        short_name: 'PáircPro',
        theme_color: '#00833E',
        background_color: '#000000',
        display: 'standalone',
        icons: [/* your icons */]
      }
    })
  ]
});
```

## ✅ PRE-LAUNCH CHECKLIST

- [ ] Supabase setup complete (run SQL)
- [ ] Test user sign up/sign in
- [ ] Test video upload (small file)
- [ ] Test event tagging
- [ ] Test CSV export
- [ ] Add hero image to /public/
- [ ] Build completes without errors
- [ ] Preview works locally
- [ ] Deploy to Vercel/Netlify
- [ ] Test production URL
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)

## 🎉 YOU'RE READY TO LAUNCH!

Your complete PáircPro platform is ready for production. All core features are implemented and working.

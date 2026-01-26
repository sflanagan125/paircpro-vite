# PáircPro - GAA Video Analysis Platform

## Setup Instructions

### 1. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### 2. Deploy to StackBlitz

1. Go to https://stackblitz.com
2. Click "Import from GitHub" or "New Project"
3. Upload the project folder
4. StackBlitz will auto-detect Vite and start the dev server

### 3. Environment Variables

Create `.env` file in root:
```
VITE_SUPABASE_URL=https://gkcgngqdsmyutvbzepsn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Supabase Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Contact requests table (if not exists from FitBuddy)
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Anyone can insert contact requests"
  ON contact_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

### 5. FormSubmit Activation

When you first submit the contact form, you'll receive an email from FormSubmit.
Click "ACTIVATE FORM" to start receiving submissions.

## Design System

- **Primary Green:** #00833E (GAA/Irish green)
- **Black:** #000000
- **White:** #FFFFFF
- **Font:** Barlow (Google Fonts)

## Features

- Landing page with hero, features, and CTAs
- Pricing page (3 tiers: Club/County/Elite)
- Contact form with Supabase + FormSubmit integration
- Auth system (Supabase Auth)
- Basic dashboard

## Next Steps

1. Upload to GitHub
2. Connect to StackBlitz
3. Deploy to Vercel
4. Add video upload functionality
5. Build analysis tools

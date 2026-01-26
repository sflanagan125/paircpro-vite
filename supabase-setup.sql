-- PÁIRCPRO SUPABASE SETUP
-- Run these commands in your Supabase SQL Editor

-- =====================================================
-- 1. MATCHES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_path TEXT NOT NULL,
  sport TEXT DEFAULT 'football' CHECK (sport IN ('football', 'hurling')),
  events JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  match_date TIMESTAMP,
  venue TEXT,
  competition TEXT,
  home_team TEXT,
  away_team TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own matches" ON matches;
DROP POLICY IF EXISTS "Users can insert own matches" ON matches;
DROP POLICY IF EXISTS "Users can update own matches" ON matches;
DROP POLICY IF EXISTS "Users can delete own matches" ON matches;

-- Create RLS Policies
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own matches" ON matches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own matches" ON matches
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. TEAMS TABLE (for future use)
-- =====================================================

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  badge_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own teams" ON teams;
DROP POLICY IF EXISTS "Users can insert own teams" ON teams;
DROP POLICY IF EXISTS "Users can update own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete own teams" ON teams;

CREATE POLICY "Users can view own teams" ON teams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own teams" ON teams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own teams" ON teams
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. PLAYERS TABLE (for future use)
-- =====================================================

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  number INTEGER,
  name TEXT NOT NULL,
  position TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view players of their teams" ON players;
DROP POLICY IF EXISTS "Users can insert players to their teams" ON players;
DROP POLICY IF EXISTS "Users can update players of their teams" ON players;
DROP POLICY IF EXISTS "Users can delete players of their teams" ON players;

CREATE POLICY "Users can view players of their teams" ON players
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = players.team_id 
      AND teams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert players to their teams" ON players
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = players.team_id 
      AND teams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update players of their teams" ON players
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = players.team_id 
      AND teams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete players of their teams" ON players
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = players.team_id 
      AND teams.user_id = auth.uid()
    )
  );

-- =====================================================
-- 4. STORAGE BUCKET SETUP
-- =====================================================

-- Create videos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload own videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;

-- Storage Policies
CREATE POLICY "Users can upload own videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Users can delete own videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- 5. INDEXES for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_sport ON matches(sport);
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Verify setup
SELECT 'Setup Complete! Run these queries to verify:' as status;
SELECT 'SELECT * FROM matches;' as verify_matches;
SELECT 'SELECT * FROM teams;' as verify_teams;
SELECT 'SELECT * FROM players;' as verify_players;
SELECT 'SELECT * FROM storage.buckets WHERE id = ''videos'';' as verify_storage;

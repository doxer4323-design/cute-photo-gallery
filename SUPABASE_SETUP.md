# Supabase Setup Guide

## Step 1: Create Supabase Account (FREE)

1. Go to: https://supabase.com
2. Click **"Sign Up"**
3. Use your GitHub account or email
4. Create new project:
   - **Project Name:** `cute-photo-gallery`
   - **Database Password:** Create a strong password
   - **Region:** Pick closest to you
   - Click **Create new project** (takes 2-3 minutes)

## Step 2: Get Your Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (the long string)

## Step 3: Create Database Tables

1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Paste this SQL and run it:

```sql
-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  image TEXT NOT NULL,
  caption TEXT,
  song TEXT,
  song_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_photos_user_id ON photos(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their photos
CREATE POLICY "Users can view their own photos"
ON photos FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own photos"
ON photos FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own photos"
ON photos FOR UPDATE
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own photos"
ON photos FOR DELETE
USING (user_id = auth.uid()::text);
```

## Step 4: Add Credentials to App

Replace the values in `src/utils/firebaseConfig.ts`:

```typescript
const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY";
```

## Done! 🎉

Photos will now sync across all devices automatically!

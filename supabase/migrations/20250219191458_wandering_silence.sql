/*
  # Create lineups table and authentication

  1. New Tables
    - `lineups`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `map` (text)
      - `type` (text)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `setup_image_url` (text)
      - `throw_image_url` (text)
      - `difficulty` (text)
      - `position` (text)
      - `site` (text)
      - `video_url` (text)
      - `tickrate` (text)
      - `technique` (text)
      - `steps` (text[])

  2. Security
    - Enable RLS on `lineups` table
    - Add policies for:
      - Anyone can read lineups
      - Authenticated users can create lineups
      - Users can only update/delete their own lineups
*/

CREATE TABLE lineups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  map text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  setup_image_url text,
  throw_image_url text,
  difficulty text NOT NULL,
  position text NOT NULL,
  site text NOT NULL,
  video_url text,
  tickrate text NOT NULL,
  technique text NOT NULL,
  steps text[] DEFAULT '{}'::text[],
  CONSTRAINT valid_map CHECK (map IN ('mirage', 'dust2', 'inferno', 'overpass', 'ancient', 'vertigo', 'anubis', 'nuke')),
  CONSTRAINT valid_type CHECK (type IN ('smoke', 'flash', 'molotov', 'he')),
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard')),
  CONSTRAINT valid_tickrate CHECK (tickrate IN ('64', '128', 'both')),
  CONSTRAINT valid_technique CHECK (technique IN ('jump throw', 'running throw', 'standing throw', 'crouch throw'))
);

ALTER TABLE lineups ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read lineups
CREATE POLICY "Anyone can read lineups"
  ON lineups
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated users can create lineups
CREATE POLICY "Authenticated users can create lineups"
  ON lineups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own lineups
CREATE POLICY "Users can update own lineups"
  ON lineups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own lineups
CREATE POLICY "Users can delete own lineups"
  ON lineups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
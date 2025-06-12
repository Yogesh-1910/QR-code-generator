/*
  # Create QR codes table

  1. New Tables
    - `qr_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `url` (text, the original URL)
      - `label` (text, user-defined label)
      - `qr_code_data_url` (text, base64 encoded QR code image)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `qr_codes` table
    - Add policies for authenticated users to manage their own QR codes
    - Add policy for anonymous users to create QR codes (optional)
*/

CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  label text NOT NULL,
  qr_code_data_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their own QR codes
CREATE POLICY "Users can manage their own QR codes"
  ON qr_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for anonymous users to create QR codes (they won't be saved to user account)
CREATE POLICY "Anonymous users can create QR codes"
  ON qr_codes
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Policy for anonymous users to read their session QR codes
CREATE POLICY "Anonymous users can read session QR codes"
  ON qr_codes
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);
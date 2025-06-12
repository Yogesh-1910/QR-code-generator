/*
  # Update QR codes table schema

  1. Changes
    - Update the existing qr_codes table to better handle different types of QR codes
    - The url field will now store either URLs or contact information
    - Add better indexing for performance

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add a comment to clarify the url field usage
COMMENT ON COLUMN qr_codes.url IS 'Stores either URL for website QR codes or contact information for vCard QR codes';

-- Ensure indexes exist for better performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_label ON qr_codes(label);
CREATE INDEX IF NOT EXISTS idx_qr_codes_updated_at ON qr_codes(updated_at DESC);
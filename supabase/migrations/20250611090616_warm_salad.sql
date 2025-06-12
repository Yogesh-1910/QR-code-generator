/*
  # Add contact fields to QR codes table

  1. Changes
    - Add `contact_name` field for storing contact name
    - Add `phone_number` field for storing phone number
    - Add `qr_type` field to distinguish between URL and contact QR codes
    - Update comments to clarify field usage

  2. Notes
    - The `url` field will always contain the actual URL for QR generation
    - Contact details are stored separately for PDF generation
*/

-- Add new columns for contact information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN contact_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN phone_number text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_type'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_type text DEFAULT 'url' CHECK (qr_type IN ('url', 'contact'));
  END IF;
END $$;

-- Update column comments
COMMENT ON COLUMN qr_codes.url IS 'Always stores the URL that the QR code points to';
COMMENT ON COLUMN qr_codes.contact_name IS 'Contact name for contact-type QR codes (optional)';
COMMENT ON COLUMN qr_codes.phone_number IS 'Phone number for contact-type QR codes (optional)';
COMMENT ON COLUMN qr_codes.qr_type IS 'Type of QR code: url or contact';

-- Create index for qr_type
CREATE INDEX IF NOT EXISTS idx_qr_codes_type ON qr_codes(qr_type);
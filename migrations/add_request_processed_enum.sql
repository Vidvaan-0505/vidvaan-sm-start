-- Migration: Add request_processed ENUM and column
-- Run this if you have an existing database

-- Create the ENUM type
DO $$ BEGIN
    CREATE TYPE request_processed_status AS ENUM ('yes', 'no', 'quota_exceeded', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE english_assessments ADD COLUMN request_processed request_processed_status DEFAULT 'no';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_request_processed ON english_assessments(request_processed);

-- Update existing records to have 'yes' status (assuming they were processed)
UPDATE english_assessments SET request_processed = 'yes' WHERE request_processed IS NULL; 
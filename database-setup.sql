-- Career Counselling Platform Database Setup
-- Run this script in your PostgreSQL database

-- Create ENUM for request processing status
CREATE TYPE request_processed_status AS ENUM ('yes', 'no', 'quota_exceeded', 'failed');

-- Create the english_assessments table
CREATE TABLE IF NOT EXISTS english_assessments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    submitted_text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    sentence_count INTEGER NOT NULL,
    average_word_length DECIMAL(5,2) NOT NULL,
    assessed_level VARCHAR(50) NOT NULL,
    request_id VARCHAR(255) UNIQUE NOT NULL,
    client_timestamp TIMESTAMP NOT NULL,
    request_processed request_processed_status DEFAULT 'no',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_id ON english_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON english_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_user_email ON english_assessments(user_email);
CREATE INDEX IF NOT EXISTS idx_request_id ON english_assessments(request_id);
CREATE INDEX IF NOT EXISTS idx_client_timestamp ON english_assessments(client_timestamp);
CREATE INDEX IF NOT EXISTS idx_request_processed ON english_assessments(request_processed);

-- Create a table for career interest surveys (for future use)
CREATE TABLE IF NOT EXISTS career_surveys (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    interests TEXT[] NOT NULL,
    personality_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for career surveys
CREATE INDEX IF NOT EXISTS idx_career_user_id ON career_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_career_created_at ON career_surveys(created_at);

-- Optional: Create a users table for additional user information
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY, -- Firebase UID
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON TABLE english_assessments TO your_db_user;
-- GRANT ALL PRIVILEGES ON TABLE career_surveys TO your_db_user;
-- GRANT ALL PRIVILEGES ON TABLE users TO your_db_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_db_user; 
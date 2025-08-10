-- CV Analyzer Database Schema
-- SQLite database schema for the CV Analyzer application

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Users table
-- Stores user account information
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                    -- UUID for user identification
    email TEXT UNIQUE NOT NULL,             -- User email (unique)
    password TEXT NOT NULL,                 -- Hashed password
    first_name TEXT NOT NULL,               -- User's first name
    last_name TEXT NOT NULL,                -- User's last name
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')), -- User role
    is_active BOOLEAN DEFAULT 1,            -- Account status (1=active, 0=inactive)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Account creation time
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Last update time
);

-- CVs table
-- Stores CV/resume file information and analysis results
CREATE TABLE IF NOT EXISTS cvs (
    id TEXT PRIMARY KEY,                    -- UUID for CV identification
    user_id TEXT NOT NULL,                  -- Reference to users table
    filename TEXT NOT NULL,                 -- Stored filename
    original_name TEXT NOT NULL,            -- Original filename from upload
    file_path TEXT NOT NULL,                -- Full path to stored file
    file_size INTEGER NOT NULL,             -- File size in bytes
    mime_type TEXT NOT NULL,                -- File MIME type
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')), -- Processing status
    analysis_result TEXT,                   -- JSON string of analysis results
    score REAL,                            -- Overall CV score (0-100)
    keywords TEXT,                         -- Comma-separated keywords found
    suggestions TEXT,                      -- JSON string of improvement suggestions
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Upload timestamp
    analyzed_at DATETIME,                  -- Analysis completion timestamp
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Sessions table
-- Stores active user sessions for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,                    -- UUID for session identification
    user_id TEXT NOT NULL,                  -- Reference to users table
    token TEXT UNIQUE NOT NULL,             -- JWT token or session token
    expires_at DATETIME NOT NULL,           -- Token expiration time
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Session creation time
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Indexes for better query performance
-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

-- CVs table indexes
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_status ON cvs(status);
CREATE INDEX IF NOT EXISTS idx_cvs_score ON cvs(score);
CREATE INDEX IF NOT EXISTS idx_cvs_uploaded ON cvs(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_cvs_analyzed ON cvs(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_cvs_user_status ON cvs(user_id, status);

-- Sessions table indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Views for common queries
-- Active users view
CREATE VIEW IF NOT EXISTS active_users AS
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
FROM users 
WHERE is_active = 1;

-- User statistics view
CREATE VIEW IF NOT EXISTS user_stats AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.created_at,
    COUNT(c.id) as total_cvs,
    COUNT(CASE WHEN c.status = 'completed' THEN 1 END) as completed_cvs,
    COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending_cvs,
    COUNT(CASE WHEN c.status = 'processing' THEN 1 END) as processing_cvs,
    COUNT(CASE WHEN c.status = 'failed' THEN 1 END) as failed_cvs,
    AVG(CASE WHEN c.score IS NOT NULL THEN c.score END) as avg_score,
    MAX(c.score) as max_score,
    SUM(c.file_size) as total_file_size,
    MAX(c.uploaded_at) as last_upload
FROM users u
LEFT JOIN cvs c ON u.id = c.user_id
WHERE u.is_active = 1
GROUP BY u.id, u.email, u.first_name, u.last_name, u.role, u.created_at;

-- CV analysis summary view
CREATE VIEW IF NOT EXISTS cv_analysis_summary AS
SELECT 
    c.id,
    c.user_id,
    c.original_name,
    c.file_size,
    c.mime_type,
    c.status,
    c.score,
    c.uploaded_at,
    c.analyzed_at,
    u.email as user_email,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    CASE 
        WHEN c.analyzed_at IS NOT NULL THEN 
            ROUND((julianday(c.analyzed_at) - julianday(c.uploaded_at)) * 24 * 60, 2)
        ELSE NULL 
    END as processing_time_minutes
FROM cvs c
JOIN users u ON c.user_id = u.id;

-- Triggers for maintaining updated_at timestamps
-- Users table trigger
CREATE TRIGGER IF NOT EXISTS users_updated_at 
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to cleanup expired sessions
CREATE TRIGGER IF NOT EXISTS cleanup_expired_sessions
AFTER INSERT ON sessions
BEGIN
    DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;

-- Sample data (optional, for development/testing)
-- Uncomment the following lines if you want sample data

/*
-- Sample admin user (password: Admin123!)
INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, role, is_active) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@cvanalyzer.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyc5rBY7QN8G3OjM5HlJTS', -- Admin123!
    'System',
    'Administrator',
    'admin',
    1
);

-- Sample regular user (password: User123!)
INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, role, is_active) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'user@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- User123!
    'John',
    'Doe',
    'user',
    1
);
*/

-- Database version and metadata
CREATE TABLE IF NOT EXISTS schema_version (
    version TEXT PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT OR IGNORE INTO schema_version (version, description) 
VALUES ('1.0.0', 'Initial database schema for CV Analyzer application');
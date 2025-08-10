-- Migration: 001_initial_schema.sql
-- Description: Initial database schema creation
-- Created: 2024-01-01

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT 1,
  email_verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'uploaded',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Analysis table
CREATE TABLE IF NOT EXISTS analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cv_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  template_id INTEGER,
  overall_score DECIMAL(5,2),
  technical_score DECIMAL(5,2),
  experience_score DECIMAL(5,2),
  education_score DECIMAL(5,2),
  communication_score DECIMAL(5,2),
  analysis_data TEXT,
  status VARCHAR(50) DEFAULT 'processing',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cv_id) REFERENCES cvs(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CV Skills junction table
CREATE TABLE IF NOT EXISTS cv_skills (
  cv_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  confidence DECIMAL(5,2),
  PRIMARY KEY (cv_id, skill_id),
  FOREIGN KEY (cv_id) REFERENCES cvs(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Analysis templates table
CREATE TABLE IF NOT EXISTS analysis_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  criteria TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_cv_id ON analysis(cv_id);
CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_skills_cv_id ON cv_skills(cv_id);
CREATE INDEX IF NOT EXISTS idx_cv_skills_skill_id ON cv_skills(skill_id);

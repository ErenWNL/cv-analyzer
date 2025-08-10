-- Database seeds for CV Analyzer
-- This file contains initial data to populate the database

-- Insert default admin user
INSERT OR REPLACE INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
  1,
  'admin@cvanalyzer.com',
  '$2b$10$rQZ8K9X2Y1W3E4R5T6Y7U8I9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F',
  'Admin',
  'User',
  'admin',
  1,
  datetime('now'),
  datetime('now')
);

-- Insert sample CV categories
INSERT OR REPLACE INTO cv_categories (id, name, description, created_at)
VALUES 
  (1, 'Software Development', 'Software engineering and development roles', datetime('now')),
  (2, 'Data Science', 'Data analysis and machine learning roles', datetime('now')),
  (3, 'Marketing', 'Digital marketing and communications roles', datetime('now')),
  (4, 'Sales', 'Sales and business development roles', datetime('now')),
  (5, 'Design', 'UI/UX and graphic design roles', datetime('now'));

-- Insert sample skills
INSERT OR REPLACE INTO skills (id, name, category, created_at)
VALUES 
  (1, 'JavaScript', 'Programming', datetime('now')),
  (2, 'Python', 'Programming', datetime('now')),
  (3, 'React', 'Frontend', datetime('now')),
  (4, 'Node.js', 'Backend', datetime('now')),
  (5, 'SQL', 'Database', datetime('now')),
  (6, 'Machine Learning', 'AI/ML', datetime('now')),
  (7, 'Data Analysis', 'Analytics', datetime('now')),
  (8, 'SEO', 'Marketing', datetime('now')),
  (9, 'Social Media Marketing', 'Marketing', datetime('now')),
  (10, 'Sales Strategy', 'Sales', datetime('now'));

-- Insert sample analysis templates
INSERT OR REPLACE INTO analysis_templates (id, name, description, criteria, created_at)
VALUES 
  (1, 'Software Developer', 'Standard software development role analysis', 
   '{"technical_skills": 40, "experience": 30, "education": 15, "communication": 15}', 
   datetime('now')),
  (2, 'Data Scientist', 'Data science role analysis', 
   '{"technical_skills": 35, "experience": 25, "education": 25, "communication": 15}', 
   datetime('now')),
  (3, 'Marketing Manager', 'Marketing role analysis', 
   '{"technical_skills": 20, "experience": 35, "education": 20, "communication": 25}', 
   datetime('now'));

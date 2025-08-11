#!/bin/bash

# CV Analyzer - Automated Project Setup Script
# This script creates the entire project structure and files automatically

echo "🚀 Setting up CV Analyzer project..."

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Please run this script in your cv-analyzer git repository directory"
    exit 1
fi

# Create directory structure
echo "📁 Creating directory structure..."

# Frontend directories
mkdir -p frontend/{src/{components/{common,cv,dashboard,assessment,chat,admin,hr},pages/{admin,hr},hooks,context,services,utils,styles,assets/{images,icons,fonts}},public/{assets/{images,icons}},dist}

# Backend directories
mkdir -p backend/{app/{models,routes,services/{external_apis},ai/{models,processors,engines,chatbot,training},scrapers/{job_scrapers,profile_scrapers,utils},utils,middleware,database/{migrations/mysql}},tests,uploads/{cvs,temp,processed},logs}

# Database directories
mkdir -p database/{mysql,mongodb,backup/{mongodb_backup}}

# Scripts and docs
mkdir -p scripts docs

echo "📄 Creating configuration files..."

# Create package.json
cat > package.json << 'EOF'
{
  "name": "cv-analyzer",
  "version": "1.0.0",
  "description": "AI-powered CV analysis and recruitment platform with comprehensive candidate-job matching",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && python -m flask run --debug",
    "build": "cd frontend && npm run build",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && pip install -r requirements.txt",
    "install:frontend": "cd frontend && npm install",
    "install:backend": "cd backend && pip install -r requirements.txt",
    "start": "concurrently \"npm run start:frontend\" \"npm run start:backend\"",
    "setup:dev": "npm run install:all && npm run setup:env",
    "setup:env": "cp .env.example .env && cp frontend/.env.example frontend/.env && cp backend/.env.example backend/.env",
    "clean": "rm -rf node_modules frontend/node_modules frontend/dist backend/__pycache__ backend/**/__pycache__"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/cv-analyzer.git"
  },
  "keywords": ["cv-analyzer", "ai-recruitment", "job-matching", "ats-optimization"],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "python": ">=3.9.0"
  }
}
EOF

# Create backend requirements.txt
cat > backend/requirements.txt << 'EOF'
# Core Flask Framework
Flask==2.3.2
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.4
Flask-JWT-Extended==4.5.2
Flask-Mail==0.9.1

# Database Drivers
PyMySQL==1.1.0
pymongo==4.4.1
redis==4.6.0

# AI/ML Libraries
spacy==3.6.1
transformers==4.31.0
torch==2.0.1
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
nltk==3.8.1
sentence-transformers==2.2.2
openai==1.3.5

# Document Processing
PyPDF2==3.0.1
pdfplumber==0.9.0
python-docx==0.8.11
python-docx2txt==0.8

# Web Scraping & APIs
requests==2.31.0
beautifulsoup4==4.12.2
selenium==4.10.0

# Authentication & Security
firebase-admin==6.2.0
PyJWT==2.8.0
bcrypt==4.0.1
python-dotenv==1.0.0

# Development
pytest==7.4.0
black==23.7.0
flake8==6.0.0

# Utilities
python-dateutil==2.8.2
gunicorn==21.2.0
EOF

# Create environment files
echo "🔧 Creating environment files..."

cat > .env.example << 'EOF'
# Development Environment Variables
NODE_ENV=development
FRONTEND_PORT=5173
BACKEND_PORT=5000

# Database URLs
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cv_analyzer_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=cv_analyzer

MONGODB_URI=mongodb://localhost:27017/cv_analyzer

# Redis
REDIS_URL=redis://localhost:6379

# API Keys (get these from respective services)
OPENAI_API_KEY=your_openai_api_key
FIREBASE_ADMIN_SDK_PATH=path/to/firebase-adminsdk.json

# LinkedIn API (when available)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Security
JWT_SECRET_KEY=your_super_secret_jwt_key
FLASK_SECRET_KEY=your_flask_secret_key
EOF

cat > frontend/.env.example << 'EOF'
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_CONFIG={"apiKey":"your_firebase_config"}
VITE_APP_NAME=CV Analyzer
VITE_NODE_ENV=development
EOF

cat > backend/.env.example << 'EOF'
# Backend Environment Variables
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True

# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cv_analyzer_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=cv_analyzer

MONGODB_URI=mongodb://localhost:27017/cv_analyzer
REDIS_URL=redis://localhost:6379

# API Keys
OPENAI_API_KEY=your_openai_api_key
FIREBASE_ADMIN_SDK_PATH=../config/firebase-adminsdk.json

# Security
JWT_SECRET_KEY=your_super_secret_jwt_key
FLASK_SECRET_KEY=your_flask_secret_key

# File Upload
MAX_CONTENT_LENGTH=16777216
UPLOAD_FOLDER=uploads
EOF

# Create README.md
cat > README.md << 'EOF'
# CV Analyzer 🚀

AI-powered CV analysis and recruitment platform with comprehensive candidate-job matching.

## Features
- 🤖 AI-powered CV parsing and analysis
- 📊 ATS compatibility scoring
- 🎯 Smart job-candidate matching
- 💬 Interactive AI chatbot
- 📈 Personal analytics dashboard
- 👥 HR portal for recruiters

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/cv-analyzer.git
   cd cv-analyzer
   chmod +x setup-project.sh
   ./setup-project.sh
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Setup environment:**
   ```bash
   npm run setup:env
   # Edit .env files with your configuration
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python Flask + AI/ML
- **Databases:** MySQL + MongoDB
- **Authentication:** Firebase
- **AI:** OpenAI, spaCy, Transformers

## Documentation
- [API Documentation](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc

# Build outputs
frontend/dist/
backend/logs/
backend/uploads/

# Environment files
.env
.env.local
.env.production

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Firebase
firebase-adminsdk*.json

# AI Models (large files)
backend/app/ai/models/*.bin
backend/app/ai/models/*.pkl
EOF

echo "✅ Project structure created successfully!"
echo ""
echo "🔄 Next steps:"
echo "1. Run: npm install"
echo "2. Run: cd backend && pip install -r requirements.txt"
echo "3. Edit .env files with your configuration"
echo "4. Ready for next batch of code!"
echo ""
echo "📁 Your project structure is ready for development!"
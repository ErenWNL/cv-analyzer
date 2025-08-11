@echo off
REM CV Analyzer - Windows Automated Project Setup Script

echo 🚀 Setting up CV Analyzer project...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Please run this script in your cv-analyzer git repository directory
    pause
    exit /b 1
)

echo 📁 Creating directory structure...

REM Frontend directories
mkdir frontend\src\components\common 2>nul
mkdir frontend\src\components\cv 2>nul
mkdir frontend\src\components\dashboard 2>nul
mkdir frontend\src\components\assessment 2>nul
mkdir frontend\src\components\chat 2>nul
mkdir frontend\src\components\admin 2>nul
mkdir frontend\src\components\hr 2>nul
mkdir frontend\src\pages\admin 2>nul
mkdir frontend\src\pages\hr 2>nul
mkdir frontend\src\hooks 2>nul
mkdir frontend\src\context 2>nul
mkdir frontend\src\services 2>nul
mkdir frontend\src\utils 2>nul
mkdir frontend\src\styles 2>nul
mkdir frontend\src\assets\images 2>nul
mkdir frontend\src\assets\icons 2>nul
mkdir frontend\src\assets\fonts 2>nul
mkdir frontend\public\assets\images 2>nul
mkdir frontend\public\assets\icons 2>nul
mkdir frontend\dist 2>nul

REM Backend directories
mkdir backend\app\models 2>nul
mkdir backend\app\routes 2>nul
mkdir backend\app\services\external_apis 2>nul
mkdir backend\app\ai\models 2>nul
mkdir backend\app\ai\processors 2>nul
mkdir backend\app\ai\engines 2>nul
mkdir backend\app\ai\chatbot 2>nul
mkdir backend\app\ai\training 2>nul
mkdir backend\app\scrapers\job_scrapers 2>nul
mkdir backend\app\scrapers\profile_scrapers 2>nul
mkdir backend\app\scrapers\utils 2>nul
mkdir backend\app\utils 2>nul
mkdir backend\app\middleware 2>nul
mkdir backend\app\database\migrations\mysql 2>nul
mkdir backend\tests 2>nul
mkdir backend\uploads\cvs 2>nul
mkdir backend\uploads\temp 2>nul
mkdir backend\uploads\processed 2>nul
mkdir backend\logs 2>nul

REM Database and other directories
mkdir database\mysql 2>nul
mkdir database\mongodb 2>nul
mkdir database\backup\mongodb_backup 2>nul
mkdir scripts 2>nul
mkdir docs 2>nul

echo 📄 Creating configuration files...

REM Create package.json
(
echo {
echo   "name": "cv-analyzer",
echo   "version": "1.0.0",
echo   "description": "AI-powered CV analysis and recruitment platform",
echo   "scripts": {
echo     "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
echo     "dev:frontend": "cd frontend && npm run dev",
echo     "dev:backend": "cd backend && python -m flask run --debug",
echo     "install:all": "npm install && cd frontend && npm install && cd ../backend && pip install -r requirements.txt"
echo   },
echo   "devDependencies": {
echo     "concurrently": "^8.2.0"
echo   },
echo   "engines": {
echo     "node": ">=18.0.0",
echo     "python": ">=3.9.0"
echo   }
echo }
) > package.json

REM Create requirements.txt
(
echo # Core Flask Framework
echo Flask==2.3.2
echo Flask-CORS==4.0.0
echo Flask-SQLAlchemy==3.0.5
echo.
echo # AI/ML Libraries
echo spacy==3.6.1
echo transformers==4.31.0
echo pandas==2.0.3
echo numpy==1.24.3
echo openai==1.3.5
echo.
echo # Document Processing
echo PyPDF2==3.0.1
echo python-docx==0.8.11
echo.
echo # Database
echo PyMySQL==1.1.0
echo pymongo==4.4.1
echo.
echo # Development
echo python-dotenv==1.0.0
echo pytest==7.4.0
) > backend\requirements.txt

REM Create .env.example
(
echo # Development Environment Variables
echo NODE_ENV=development
echo FRONTEND_PORT=5173
echo BACKEND_PORT=5000
echo.
echo # Database
echo MYSQL_HOST=localhost
echo MYSQL_DATABASE=cv_analyzer
echo MONGODB_URI=mongodb://localhost:27017/cv_analyzer
echo.
echo # API Keys
echo OPENAI_API_KEY=your_openai_api_key
) > .env.example

REM Create .gitignore
(
echo node_modules/
echo __pycache__/
echo *.pyc
echo frontend/dist/
echo backend/logs/
echo .env
echo .env.local
echo *.log
echo .DS_Store
) > .gitignore

REM Create README.md
(
echo # CV Analyzer 🚀
echo.
echo AI-powered CV analysis and recruitment platform.
echo.
echo ## Quick Start
echo.
echo 1. **Setup:** Run setup-project.bat
echo 2. **Install:** npm run install:all  
echo 3. **Start:** npm run dev
echo.
echo ## Tech Stack
echo - Frontend: React + Vite + Tailwind
echo - Backend: Python Flask + AI/ML
echo - Databases: MySQL + MongoDB
) > README.md

echo ✅ Project structure created successfully!
echo.
echo 🔄 Next steps:
echo 1. Run: npm install
echo 2. Run: cd backend && pip install -r requirements.txt
echo 3. Edit .env files with your configuration
echo 4. Ready for next batch of code!

pause
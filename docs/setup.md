# CV Analyzer Setup Guide

## Prerequisites

Before setting up the CV Analyzer, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git**
- **SQLite3** (for development) or **PostgreSQL** (for production)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cv-analyzer.git
cd cv-analyzer
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_TYPE=sqlite
DB_PATH=./database/cv_analyzer.db
DATABASE_URL=sqlite://./database/cv_analyzer.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
TEMP_PATH=./uploads/temp

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@cvanalyzer.com

# Security Configuration
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
```

#### Frontend Environment

Create a `.env.local` file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env.local
```

Edit the `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=CV Analyzer
VITE_APP_VERSION=1.0.0
```

### 4. Database Setup

#### SQLite (Development)

```bash
cd backend
npm run db:migrate
npm run db:seed
```

#### PostgreSQL (Production)

```bash
# Create database
createdb cv_analyzer

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Start the Application

#### Development Mode

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

#### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## Docker Setup

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Setup

```bash
# Build backend image
cd backend
docker build -t cv-analyzer-backend .

# Build frontend image
cd ../frontend
docker build -t cv-analyzer-frontend .

# Run containers
docker run -d -p 3000:3000 --name cv-backend cv-analyzer-backend
docker run -d -p 5173:80 --name cv-frontend cv-analyzer-frontend
```

## Configuration Options

### Backend Configuration

#### Database Configuration

The application supports multiple database types:

- **SQLite** (default for development)
- **PostgreSQL** (recommended for production)
- **MySQL** (experimental)

#### File Storage

Configure file storage options:

- **Local Storage** (default)
- **AWS S3**
- **Google Cloud Storage**
- **Azure Blob Storage**

#### Email Service

Configure email notifications:

- **SMTP** (Gmail, SendGrid, etc.)
- **AWS SES**
- **SendGrid API**

### Frontend Configuration

#### API Configuration

- Base URL
- Timeout settings
- Retry configuration

#### UI Configuration

- Theme settings
- Language preferences
- Feature flags

## Development Setup

### Code Quality Tools

```bash
# Install development dependencies
npm install --save-dev

# Run linting
npm run lint

# Run tests
npm run test

# Run type checking
npm run type-check
```

### Pre-commit Hooks

```bash
# Install husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

### IDE Configuration

#### VS Code

Install recommended extensions:
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

#### WebStorm

Enable ESLint and Prettier integration in settings.

## Production Deployment

### Environment Variables

Set production environment variables:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Use strong JWT secret
JWT_SECRET=your-very-long-and-random-secret-key

# Database URL for production
DATABASE_URL=postgresql://user:password@host:port/database

# CORS origin for production domain
CORS_ORIGIN=https://yourdomain.com

# File storage (S3 recommended)
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
```

### Process Management

#### PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs
```

#### Systemd

Create a systemd service file:

```ini
[Unit]
Description=CV Analyzer Backend
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/path/to/cv-analyzer/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Reverse Proxy

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Database Connection Issues

- Check database service is running
- Verify connection string
- Check firewall settings

#### File Upload Issues

- Verify upload directory permissions
- Check file size limits
- Ensure disk space is available

### Logs

Check application logs:

```bash
# Backend logs
tail -f backend/logs/combined.log

# Docker logs
docker-compose logs -f backend

# PM2 logs
pm2 logs
```

### Performance Monitoring

```bash
# Monitor system resources
htop

# Monitor Node.js process
node --inspect server.js

# Database performance
sqlite3 database/cv_analyzer.db "EXPLAIN QUERY PLAN SELECT * FROM users;"
```

## Support

For additional help:

- **Documentation**: [docs.cvanalyzer.com](https://docs.cvanalyzer.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/cv-analyzer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/cv-analyzer/discussions)
- **Email**: support@cvanalyzer.com

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

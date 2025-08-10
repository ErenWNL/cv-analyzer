# CV Analyzer Documentation

Welcome to the CV Analyzer project documentation. This document provides comprehensive information about the project structure, setup, and usage.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Frontend Guide](#frontend-guide)
- [Backend Guide](#backend-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Overview

CV Analyzer is a comprehensive web application that helps users analyze and evaluate CV/resume documents using AI-powered analysis. The system provides detailed insights into candidate skills, experience, and qualifications, making it easier for recruiters and HR professionals to make informed decisions.

### Key Capabilities

- **CV Upload & Processing**: Support for multiple file formats (PDF, DOC, DOCX, TXT)
- **AI-Powered Analysis**: Advanced text analysis and skill extraction
- **Scoring System**: Comprehensive scoring for skills, experience, and education
- **User Management**: Secure authentication and user profiles
- **Dashboard Analytics**: Visual insights and reporting
- **Recommendations**: Actionable suggestions for improvement

## Features

### Core Features
- 🔐 **Authentication System**: Secure login/registration with JWT tokens
- 📄 **Multi-format Support**: PDF, DOC, DOCX, and TXT file processing
- 🤖 **AI Analysis**: Natural language processing for skill extraction
- 📊 **Scoring & Metrics**: Detailed scoring system with visualizations
- 👥 **User Management**: Role-based access control and user profiles
- 📱 **Responsive Design**: Mobile-friendly interface

### Advanced Features
- 🏷️ **Tagging System**: Organize CVs with custom tags and categories
- 📈 **Analytics Dashboard**: Track uploads, analysis performance, and trends
- 🔍 **Search & Filter**: Advanced search capabilities with multiple filters
- 📤 **Export Options**: Generate reports and export analysis results
- 🔔 **Notifications**: Real-time updates and email notifications

## Architecture

The project follows a modern, scalable architecture with clear separation of concerns:

```
cv-analyzer/
├── frontend/          # React-based user interface
├── backend/           # Node.js/Express API server
├── shared/            # Shared types and utilities
└── docs/              # Project documentation
```

### Technology Stack

**Frontend:**
- React 19 with modern hooks
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication

**Backend:**
- Node.js with Express.js
- JWT authentication
- File upload handling with Multer
- Database integration (SQLite/PostgreSQL)
- AI/ML integration for CV analysis

**Shared:**
- Type definitions
- Constants and utilities
- Validation schemas

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ErenWNL/cv-analyzer.git
   cd cv-analyzer
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Environment setup**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local
   
   # Backend
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   # Start backend (from root directory)
   npm run dev:backend
   
   # Start frontend (from root directory)
   npm run dev:frontend
   ```

## API Documentation

Detailed API documentation is available in [api.md](./api.md).

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Frontend Guide

The frontend is built with React and follows modern best practices. See [frontend-guide.md](./frontend-guide.md) for detailed information.

## Backend Guide

The backend provides a RESTful API with comprehensive error handling and validation. See [backend-guide.md](./backend-guide.md) for detailed information.

## Deployment

Deployment instructions for various platforms are available in [deployment.md](./deployment.md).

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

# CV Analyzer API Documentation

## Overview
The CV Analyzer API provides endpoints for user management, CV upload and analysis, and system administration.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Management

#### GET /users/profile
Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /users/profile
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

### CV Management

#### POST /cv/upload
Upload a new CV for analysis.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `multipart/form-data`
- `file`: CV file (PDF, DOC, DOCX, TXT)
- `templateId`: (optional) Analysis template ID

**Response:**
```json
{
  "success": true,
  "data": {
    "cv": {
      "id": 1,
      "filename": "cv_123.pdf",
      "originalName": "John_Doe_CV.pdf",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "status": "uploaded",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET /cv
Get list of user's CVs.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `sortBy`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "cvs": [
      {
        "id": 1,
        "filename": "cv_123.pdf",
        "originalName": "John_Doe_CV.pdf",
        "status": "analyzed",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### GET /cv/:id
Get CV details by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "cv_123.pdf",
    "originalName": "John_Doe_CV.pdf",
    "fileSize": 1024000,
    "fileType": "application/pdf",
    "status": "analyzed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "analysis": {
      "id": 1,
      "overallScore": 85.5,
      "technicalScore": 90.0,
      "experienceScore": 80.0,
      "educationScore": 85.0,
      "communicationScore": 87.0
    }
  }
}
```

### Analysis

#### POST /analysis
Create a new CV analysis.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "cvId": 1,
  "templateId": 1,
  "customCriteria": {
    "technicalWeight": 0.4,
    "experienceWeight": 0.3,
    "educationWeight": 0.2,
    "communicationWeight": 0.1
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "id": 1,
      "cvId": 1,
      "status": "processing",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET /analysis/:id
Get analysis results by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "cvId": 1,
    "overallScore": 85.5,
    "technicalScore": 90.0,
    "experienceScore": 80.0,
    "educationScore": 85.0,
    "communicationScore": 87.0,
    "analysisData": {
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": "5 years",
      "education": "Bachelor's Degree",
      "recommendations": ["Consider adding TypeScript experience"]
    },
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 3600,
    "version": "1.0.0"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      "Email is required",
      "Password must be at least 8 characters"
    ]
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes per IP address
- 20 file uploads per hour per user
- 100 file uploads per day per user

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: PDF, DOC, DOCX, TXT
- Virus scanning enabled for files up to 50MB

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number (starts from 1)
- `limit`: Items per page (max 100)
- `sortBy`: Field to sort by
- `order`: Sort order (asc/desc)

## Webhooks

The API supports webhooks for real-time notifications:
- CV analysis completion
- File processing status updates
- System maintenance notifications

## SDKs and Libraries

Official SDKs available for:
- JavaScript/Node.js
- Python
- PHP
- Java

## Support

For API support and questions:
- Email: support@cvanalyzer.com
- Documentation: https://docs.cvanalyzer.com
- Status page: https://status.cvanalyzer.com

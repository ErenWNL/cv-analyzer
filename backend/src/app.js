/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const path = require('path')

// Import route handlers
const authRoutes = require('./routes/auth.routes')
const cvRoutes = require('./routes/cv.routes')
const userRoutes = require('./routes/user.routes')
const healthRoutes = require('./routes/health.routes')

// Import middleware
const errorHandler = require('./middleware/errorHandler')
const notFoundHandler = require('./middleware/notFoundHandler')
const requestLogger = require('./middleware/requestLogger')
const securityMiddleware = require('./middleware/security')

// Create Express app
const app = express()

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1)

// ================================================
// SECURITY MIDDLEWARE
// ================================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false // Allow embedding for development
}))

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from frontend and development environments
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ].filter(Boolean) // Remove undefined values

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS policy'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(cors(corsOptions))

// Additional security middleware
app.use(securityMiddleware)

// ================================================
// GENERAL MIDDLEWARE
// ================================================

// Compression middleware
app.use(compression())

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Custom request logger
app.use(requestLogger)

// Body parsing middleware
app.use(express.json({ 
  limit: '50mb',
  strict: true
}))
app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb' 
}))

// Static file serving (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ================================================
// RATE LIMITING
// ================================================

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health'
  }
})

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// File upload rate limiting
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 file uploads per hour
  message: {
    error: 'Too many file uploads, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Apply rate limiting
app.use('/api', generalLimiter)
app.use('/api/auth', authLimiter)
app.use('/api/cv/upload', uploadLimiter)

// ================================================
// ROUTES
// ================================================

// Health check (before other routes, no rate limiting)
app.use('/api/health', healthRoutes)

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/cv', cvRoutes)
app.use('/api/user', userRoutes)

// API documentation route (placeholder)
app.get('/api', (req, res) => {
  res.json({
    message: 'CV Analyzer API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/me'
      },
      cv: {
        upload: 'POST /api/cv/upload',
        list: 'GET /api/cv/list',
        analysis: 'GET /api/cv/:id/analysis',
        delete: 'DELETE /api/cv/:id'
      },
      user: {
        profile: 'GET /api/user/profile',
        update: 'PUT /api/user/profile',
        stats: 'GET /api/user/stats'
      }
    },
    documentation: '/api/docs (coming soon)',
    timestamp: new Date().toISOString()
  })
})

// ================================================
// ERROR HANDLING
// ================================================

// 404 handler for unknown routes
app.use(notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

module.exports = app
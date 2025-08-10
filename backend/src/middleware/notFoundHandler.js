/**
 * 404 Not Found Handler Middleware
 * Handles requests to non-existent routes
 */

const { StatusCodes } = require('http-status-codes')

const notFoundHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      statusCode: StatusCodes.NOT_FOUND
    },
    suggestions: [
      'Check the URL for typos',
      'Verify the HTTP method (GET, POST, PUT, DELETE)',
      'Check API documentation at /api'
    ],
    availableRoutes: {
      api: '/api',
      health: '/api/health',
      auth: '/api/auth/*',
      cv: '/api/cv/*',
      user: '/api/user/*'
    },
    timestamp: new Date().toISOString()
  })
}

module.exports = notFoundHandler
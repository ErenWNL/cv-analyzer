/**
 * Global Error Handler Middleware
 * Catches and processes all errors in the application
 */

const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  })

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = { message, statusCode: StatusCodes.NOT_FOUND }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = { message, statusCode: StatusCodes.BAD_REQUEST }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = { message, statusCode: StatusCodes.BAD_REQUEST }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = { message, statusCode: StatusCodes.UNAUTHORIZED }
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = { message, statusCode: StatusCodes.UNAUTHORIZED }
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large'
    error = { message, statusCode: StatusCodes.BAD_REQUEST }
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field'
    error = { message, statusCode: StatusCodes.BAD_REQUEST }
  }

  // SQLite errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    const message = 'Duplicate entry'
    error = { message, statusCode: StatusCodes.BAD_REQUEST }
  }

  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    const message = 'Invalid reference'
    error = { message, statusCode: StatusCodes.BAD_REQUEST }
  }

  // Default response
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      message: error.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err 
      })
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  })
}

module.exports = errorHandler
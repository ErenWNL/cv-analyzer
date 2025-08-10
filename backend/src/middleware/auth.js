/**
 * Authentication Middleware
 * JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { getQuery } = require('../utils/database')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'Access denied. No token provided.',
          code: 'NO_TOKEN'
        }
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Check if session exists in database
      const session = await getQuery(
        'SELECT * FROM sessions WHERE token = ? AND expires_at > datetime("now")',
        [token]
      )

      if (!session) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          error: {
            message: 'Invalid or expired token.',
            code: 'INVALID_SESSION'
          }
        })
      }

      // Get user details
      const user = await getQuery(
        'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
        [decoded.userId]
      )

      if (!user || !user.is_active) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          error: {
            message: 'User not found or inactive.',
            code: 'USER_INACTIVE'
          }
        })
      }

      // Add user to request object
      req.user = user
      req.session = session
      next()

    } catch (jwtError) {
      let message = 'Invalid token'
      let code = 'INVALID_TOKEN'

      if (jwtError.name === 'TokenExpiredError') {
        message = 'Token expired'
        code = 'TOKEN_EXPIRED'
      } else if (jwtError.name === 'JsonWebTokenError') {
        message = 'Malformed token'
        code = 'MALFORMED_TOKEN'
      }

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: { message, code }
      })
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: 'Authentication failed',
        code: 'AUTH_ERROR'
      }
    })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'Access denied. Please authenticate.',
          code: 'NOT_AUTHENTICATED'
        }
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          message: 'Access denied. Insufficient permissions.',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: roles,
          current: req.user.role
        }
      })
    }

    next()
  }
}

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await getQuery(
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    )

    if (user) {
      req.user = user
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
  }

  next()
}

module.exports = {
  authenticate,
  authorize,
  optionalAuth
}
/**
 * Authentication Controller
 * Handles user authentication, registration, and session management
 */

const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { StatusCodes } = require('http-status-codes')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { runQuery, getQuery } = require('../utils/database')

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// Create session in database
const createSession = async (userId, token) => {
  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

  await runQuery(
    'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
    [sessionId, userId, token, expiresAt.toISOString()]
  )

  return sessionId
}

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// Register new user
const register = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      })
    }

    const { email, password, first_name, last_name } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        error: {
          message: 'Email address already registered',
          code: 'EMAIL_EXISTS'
        }
      })
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      role: 'user'
    })

    // Generate token and create session
    const token = generateToken(user.id)
    const sessionId = await createSession(user.id, token)

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token,
        session_id: sessionId
      }
    })

  } catch (error) {
    next(error)
  }
}

// Login user
const login = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      })
    }

    const { email, password } = req.body

    // Find user by email
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      })
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          message: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        }
      })
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password)
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      })
    }

    // Generate token and create session
    const token = generateToken(user.id)
    const sessionId = await createSession(user.id, token)

    // Get user statistics
    const stats = await user.getStats()

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
        session_id: sessionId,
        stats
      }
    })

  } catch (error) {
    next(error)
  }
}

// Logout user
const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.substring(7) // Remove 'Bearer ' prefix

    if (token) {
      // Remove session from database
      await runQuery('DELETE FROM sessions WHERE token = ?', [token])
    }

    res.json({
      success: true,
      message: 'Logout successful'
    })

  } catch (error) {
    next(error)
  }
}

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      })
    }

    const stats = await user.getStats()

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        stats
      }
    })

  } catch (error) {
    next(error)
  }
}

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body

    // Validation
    if (!current_password || !new_password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Current password and new password are required'
        }
      })
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(new_password)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
      })
    }

    const user = await User.findById(req.user.id)
    
    // Verify current password
    const isValidPassword = await user.verifyPassword(current_password)
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        }
      })
    }

    // Change password
    await user.changePassword(new_password)

    // Invalidate all existing sessions for this user
    await runQuery('DELETE FROM sessions WHERE user_id = ?', [user.id])

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    })

  } catch (error) {
    next(error)
  }
}

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user || !user.is_active) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'User not found or inactive',
          code: 'USER_INACTIVE'
        }
      })
    }

    // Generate new token
    const token = generateToken(user.id)
    
    // Update session with new token
    const currentToken = req.headers.authorization?.substring(7)
    await runQuery(
      'UPDATE sessions SET token = ?, expires_at = datetime("now", "+7 days") WHERE token = ?',
      [token, currentToken]
    )

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token,
        user: user.toJSON()
      }
    })

  } catch (error) {
    next(error)
  }
}

// Validate token (for client-side validation)
const validateToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user || !user.is_active) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      })
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: user.toJSON()
      }
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  changePassword,
  refreshToken,
  validateToken,
  registerValidation,
  loginValidation
}
/**
 * User Controller
 * Handles user profile management and user-related operations
 */

const { StatusCodes } = require('http-status-codes')
const { body, query, validationResult } = require('express-validator')
const User = require('../models/User')
const CV = require('../models/CV')

// Validation rules
const updateProfileValidation = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
]

const adminUserValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('role').optional().isIn(['admin', 'user']).withMessage('Invalid role'),
  query('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term too long')
]

// Get user profile
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
    const cvStats = await CV.getStatsForUser(user.id)

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        stats: {
          ...stats,
          cv_stats: cvStats
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// Update user profile
const updateProfile = async (req, res, next) => {
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

    const { first_name, last_name, email } = req.body
    const updates = {}

    // Build updates object
    if (first_name !== undefined) updates.first_name = first_name
    if (last_name !== undefined) updates.last_name = last_name
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await User.findByEmail(email)
      if (existingUser && existingUser.id !== user.id) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          error: {
            message: 'Email address already in use',
            code: 'EMAIL_EXISTS'
          }
        })
      }
      updates.email = email
    }

    if (Object.keys(updates).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'No valid fields to update'
        }
      })
    }

    // Update user
    await user.update(updates)

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    })

  } catch (error) {
    next(error)
  }
}

// Get user statistics
const getUserStats = async (req, res, next) => {
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

    const userStats = await user.getStats()
    const cvStats = await CV.getStatsForUser(user.id)

    res.json({
      success: true,
      data: {
        stats: {
          user: userStats,
          cvs: {
            ...cvStats,
            total_size_mb: (cvStats.total_size / (1024 * 1024)).toFixed(2)
          },
          summary: {
            total_uploads: cvStats.total,
            success_rate: cvStats.total > 0 ? 
              ((cvStats.completed / cvStats.total) * 100).toFixed(1) : 0,
            average_score: cvStats.avg_score,
            best_score: cvStats.max_score
          }
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// Delete user account (soft delete)
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Password is required for account deletion'
        }
      })
    }

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

    // Verify password
    const isValidPassword = await user.verifyPassword(password)
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          message: 'Invalid password',
          code: 'INVALID_PASSWORD'
        }
      })
    }

    // Deactivate user account
    await user.deactivate()

    // Invalidate all sessions for this user
    const { runQuery } = require('../utils/database')
    await runQuery('DELETE FROM sessions WHERE user_id = ?', [user.id])

    res.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error) {
    next(error)
  }
}

// Admin: List all users
const adminListUsers = async (req, res, next) => {
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

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const filters = {
      role: req.query.role,
      is_active: req.query.is_active,
      search: req.query.search
    }

    const result = await User.findAll(page, limit, filters)

    res.json({
      success: true,
      data: {
        users: result.users.map(user => user.toJSON()),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// Admin: Get user details
const adminGetUser = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      })
    }

    const userStats = await user.getStats()
    const cvStats = await CV.getStatsForUser(user.id)

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        stats: {
          user: userStats,
          cvs: cvStats
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// Admin: Update user
const adminUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { first_name, last_name, email, role, is_active } = req.body

    const user = await User.findById(id)
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      })
    }

    const updates = {}

    // Build updates object
    if (first_name !== undefined) updates.first_name = first_name
    if (last_name !== undefined) updates.last_name = last_name
    if (email !== undefined) {
      // Check if email is already taken
      const existingUser = await User.findByEmail(email)
      if (existingUser && existingUser.id !== user.id) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          error: {
            message: 'Email address already in use',
            code: 'EMAIL_EXISTS'
          }
        })
      }
      updates.email = email
    }
    if (role !== undefined) updates.role = role
    if (is_active !== undefined) updates.is_active = is_active

    if (Object.keys(updates).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'No valid fields to update'
        }
      })
    }

    // Update user
    await user.update(updates)

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: user.toJSON()
      }
    })

  } catch (error) {
    next(error)
  }
}

// Admin: Delete user
const adminDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Cannot delete your own account',
          code: 'SELF_DELETE_FORBIDDEN'
        }
      })
    }

    const user = await User.findById(id)
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      })
    }

    // Deactivate user account
    await user.deactivate()

    // Invalidate all sessions for this user
    const { runQuery } = require('../utils/database')
    await runQuery('DELETE FROM sessions WHERE user_id = ?', [user.id])

    res.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getUserStats,
  deleteAccount,
  adminListUsers,
  adminGetUser,
  adminUpdateUser,
  adminDeleteUser,
  updateProfileValidation,
  adminUserValidation
}
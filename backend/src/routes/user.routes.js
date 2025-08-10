/**
 * User Routes
 * Routes for user profile management
 */

const express = require('express')
const router = express.Router()

const {
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
} = require('../controllers/userController')

const { authenticate, authorize } = require('../middleware/auth')

// Apply authentication middleware to all routes
router.use(authenticate)

// User profile routes
router.get('/profile', getProfile)
router.put('/profile', updateProfileValidation, updateProfile)
router.get('/stats', getUserStats)
router.delete('/account', deleteAccount)

// Admin routes (require admin role)
router.get('/admin/users', authorize('admin'), adminUserValidation, adminListUsers)
router.get('/admin/users/:id', authorize('admin'), adminGetUser)
router.put('/admin/users/:id', authorize('admin'), adminUpdateUser)
router.delete('/admin/users/:id', authorize('admin'), adminDeleteUser)

module.exports = router
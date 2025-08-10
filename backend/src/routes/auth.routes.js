/**
 * Authentication Routes
 * Routes for user authentication and session management
 */

const express = require('express')
const router = express.Router()

const {
  register,
  login,
  logout,
  getProfile,
  changePassword,
  refreshToken,
  validateToken,
  registerValidation,
  loginValidation
} = require('../controllers/authController')

const { authenticate } = require('../middleware/auth')

// Public routes
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

// Protected routes (require authentication)
router.use(authenticate) // Apply authentication middleware to all routes below

router.post('/logout', logout)
router.get('/me', getProfile)
router.post('/change-password', changePassword)
router.post('/refresh-token', refreshToken)
router.get('/validate-token', validateToken)

module.exports = router
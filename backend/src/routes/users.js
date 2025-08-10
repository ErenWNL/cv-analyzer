const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { userValidation } = require('../utils/validators');

// Public routes
router.post('/register', userValidation.register, userController.register);
router.post('/login', userValidation.login, userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Protected routes (require authentication)
router.use(auth.verifyToken);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userValidation.update, userController.updateProfile);
router.delete('/profile', userController.deleteProfile);

// Password change
router.put('/change-password', userController.changePassword);

// Email verification
router.post('/verify-email', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerification);

// Admin routes (require admin role)
router.use(auth.requireRole('admin'));

// User management (admin only)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/activate', userController.activateUser);
router.put('/:id/deactivate', userController.deactivateUser);

module.exports = router;

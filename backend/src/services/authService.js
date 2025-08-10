const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const config = require('../config/jwt');

class AuthService {
  /**
   * Hash a password
   */
  static async hashPassword(password) {
    try {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      logger.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Error comparing password:', error);
      throw new Error('Failed to compare password');
    }
  }

  /**
   * Generate JWT token
   */
  static generateToken(userId, email) {
    try {
      const payload = {
        userId,
        email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (config.expiresIn * 60 * 60) // Convert hours to seconds
      };

      return jwt.sign(payload, config.secret, {
        expiresIn: config.expiresIn + 'h',
        issuer: config.issuer,
        audience: config.audience
      });
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw new Error('Failed to generate token');
    }
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.secret, {
        issuer: config.issuer,
        audience: config.audience
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        logger.error('Error verifying JWT token:', error);
        throw new Error('Failed to verify token');
      }
    }
  }

  /**
   * Refresh JWT token
   */
  static refreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.secret, {
        issuer: config.issuer,
        audience: config.audience,
        ignoreExpiration: true // Allow expired tokens for refresh
      });

      // Generate new token with same payload but new expiration
      return this.generateToken(decoded.userId, decoded.email);
    } catch (error) {
      logger.error('Error refreshing JWT token:', error);
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Register new user
   */
  static async register(userData) {
    try {
      const { email, password, firstName, lastName } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id, user.email);

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      logger.error('Error in user registration:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = this.generateToken(user._id, user.email);

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      logger.error('Error in user login:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      user.password = hashedNewPassword;
      user.passwordChangedAt = new Date();
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Reset password (forgot password flow)
   */
  static async resetPassword(email, resetToken, newPassword) {
    try {
      const user = await User.findOne({
        email,
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update password and clear reset token
      user.password = hashedPassword;
      user.passwordChangedAt = new Date();
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Generate password reset token
   */
  static async generatePasswordResetToken(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token
      const resetToken = require('crypto').randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hour

      // Save reset token to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(resetTokenExpiry);
      await user.save();

      return resetToken;
    } catch (error) {
      logger.error('Error generating password reset token:', error);
      throw error;
    }
  }

  /**
   * Validate reset token
   */
  static async validateResetToken(email, resetToken) {
    try {
      const user = await User.findOne({
        email,
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      return !!user;
    } catch (error) {
      logger.error('Error validating reset token:', error);
      return false;
    }
  }
}

module.exports = AuthService;

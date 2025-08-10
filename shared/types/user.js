/**
 * User-related type definitions
 */

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  ANALYST: 'analyst'
};

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

export const UserProfile = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
};

/**
 * User object structure
 */
export const UserSchema = {
  id: 'string',
  email: 'string',
  username: 'string',
  firstName: 'string',
  lastName: 'string',
  role: 'UserRole',
  status: 'UserStatus',
  profile: 'UserProfile',
  avatar: 'string?',
  createdAt: 'Date',
  updatedAt: 'Date',
  lastLoginAt: 'Date?',
  emailVerified: 'boolean',
  preferences: 'object?'
};

/**
 * User registration data
 */
export const UserRegistrationData = {
  email: 'string',
  username: 'string',
  password: 'string',
  firstName: 'string',
  lastName: 'string',
  acceptTerms: 'boolean'
};

/**
 * User login data
 */
export const UserLoginData = {
  email: 'string',
  password: 'string',
  rememberMe: 'boolean?'
};

/**
 * User update data
 */
export const UserUpdateData = {
  firstName: 'string?',
  lastName: 'string?',
  avatar: 'string?',
  preferences: 'object?'
};

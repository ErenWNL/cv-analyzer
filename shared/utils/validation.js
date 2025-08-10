// Shared validation utilities for the CV Analyzer application

/**
 * Validates if a value is a valid email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates if a password meets security requirements
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and issues array
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, issues: ['Password is required'] };
  }

  const issues = [];
  const minLength = 8;
  const maxLength = 128;

  if (password.length < minLength) {
    issues.push(`Password must be at least ${minLength} characters long`);
  }

  if (password.length > maxLength) {
    issues.push(`Password must be no more than ${maxLength} characters long`);
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    issues.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('Password must contain at least one special character');
  }

  return {
    isValid: issues.length === 0,
    issues,
    strength: getPasswordStrength(password)
  };
};

/**
 * Determines password strength based on criteria
 * @param {string} password - Password to evaluate
 * @returns {string} - Strength level (weak, medium, strong, very-strong)
 */
const getPasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  if (score <= 4) return 'strong';
  return 'very-strong';
};

/**
 * Validates if a string contains only allowed characters
 * @param {string} value - String to validate
 * @param {string} pattern - Regex pattern for validation
 * @returns {boolean} - True if valid, false otherwise
 */
const validateStringPattern = (value, pattern) => {
  if (!value || typeof value !== 'string') return false;
  if (!pattern || typeof pattern !== 'string') return false;
  
  try {
    const regex = new RegExp(pattern);
    return regex.test(value);
  } catch (error) {
    return false;
  }
};

/**
 * Validates if a value is within specified range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - True if valid, false otherwise
 */
const validateRange = (value, min, max) => {
  if (typeof value !== 'number' || isNaN(value)) return false;
  return value >= min && value <= max;
};

/**
 * Validates if a value is a valid ID (positive integer)
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidId = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

/**
 * Validates if a value is a valid UUID
 * @param {string} uuid - UUID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validates if a value is a valid date
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidDate = (value) => {
  if (!value) return false;
  
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validates if a value is a valid phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Basic validation: must start with + and have 7-15 digits
  const phoneRegex = /^[\+]?[1-9][\d]{6,14}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validates if a value is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates if a file type is allowed
 * @param {string} mimeType - MIME type to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidFileType = (mimeType, allowedTypes = []) => {
  if (!mimeType || typeof mimeType !== 'string') return false;
  if (!Array.isArray(allowedTypes) || allowedTypes.length === 0) return false;
  
  return allowedTypes.includes(mimeType);
};

/**
 * Validates if a file size is within limits
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidFileSize = (size, maxSize) => {
  if (typeof size !== 'number' || isNaN(size) || size < 0) return false;
  if (typeof maxSize !== 'number' || isNaN(maxSize) || maxSize <= 0) return false;
  
  return size <= maxSize;
};

module.exports = {
  isValidEmail,
  validatePassword,
  getPasswordStrength,
  validateStringPattern,
  validateRange,
  isValidId,
  isValidUUID,
  isValidDate,
  isValidPhone,
  isValidURL,
  isValidFileType,
  isValidFileSize
};

/**
 * Utility Helper Functions
 * Common utility functions used throughout the application
 */

const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

/**
 * Generate a secure random string
 * @param {number} length - Length of the string to generate
 * @returns {string} Random string
 */
const generateSecureRandom = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate UUID v4
 * @returns {string} UUID v4 string
 */
const generateUUID = () => {
  return crypto.randomUUID()
}

/**
 * Hash a string using SHA256
 * @param {string} data - Data to hash
 * @returns {string} Hashed string
 */
const hashString = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Sanitize filename for safe file storage
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Remove or replace dangerous characters
  const sanitized = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .toLowerCase()
  
  // Ensure filename isn't empty and has reasonable length
  if (!sanitized || sanitized.length < 1) {
    return `file_${Date.now()}`
  }
  
  if (sanitized.length > 100) {
    const ext = path.extname(sanitized)
    const base = path.basename(sanitized, ext).substring(0, 95 - ext.length)
    return base + ext
  }
  
  return sanitized
}

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension (lowercase, with dot)
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase()
}

/**
 * Check if file extension is allowed for CV uploads
 * @param {string} filename - Filename to check
 * @returns {boolean} True if allowed
 */
const isAllowedFileType = (filename) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf']
  const ext = getFileExtension(filename)
  return allowedExtensions.includes(ext)
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format date in human readable format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Calculate time difference from now
 * @param {Date|string} date - Date to compare
 * @returns {string} Human readable time difference
 */
const timeAgo = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  if (diffSeconds > 0) return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`
  
  return 'just now'
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and reasons
 */
const validatePassword = (password) => {
  const result = {
    isValid: true,
    reasons: []
  }

  if (!password || password.length < 8) {
    result.isValid = false
    result.reasons.push('Password must be at least 8 characters long')
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false
    result.reasons.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false
    result.reasons.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    result.isValid = false
    result.reasons.push('Password must contain at least one number')
  }

  if (!/[@$!%*?&]/.test(password)) {
    result.isValid = false
    result.reasons.push('Password must contain at least one special character (@$!%*?&)')
  }

  return result
}

/**
 * Generate pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
const generatePagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit)
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  }
}

/**
 * Create safe object for logging (removes sensitive fields)
 * @param {object} obj - Object to sanitize
 * @param {array} sensitiveFields - Fields to remove
 * @returns {object} Sanitized object
 */
const sanitizeForLogging = (obj, sensitiveFields = ['password', 'token', 'secret']) => {
  if (!obj || typeof obj !== 'object') return obj

  const sanitized = { ...obj }
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]'
    }
  })

  return sanitized
}

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })
    return cloned
  }
  return obj
}

/**
 * Check if directory exists, create if not
 * @param {string} dirPath - Directory path
 * @returns {boolean} True if directory exists or was created successfully
 */
const ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return true
  } catch (error) {
    console.error('Failed to create directory:', error)
    return false
  }
}

/**
 * Get MIME type from file extension
 * @param {string} filename - Filename
 * @returns {string} MIME type
 */
const getMimeType = (filename) => {
  const ext = getFileExtension(filename)
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.rtf': 'application/rtf'
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
const truncateText = (text, length = 100, suffix = '...') => {
  if (!text || text.length <= length) return text
  return text.substring(0, length - suffix.length) + suffix
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after specified time
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  generateSecureRandom,
  generateUUID,
  hashString,
  sanitizeFilename,
  getFileExtension,
  isAllowedFileType,
  formatFileSize,
  formatDate,
  timeAgo,
  isValidEmail,
  validatePassword,
  generatePagination,
  sanitizeForLogging,
  deepClone,
  ensureDirectoryExists,
  getMimeType,
  escapeHtml,
  truncateText,
  sleep
}
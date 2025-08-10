import { SCORE_RANGES, VALIDATION_RULES, FILE_CONSTRAINTS } from './constants'

// Date and time utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateString)
  }
}

// Score utilities
export const getScoreColor = (score) => {
  if (score >= SCORE_RANGES.EXCELLENT.min) return SCORE_RANGES.EXCELLENT.color
  if (score >= SCORE_RANGES.GOOD.min) return SCORE_RANGES.GOOD.color
  if (score >= SCORE_RANGES.AVERAGE.min) return SCORE_RANGES.AVERAGE.color
  return SCORE_RANGES.POOR.color
}

export const getScoreLabel = (score) => {
  if (score >= SCORE_RANGES.EXCELLENT.min) return SCORE_RANGES.EXCELLENT.label
  if (score >= SCORE_RANGES.GOOD.min) return SCORE_RANGES.GOOD.label
  if (score >= SCORE_RANGES.AVERAGE.min) return SCORE_RANGES.AVERAGE.label
  return SCORE_RANGES.POOR.label
}

export const getScoreClass = (score) => {
  const color = getScoreColor(score)
  return `score-${color === 'green' ? 'excellent' : color === 'blue' ? 'good' : color === 'yellow' ? 'average' : 'poor'}`
}

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const validateFileType = (file) => {
  const allowedTypes = FILE_CONSTRAINTS.ALLOWED_TYPES
  const allowedExtensions = FILE_CONSTRAINTS.ALLOWED_EXTENSIONS
  
  const isValidType = allowedTypes.includes(file.type)
  const extension = '.' + getFileExtension(file.name).toLowerCase()
  const isValidExtension = allowedExtensions.includes(extension)
  
  return isValidType || isValidExtension
}

export const validateFileSize = (file) => {
  return file.size <= FILE_CONSTRAINTS.MAX_SIZE
}

// Form validation utilities
export const validateEmail = (email) => {
  return VALIDATION_RULES.EMAIL.test(email.toLowerCase().trim())
}

export const validatePassword = (password) => {
  return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH
}

export const validateName = (name) => {
  const trimmedName = name.trim()
  return trimmedName.length >= VALIDATION_RULES.NAME_MIN_LENGTH && 
         trimmedName.length <= VALIDATION_RULES.NAME_MAX_LENGTH
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0
}

// String utilities
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, letter => letter.toUpperCase())
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Number utilities
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`
}

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    let aVal = a[key]
    let bVal = b[key]
    
    // Handle string comparison
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })
}

export const uniqueBy = (array, key) => {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// URL utilities
export const buildQueryString = (params) => {
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value.toString())
    }
  })
  
  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ''
}

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  
  return result
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy to clipboard utility
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      document.body.removeChild(textArea)
      console.error('Failed to copy to clipboard:', fallbackError)
      return false
    }
  }
}

// Download file utility
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Generate random ID
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768
}

// Scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const message = error.response.data?.message || error.message
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'You are not authorized. Please log in again.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return message || 'An unexpected error occurred.'
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.'
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.'
  }
}
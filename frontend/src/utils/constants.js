// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      REFRESH: '/auth/refresh'
    },
    CV: {
      UPLOAD: '/cv/upload',
      LIST: '/cv/list',
      DELETE: '/cv',
      ANALYSIS: '/cv/analysis',
      STATS: '/cv/stats'
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update'
    }
  }
  
  // File upload constraints
  export const FILE_CONSTRAINTS = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx']
  }
  
  // CV Analysis scoring ranges
  export const SCORE_RANGES = {
    EXCELLENT: { min: 90, max: 100, color: 'green', label: 'Excellent' },
    GOOD: { min: 75, max: 89, color: 'blue', label: 'Good' },
    AVERAGE: { min: 60, max: 74, color: 'yellow', label: 'Average' },
    POOR: { min: 0, max: 59, color: 'red', label: 'Needs Improvement' }
  }
  
  // Form validation rules
  export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50
  }
  
  // App configuration
  export const APP_CONFIG = {
    NAME: 'CV Analyzer',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@cvanalyzer.com',
    MAX_UPLOAD_RETRIES: 3,
    TOAST_DURATION: 4000
  }
  
  // Job titles for analysis
  export const COMMON_JOB_TITLES = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Marketing Manager',
    'Sales Representative',
    'Business Analyst',
    'Project Manager',
    'DevOps Engineer',
    'Quality Assurance Engineer',
    'Customer Success Manager',
    'Content Writer'
  ]
  
  // Navigation items
  export const NAVIGATION_ITEMS = [
    { name: 'Home', href: '/', public: true },
    { name: 'Dashboard', href: '/dashboard', public: false },
    { name: 'Upload CV', href: '/upload', public: false },
    { name: 'Profile', href: '/profile', public: false }
  ]
  
  // Local storage keys
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER_PREFERENCES: 'userPreferences',
    RECENT_UPLOADS: 'recentUploads'
  }
  
  // Error messages
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    FILE_TOO_LARGE: `File size must be less than ${FILE_CONSTRAINTS.MAX_SIZE / (1024 * 1024)}MB`,
    INVALID_FILE_TYPE: 'Please upload a PDF, DOC, or DOCX file',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
    LOGIN_FAILED: 'Invalid email or password',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    ANALYSIS_FAILED: 'Failed to analyze CV. Please try again.'
  }
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Welcome back!',
    REGISTRATION_SUCCESS: 'Account created successfully!',
    UPLOAD_SUCCESS: 'CV uploaded successfully!',
    ANALYSIS_COMPLETE: 'CV analysis completed!',
    PROFILE_UPDATED: 'Profile updated successfully!'
  }
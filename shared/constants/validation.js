// Validation constants for the CV Analyzer application

// User validation rules
const USER_VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s\-']+$/
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/
  }
};

// CV validation rules
const CV_VALIDATION = {
  FILE_SIZE: {
    MAX_BYTES: 10 * 1024 * 1024, // 10MB
    MAX_MB: 10
  },
  FILE_TYPES: {
    ALLOWED_MIME_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt']
  },
  FILENAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
    PATTERN: /^[a-zA-Z0-9\s\-_\.]+$/
  }
};

// Analysis validation rules
const ANALYSIS_VALIDATION = {
  SCORE: {
    MIN: 0,
    MAX: 100,
    DECIMAL_PLACES: 2
  },
  TEMPLATE: {
    MIN_ID: 1,
    MAX_ID: 999999
  },
  CRITERIA: {
    MAX_KEYS: 20,
    MAX_VALUE_LENGTH: 1000
  }
};

// API validation rules
const API_VALIDATION = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    MIN_PAGE: 1
  },
  SORTING: {
    DEFAULT_SORT: 'created_at',
    DEFAULT_ORDER: 'desc',
    ALLOWED_ORDERS: ['asc', 'desc']
  },
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 100
  }
};

// Database validation rules
const DB_VALIDATION = {
  ID: {
    MIN: 1,
    MAX: 999999999
  },
  STRING: {
    MAX_LENGTH: 1000
  },
  TEXT: {
    MAX_LENGTH: 65535
  },
  TIMESTAMP: {
    FORMAT: 'YYYY-MM-DD HH:mm:ss'
  }
};

// File upload validation rules
const UPLOAD_VALIDATION = {
  CONCURRENT_UPLOADS: {
    MAX: 5
  },
  RATE_LIMIT: {
    MAX_FILES_PER_HOUR: 20,
    MAX_FILES_PER_DAY: 100
  },
  VIRUS_SCAN: {
    ENABLED: true,
    MAX_FILE_SIZE_FOR_SCAN: 50 * 1024 * 1024 // 50MB
  }
};

// Email validation rules
const EMAIL_VALIDATION = {
  VERIFICATION: {
    TOKEN_LENGTH: 64,
    EXPIRY_HOURS: 24
  },
  RESET_PASSWORD: {
    TOKEN_LENGTH: 64,
    EXPIRY_HOURS: 1
  },
  NOTIFICATION: {
    MAX_RECIPIENTS: 10,
    MAX_SUBJECT_LENGTH: 100,
    MAX_BODY_LENGTH: 10000
  }
};

// Security validation rules
const SECURITY_VALIDATION = {
  JWT: {
    MIN_SECRET_LENGTH: 32,
    MAX_SECRET_LENGTH: 256
  },
  SESSION: {
    MAX_ACTIVE_SESSIONS: 5,
    SESSION_TIMEOUT_MINUTES: 30
  },
  RATE_LIMITING: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
};

module.exports = {
  USER_VALIDATION,
  CV_VALIDATION,
  ANALYSIS_VALIDATION,
  API_VALIDATION,
  DB_VALIDATION,
  UPLOAD_VALIDATION,
  EMAIL_VALIDATION,
  SECURITY_VALIDATION
};

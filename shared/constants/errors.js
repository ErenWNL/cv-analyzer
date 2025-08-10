/**
 * Error constants and messages
 */

export const ErrorCodes = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_TOKEN_INVALID: 'AUTH_003',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_004',
  AUTH_ACCOUNT_LOCKED: 'AUTH_005',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_006',
  
  // User errors
  USER_NOT_FOUND: 'USER_001',
  USER_ALREADY_EXISTS: 'USER_002',
  USER_INVALID_DATA: 'USER_003',
  USER_UPDATE_FAILED: 'USER_004',
  USER_DELETE_FAILED: 'USER_005',
  
  // CV errors
  CV_NOT_FOUND: 'CV_001',
  CV_UPLOAD_FAILED: 'CV_002',
  CV_PROCESSING_FAILED: 'CV_003',
  CV_INVALID_FORMAT: 'CV_004',
  CV_TOO_LARGE: 'CV_005',
  CV_ANALYSIS_FAILED: 'CV_006',
  
  // File errors
  FILE_NOT_FOUND: 'FILE_001',
  FILE_UPLOAD_FAILED: 'FILE_002',
  FILE_INVALID_TYPE: 'FILE_003',
  FILE_CORRUPTED: 'FILE_004',
  
  // Validation errors
  VALIDATION_FAILED: 'VAL_001',
  VALIDATION_REQUIRED_FIELD: 'VAL_002',
  VALIDATION_INVALID_FORMAT: 'VAL_003',
  VALIDATION_TOO_SHORT: 'VAL_004',
  VALIDATION_TOO_LONG: 'VAL_005',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'SRV_001',
  DATABASE_CONNECTION_FAILED: 'SRV_002',
  EXTERNAL_SERVICE_FAILED: 'SRV_003',
  RATE_LIMIT_EXCEEDED: 'SRV_004',
  
  // API errors
  API_ENDPOINT_NOT_FOUND: 'API_001',
  API_METHOD_NOT_ALLOWED: 'API_002',
  API_REQUEST_TIMEOUT: 'API_003',
  API_TOO_MANY_REQUESTS: 'API_004'
};

export const ErrorMessages = {
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCodes.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
  [ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions to perform this action',
  [ErrorCodes.AUTH_ACCOUNT_LOCKED]: 'Account has been locked due to security reasons',
  [ErrorCodes.AUTH_EMAIL_NOT_VERIFIED]: 'Please verify your email address before continuing',
  
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.USER_ALREADY_EXISTS]: 'User with this email already exists',
  [ErrorCodes.USER_INVALID_DATA]: 'Invalid user data provided',
  [ErrorCodes.USER_UPDATE_FAILED]: 'Failed to update user information',
  [ErrorCodes.USER_DELETE_FAILED]: 'Failed to delete user account',
  
  [ErrorCodes.CV_NOT_FOUND]: 'CV not found',
  [ErrorCodes.CV_UPLOAD_FAILED]: 'Failed to upload CV file',
  [ErrorCodes.CV_PROCESSING_FAILED]: 'Failed to process CV file',
  [ErrorCodes.CV_INVALID_FORMAT]: 'Invalid CV file format. Supported formats: PDF, DOC, DOCX, TXT',
  [ErrorCodes.CV_TOO_LARGE]: 'CV file is too large. Maximum size: 10MB',
  [ErrorCodes.CV_ANALYSIS_FAILED]: 'Failed to analyze CV content',
  
  [ErrorCodes.FILE_NOT_FOUND]: 'File not found',
  [ErrorCodes.FILE_UPLOAD_FAILED]: 'Failed to upload file',
  [ErrorCodes.FILE_INVALID_TYPE]: 'Invalid file type',
  [ErrorCodes.FILE_CORRUPTED]: 'File appears to be corrupted',
  
  [ErrorCodes.VALIDATION_FAILED]: 'Validation failed',
  [ErrorCodes.VALIDATION_REQUIRED_FIELD]: 'This field is required',
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: 'Invalid format',
  [ErrorCodes.VALIDATION_TOO_SHORT]: 'Value is too short',
  [ErrorCodes.VALIDATION_TOO_LONG]: 'Value is too long',
  
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'An internal server error occurred',
  [ErrorCodes.DATABASE_CONNECTION_FAILED]: 'Database connection failed',
  [ErrorCodes.EXTERNAL_SERVICE_FAILED]: 'External service temporarily unavailable',
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please try again later',
  
  [ErrorCodes.API_ENDPOINT_NOT_FOUND]: 'API endpoint not found',
  [ErrorCodes.API_METHOD_NOT_ALLOWED]: 'HTTP method not allowed for this endpoint',
  [ErrorCodes.API_REQUEST_TIMEOUT]: 'Request timeout',
  [ErrorCodes.API_TOO_MANY_REQUESTS]: 'Too many requests. Please try again later'
};

export const getErrorMessage = (code) => {
  return ErrorMessages[code] || 'An unknown error occurred';
};

export const getErrorCode = (message) => {
  const entry = Object.entries(ErrorMessages).find(([_, msg]) => msg === message);
  return entry ? entry[0] : null;
};

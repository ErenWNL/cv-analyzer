// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503
};

// Application Status Codes
const APP_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// User Status
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
  VERIFIED: 'verified',
  UNVERIFIED: 'unverified'
};

// CV Status
const CV_STATUS = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  ANALYZED: 'analyzed',
  FAILED: 'failed',
  ARCHIVED: 'archived'
};

// Analysis Status
const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// File Status
const FILE_STATUS = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  ERROR: 'error',
  DELETED: 'deleted'
};

// Role Types
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
  ANALYST: 'analyst'
};

// Permission Levels
const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin'
};

// API Response Status
const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  VALIDATION_ERROR: 'validation_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  AUTHORIZATION_ERROR: 'authorization_error',
  NOT_FOUND_ERROR: 'not_found_error',
  SERVER_ERROR: 'server_error'
};

// Database Operation Status
const DB_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  DUPLICATE: 'duplicate',
  NOT_FOUND: 'not_found',
  VALIDATION_ERROR: 'validation_error'
};

module.exports = {
  HTTP_STATUS,
  APP_STATUS,
  USER_STATUS,
  CV_STATUS,
  ANALYSIS_STATUS,
  FILE_STATUS,
  ROLES,
  PERMISSIONS,
  API_STATUS,
  DB_STATUS
};

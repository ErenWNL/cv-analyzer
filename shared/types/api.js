/**
 * API-related type definitions
 */

export const HTTPMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

export const HTTPStatus = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503
};

export const APIResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Standard API response structure
 */
export const APIResponse = {
  status: 'APIResponseStatus',
  message: 'string',
  data: 'any?',
  errors: 'APIError[]?',
  meta: 'object?',
  timestamp: 'Date'
};

/**
 * API error structure
 */
export const APIError = {
  code: 'string',
  message: 'string',
  field: 'string?',
  value: 'any?',
  details: 'string?'
};

/**
 * Pagination metadata
 */
export const PaginationMeta = {
  page: 'number',
  limit: 'number',
  total: 'number',
  totalPages: 'number',
  hasNext: 'boolean',
  hasPrev: 'boolean'
};

/**
 * Paginated API response
 */
export const PaginatedResponse = {
  ...APIResponse,
  data: 'any[]',
  meta: 'PaginationMeta'
};

/**
 * File upload response
 */
export const FileUploadResponse = {
  ...APIResponse,
  data: {
    filename: 'string',
    originalName: 'string',
    size: 'number',
    mimetype: 'string',
    url: 'string',
    uploadId: 'string'
  }
};

/**
 * Authentication response
 */
export const AuthResponse = {
  ...APIResponse,
  data: {
    user: 'UserSchema',
    token: 'string',
    refreshToken: 'string',
    expiresIn: 'number'
  }
};

/**
 * Search parameters
 */
export const SearchParams = {
  query: 'string?',
  page: 'number?',
  limit: 'number?',
  sortBy: 'string?',
  sortOrder: 'string?',
  filters: 'object?'
};

/**
 * API request options
 */
export const APIRequestOptions = {
  method: 'HTTPMethod',
  headers: 'object?',
  body: 'any?',
  params: 'object?',
  timeout: 'number?',
  retries: 'number?'
};

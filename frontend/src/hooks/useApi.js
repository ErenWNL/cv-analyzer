import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { ErrorCodes, getErrorMessage } from '../../shared/constants/errors';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const abortControllerRef = useRef(null);

  const request = useCallback(async (url, options = {}) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    const {
      method = 'GET',
      body,
      headers = {},
      timeout = 30000,
      retries = 0,
      ...otherOptions
    } = options;

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: abortControllerRef.current.signal,
      ...otherOptions,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let attempt = 0;
    let lastError;

    while (attempt <= retries) {
      try {
        setLoading(true);
        setError(null);

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        // Race between fetch and timeout
        const response = await Promise.race([
          fetch(url, config),
          timeoutPromise
        ]);

        if (!response.ok) {
          // Handle different HTTP status codes
          if (response.status === 401) {
            // Token expired or invalid
            logout();
            throw new Error(getErrorMessage(ErrorCodes.AUTH_TOKEN_EXPIRED));
          } else if (response.status === 403) {
            throw new Error(getErrorMessage(ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS));
          } else if (response.status === 404) {
            throw new Error(getErrorMessage(ErrorCodes.API_ENDPOINT_NOT_FOUND));
          } else if (response.status === 429) {
            throw new Error(getErrorMessage(ErrorCodes.RATE_LIMIT_EXCEEDED));
          } else if (response.status >= 500) {
            throw new Error(getErrorMessage(ErrorCodes.INTERNAL_SERVER_ERROR));
          } else {
            // Try to get error message from response
            try {
              const errorData = await response.json();
              throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            } catch {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          }
        }

        // Parse response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }

      } catch (err) {
        lastError = err;
        
        // Don't retry on certain errors
        if (err.name === 'AbortError' || err.message === 'Request timeout') {
          break;
        }

        // Retry logic
        if (attempt < retries) {
          attempt++;
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        break;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }

    // If we get here, all retries failed
    setError(lastError.message);
    throw lastError;
  }, [logout]);

  // Convenience methods
  const get = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'GET' });
  }, [request]);

  const post = useCallback((url, body, options = {}) => {
    return request(url, { ...options, method: 'POST', body });
  }, [request]);

  const put = useCallback((url, body, options = {}) => {
    return request(url, { ...options, method: 'PUT', body });
  }, [request]);

  const patch = useCallback((url, body, options = {}) => {
    return request(url, { ...options, method: 'PATCH', body });
  }, [request]);

  const del = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'DELETE' });
  }, [request]);

  const upload = useCallback(async (url, file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData
        ...options.headers,
      },
      body: formData,
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return request(url, config);
  }, [request]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    del,
    upload,
    cancelRequest,
    clearError,
  };
};

export default useApi;

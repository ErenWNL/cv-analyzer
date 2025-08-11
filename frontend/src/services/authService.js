import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication service
export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        return {
          success: true,
          data: { token, user }
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || 'Login failed';
        
        if (status === 401) {
          return { success: false, error: 'Invalid email or password' };
        } else if (status === 422) {
          return { success: false, error: 'Please check your input and try again' };
        } else if (status === 429) {
          return { success: false, error: 'Too many login attempts. Please try again later.' };
        } else {
          return { success: false, error: message };
        }
      } else if (error.request) {
        // Network error
        return { success: false, error: 'Network error. Please check your connection.' };
      } else {
        // Other error
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      }
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        return {
          success: true,
          data: { token, user }
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Registration failed';
        
        if (status === 409) {
          return { success: false, error: 'Email already exists' };
        } else if (status === 422) {
          return { success: false, error: 'Please check your input and try again' };
        } else {
          return { success: false, error: message };
        }
      } else if (error.request) {
        return { success: false, error: 'Network error. Please check your connection.' };
      } else {
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, remove token locally
      localStorage.removeItem('authToken');
      return { success: true };
    }
  },

  // Verify token and get user data
  verifyToken: async (token) => {
    try {
      const response = await apiClient.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return response.data.data.user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      
      if (response.data.success) {
        return response.data.data.user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');
      
      if (response.data.success) {
        const { token } = response.data.data;
        localStorage.setItem('authToken', token);
        return { success: true, token };
      } else {
        return { success: false, error: 'Token refresh failed' };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: 'Token refresh failed' };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        return { success: true, message: 'Password reset email sent' };
      } else {
        return { success: false, error: response.data.message || 'Failed to send reset email' };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.response?.status === 404) {
        return { success: false, error: 'Email not found' };
      } else {
        return { success: false, error: 'Failed to send reset email' };
      }
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      
      if (response.data.success) {
        return { success: true, message: 'Password reset successfully' };
      } else {
        return { success: false, error: response.data.message || 'Password reset failed' };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
      if (error.response?.status === 400) {
        return { success: false, error: 'Invalid or expired reset token' };
      } else {
        return { success: false, error: 'Password reset failed' };
      }
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        return { success: true, message: 'Password changed successfully' };
      } else {
        return { success: false, error: response.data.message || 'Password change failed' };
      }
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.response?.status === 400) {
        return { success: false, error: 'Current password is incorrect' };
      } else {
        return { success: false, error: 'Password change failed' };
      }
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      
      if (response.data.success) {
        return { success: true, data: response.data.data.user };
      } else {
        return { success: false, error: response.data.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  },

  // Check if email exists
  checkEmailExists: async (email) => {
    try {
      const response = await apiClient.post('/auth/check-email', { email });
      return response.data.exists || false;
    } catch (error) {
      console.error('Check email error:', error);
      return false;
    }
  }
};

// Mock service for development (when backend is not ready)
export const mockAuthService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    if (email === 'demo@cvanalyzer.com' && password === 'demo123') {
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: 'demo@cvanalyzer.com',
        roles: ['candidate'],
        permissions: ['cv:analyze', 'assessment:take'],
        profilePicture: null,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return {
        success: true,
        data: { token: mockToken, user: mockUser }
      };
    } else {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      roles: ['candidate'],
      permissions: ['cv:analyze', 'assessment:take'],
      profilePicture: null,
      createdAt: new Date().toISOString()
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    return {
      success: true,
      data: { token: mockToken, user: mockUser }
    };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  verifyToken: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token.startsWith('mock-jwt-token')) {
      return {
        id: '1',
        name: 'Demo User',
        email: 'demo@cvanalyzer.com',
        roles: ['candidate'],
        permissions: ['cv:analyze', 'assessment:take'],
        profilePicture: null,
        createdAt: new Date().toISOString()
      };
    }
    
    return null;
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: '1',
      name: 'Demo User',
      email: 'demo@cvanalyzer.com',
      roles: ['candidate'],
      permissions: ['cv:analyze', 'assessment:take'],
      profilePicture: null,
      createdAt: new Date().toISOString()
    };
  }
};

// Export the service to use (switch between real and mock)
const isDevelopment = import.meta.env.MODE === 'development';
const useRealAPI = import.meta.env.VITE_USE_REAL_API === 'true';

export default isDevelopment && !useRealAPI ? mockAuthService : authService;
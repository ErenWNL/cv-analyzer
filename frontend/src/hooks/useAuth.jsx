import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import { STORAGE_KEYS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      
      if (token) {
        try {
          // Verify token is still valid
          const userData = await api.get('/auth/me')
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          // Token is invalid, remove it
          console.error('Auth initialization failed:', error)
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        }
      }
      
      setLoading(false)
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)
      
      const response = await api.post('/auth/login', { 
        email: email.toLowerCase().trim(), 
        password 
      })
      
      if (response.token && response.user) {
        // Store token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
        api.setAuthToken(response.token)
        
        // Set user state
        setUser(response.user)
        setIsAuthenticated(true)
        
        toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS)
        return { success: true, user: response.user }
      } else {
        throw new Error('Invalid response format')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.message || ERROR_MESSAGES.LOGIN_FAILED
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      
      const response = await api.post('/auth/register', {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password
      })
      
      if (response.token && response.user) {
        // Store token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
        api.setAuthToken(response.token)
        
        // Set user state
        setUser(response.user)
        setIsAuthenticated(true)
        
        toast.success(SUCCESS_MESSAGES.REGISTRATION_SUCCESS)
        return { success: true, user: response.user }
      } else {
        throw new Error('Invalid response format')
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.message || ERROR_MESSAGES.REGISTRATION_FAILED
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint (optional)
      await api.post('/auth/logout').catch(() => {
        // Ignore logout API errors
      })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local state regardless of API response
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      api.removeAuthToken()
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      
      const response = await api.put('/user/profile', profileData)
      
      if (response.user) {
        setUser(response.user)
        toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED)
        return { success: true, user: response.user }
      }
      
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = error.message || 'Failed to update profile'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Check if user has specific role or permission
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin') || hasRole('administrator')
  }

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    
    // Utilities
    hasRole,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protecting routes
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner w-8 h-8"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access this page.
            </p>
            <Link to="/login" className="btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
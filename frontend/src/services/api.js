const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getAuthToken() {
    return localStorage.getItem('authToken')
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token)
  }

  removeAuthToken() {
    localStorage.removeItem('authToken')
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, mergedOptions)
      
      if (!response.ok) {
        if (response.status === 401) {
          this.removeAuthToken()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData
    const body = isFormData ? data : JSON.stringify(data)
    const headers = isFormData 
      ? {} 
      : { 'Content-Type': 'application/json' }

    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body,
      headers: {
        ...options.headers,
        ...headers,
      },
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export default new ApiService()
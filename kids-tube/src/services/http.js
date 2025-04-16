const BASE_URL = 'http://localhost:3000'

export const http = {
  async request(endpoint, options = {}) {
    const token = sessionStorage.getItem('token')
    
    if (!token) {
      throw new Error('No hay sesión activa')
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config)
      
      if (response.status === 401) {
        sessionStorage.removeItem('token')
        window.location.href = '/login'
        throw new Error('Sesión expirada')
      }

      return await response.json()
    } catch (error) {
      console.error('HTTP Request Error:', error)
      throw error
    }
  },
  // ... resto de métodos (get, post, put, delete)
}

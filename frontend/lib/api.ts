// API client for backend communication
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get Supabase session token
    const { supabase } = await import('./supabase')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API endpoint functions
export const api = {
  // Resume endpoints
  uploadResume: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/v1/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  parseResume: async (resumeId: string) => {
    return apiClient.post(`/api/v1/parse/resume/${resumeId}`)
  },

  // Context endpoints
  buildContext: async (data: any) => {
    return apiClient.post('/api/v1/context/build', data)
  },

  getContext: async () => {
    return apiClient.get('/api/v1/context')
  },

  // SMTP endpoints
  saveSmtpCredentials: async (credentials: any) => {
    return apiClient.post('/api/v1/smtp/credentials', credentials)
  },

  testSmtpConnection: async () => {
    return apiClient.post('/api/v1/smtp/test')
  },

  // Email endpoints (Phase 1 - manual send)
  sendEmail: async (emailData: any) => {
    return apiClient.post('/api/v1/email/send', emailData)
  },

  // Health check
  healthCheck: async () => {
    return apiClient.get('/health')
  },
}

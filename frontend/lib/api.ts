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

    try {
      const response = await apiClient.post('/api/v1/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response
    } catch (error: any) {
      console.error('Resume upload error:', error.response?.data || error.message)
      throw error
    }
  },

  getCurrentResume: async () => {
    return apiClient.get('/api/v1/resume/current')
  },

  parseResume: async (resumeId: string) => {
    return apiClient.post(`/api/v1/resume/parse/${resumeId}`)
  },

  getResumes: async () => {
    return apiClient.get('/api/v1/resume')
  },

  downloadResume: async (resumeId: string) => {
    return apiClient.get(`/api/v1/resume/download/${resumeId}`, {
      responseType: 'blob'
    })
  },

  // Context endpoints
  buildContext: async (data: any) => {
    return apiClient.post('/api/v1/context/build', data)
  },

  getContext: async () => {
    return apiClient.get('/api/v1/context')
  },

  getContextProfile: async () => {
    return apiClient.get('/api/v1/context')
  },

  getPredefinedTags: async () => {
    return apiClient.get('/api/v1/context/predefined-tags')
  },

  getContextSuggestions: async () => {
    return apiClient.get('/api/v1/context/suggestions')
  },

  getSmtpConfig: async () => {
    return apiClient.get('/api/v1/smtp/credentials')
  },

  // SMTP endpoints
  saveSmtpCredentials: async (credentials: any) => {
    return apiClient.post('/api/v1/smtp/credentials', credentials)
  },

  testSmtpConnection: async () => {
    return apiClient.post('/api/v1/smtp/test')
  },

  // Email endpoints
  sendEmail: async (emailData: any) => {
    return apiClient.post('/api/v1/email/send', emailData)
  },

  // Email management endpoints (NEW)
  generateEmail: async (companyData: any) => {
    return apiClient.post('/api/v1/email/generate', companyData)
  },

  getEmails: async (status?: string) => {
    const params = status ? { status } : {}
    return apiClient.get('/api/v1/emails', { params })
  },

  getEmail: async (emailId: string) => {
    return apiClient.get(`/api/v1/emails/${emailId}`)
  },

  updateEmailStatus: async (emailId: string, status: string) => {
    return apiClient.patch(`/api/v1/emails/${emailId}/status`, { status })
  },

  updateEmailContent: async (emailId: string, content: string) => {
    return apiClient.patch(`/api/v1/emails/${emailId}/content`, { content })
  },

  deleteEmail: async (emailId: string) => {
    return apiClient.delete(`/api/v1/emails/${emailId}`)
  },

  // Logs endpoint (NEW)
  getLogs: async (limit: number = 100) => {
    return apiClient.get('/api/v1/logs', { params: { limit } })
  },

  // Health check
  healthCheck: async () => {
    return apiClient.get('/health')
  },
}

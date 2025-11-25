// Email Management Types

export type EmailStatus = 'new' | 'under_review' | 'approved' | 'rejected'

export interface EmailData {
  id: string
  user_id: string
  company_name: string
  company_website: string
  recipient_email: string
  recipient_name?: string
  subject: string
  content: string
  status: EmailStatus
  keywords: string[]
  location?: string
  position?: string
  salary_range?: string
  job_type?: string
  generated_at: string
  reviewed_at?: string
  sent_at?: string
  created_at: string
  updated_at: string
  metadata?: {
    company_size?: string
    industry?: string
    tech_stack?: string[]
    notes?: string
  }
}

export interface EmailFilters {
  status?: EmailStatus
  search?: string
  location?: string
  dateFrom?: string
  dateTo?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  category: string
  message: string
  details?: any
}

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  new: 'New',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const EMAIL_STATUS_COLORS: Record<EmailStatus, { bg: string; text: string; border: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  under_review: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
}

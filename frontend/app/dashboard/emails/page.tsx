'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import EmailList from '@/components/emails/EmailList'
import EmailDetail from '@/components/emails/EmailDetail'
import EmailChatbot from '@/components/emails/EmailChatbot'
import { Mail, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import type { EmailData, EmailStatus } from '@/types/email'

const TABS: { id: EmailStatus; label: string; count?: number }[] = [
  { id: 'new', label: 'New' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState<EmailStatus>('new')
  const [emails, setEmails] = useState<EmailData[]>([])
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch emails when tab changes
  useEffect(() => {
    fetchEmails()
  }, [activeTab])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getEmails(activeTab)
      setEmails(response.data.emails || [])
      
      // Auto-select first email if none selected
      if (response.data.emails?.length > 0 && !selectedEmail) {
        setSelectedEmail(response.data.emails[0])
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load emails')
      setEmails([])
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSelect = (email: EmailData) => {
    setSelectedEmail(email)
  }

  const handleStatusChange = async (emailId: string, newStatus: EmailStatus) => {
    try {
      await api.updateEmailStatus(emailId, newStatus)
      
      // Remove from current list if status changed
      if (newStatus !== activeTab) {
        setEmails(emails.filter(e => e.id !== emailId))
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(emails.find(e => e.id !== emailId) || null)
        }
      }
    } catch (err: any) {
      console.error('Failed to update status:', err)
    }
  }

  const handleContentUpdate = async (emailId: string, newContent: string) => {
    try {
      await api.updateEmailContent(emailId, newContent)
      
      // Update local state
      setEmails(emails.map(e => 
        e.id === emailId ? { ...e, content: newContent } : e
      ))
      if (selectedEmail?.id === emailId) {
        setSelectedEmail({ ...selectedEmail, content: newContent })
      }
    } catch (err: any) {
      console.error('Failed to update content:', err)
    }
  }

  const handleDelete = async (emailId: string) => {
    try {
      await api.deleteEmail(emailId)
      setEmails(emails.filter(e => e.id !== emailId))
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(emails.find(e => e.id !== emailId) || null)
      }
    } catch (err: any) {
      console.error('Failed to delete email:', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Email Management
            </h1>
          </div>
          <p className="text-gray-600">
            Review and manage AI-generated outreach emails
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                {emails.length > 0 && activeTab === tab.id && (
                  <span className="ml-2 py-0.5 px-2 rounded-full bg-primary-100 text-primary-600 text-xs">
                    {emails.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left: Email List */}
          <div className="w-96 flex-shrink-0">
            <EmailList
              emails={emails}
              selectedEmail={selectedEmail}
              onSelect={handleEmailSelect}
              loading={loading}
              error={error}
            />
          </div>

          {/* Right: Detail & Chatbot */}
          {selectedEmail ? (
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {/* Email Detail (Top) */}
              <div className="flex-1 min-h-0">
                <EmailDetail
                  email={selectedEmail}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              </div>

              {/* Chatbot (Bottom) */}
              <div className="h-96 flex-shrink-0">
                <EmailChatbot
                  email={selectedEmail}
                  onContentUpdate={handleContentUpdate}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p>Loading emails...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No emails yet</p>
                  <p className="text-sm mt-1">Generated emails will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

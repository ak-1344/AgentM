'use client'

import { Building2, MapPin, Tag, Clock } from 'lucide-react'
import type { EmailData } from '@/types/email'
import { EMAIL_STATUS_COLORS } from '@/types/email'
import { formatDistanceToNow } from 'date-fns'

interface EmailListProps {
  emails: EmailData[]
  selectedEmail: EmailData | null
  onSelect: (email: EmailData) => void
  loading: boolean
  error: string | null
}

export default function EmailList({
  emails,
  selectedEmail,
  onSelect,
  loading,
  error,
}: EmailListProps) {
  if (loading) {
    return (
      <div className="card h-full">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card h-full">
        <div className="text-center text-red-600 p-4">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div className="card h-full">
        <div className="text-center text-gray-500 p-8">
          <p className="text-lg font-medium">No emails</p>
          <p className="text-sm mt-1">No emails in this category</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-700">
          {emails.length} {emails.length === 1 ? 'email' : 'emails'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => onSelect(email)}
              className={`
                w-full text-left p-4 transition-colors hover:bg-gray-50
                ${selectedEmail?.id === email.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''}
              `}
            >
              {/* Company Name & Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 truncate flex-1">
                  {email.company_name}
                </h3>
                <span
                  className={`
                    px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap
                    ${EMAIL_STATUS_COLORS[email.status].bg}
                    ${EMAIL_STATUS_COLORS[email.status].text}
                  `}
                >
                  {email.status.replace('_', ' ')}
                </span>
              </div>

              {/* Position */}
              {email.position && (
                <p className="text-sm text-gray-700 mb-2 truncate">
                  {email.position}
                </p>
              )}

              {/* Subject */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {email.subject}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {/* Location */}
                {email.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{email.location}</span>
                  </div>
                )}

                {/* Website */}
                {email.company_website && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">
                      {email.company_website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>
                  </div>
                )}

                {/* Keywords */}
                {email.keywords.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{email.keywords.slice(0, 2).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(email.generated_at), { addSuffix: true })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

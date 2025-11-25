'use client'

import { useState } from 'react'
import {
  Building2,
  MapPin,
  Tag,
  Globe,
  DollarSign,
  Briefcase,
  Calendar,
  MoreVertical,
  Trash2,
  Send,
  Eye,
  Check,
  X,
} from 'lucide-react'
import type { EmailData, EmailStatus } from '@/types/email'
import { EMAIL_STATUS_LABELS } from '@/types/email'
import { format } from 'date-fns'

interface EmailDetailProps {
  email: EmailData
  onStatusChange: (emailId: string, newStatus: EmailStatus) => void
  onDelete: (emailId: string) => void
}

export default function EmailDetail({ email, onStatusChange, onDelete }: EmailDetailProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleStatusChange = (newStatus: EmailStatus) => {
    onStatusChange(email.id, newStatus)
    setShowMenu(false)
  }

  const handleDelete = () => {
    onDelete(email.id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="card h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {email.company_name}
            </h2>
            {email.position && (
              <p className="text-lg text-gray-700 mb-2">{email.position}</p>
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusChange('new')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Mark as New
                  </button>
                  <button
                    onClick={() => handleStatusChange('under_review')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange('approved')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {email.company_website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-gray-400" />
              <a
                href={email.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline truncate"
              >
                {email.company_website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {email.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{email.location}</span>
            </div>
          )}

          {email.job_type && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{email.job_type}</span>
            </div>
          )}

          {email.salary_range && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{email.salary_range}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">
              {format(new Date(email.generated_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Keywords */}
        {email.keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {email.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Email Content */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Subject</h3>
        <p className="text-gray-900 mb-4">{email.subject}</p>

        <h3 className="text-sm font-semibold text-gray-700 mb-2">Recipient</h3>
        <p className="text-gray-900 mb-4">
          {email.recipient_name ? (
            <>
              {email.recipient_name} <span className="text-gray-500">({email.recipient_email})</span>
            </>
          ) : (
            email.recipient_email
          )}
        </p>

        <h3 className="text-sm font-semibold text-gray-700 mb-2">Message</h3>
        <div className="prose prose-sm max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
            {email.content}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Email?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this email? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

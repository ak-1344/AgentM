'use client'

import DashboardLayout from '@/components/DashboardLayout'
import ResumeUploader from '@/components/ResumeUploader'
import { useState } from 'react'
import { FileText, CheckCircle } from 'lucide-react'

export default function ResumePage() {
  const [resumeId, setResumeId] = useState<string | null>(null)

  const handleUploadSuccess = (id: string) => {
    setResumeId(id)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Your Resume
            </h1>
          </div>
          <p className="text-gray-600">
            Upload your resume so our AI can extract your skills, experience, and qualifications
          </p>
        </div>

        {/* Uploader */}
        <div className="card mb-6">
          <ResumeUploader onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* What happens next */}
        {!resumeId && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>AI extracts your skills, experience, and achievements</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Your profile is analyzed to match with relevant opportunities</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>This information is used to personalize outreach emails</span>
              </li>
            </ul>
          </div>
        )}

        {/* Success - Next Steps */}
        {resumeId && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Next Steps
            </h3>
            <p className="text-gray-600 mb-4">
              Great! Your resume has been parsed. Now let's configure your outreach context.
            </p>
            <a href="/dashboard/context" className="btn-primary inline-block">
              Configure Context →
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

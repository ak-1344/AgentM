'use client'

import DashboardLayout from '@/components/DashboardLayout'
import ResumeUploader from '@/components/ResumeUploader'
import { useState, useEffect } from 'react'
import { FileText, CheckCircle, Loader2, AlertCircle, RefreshCw, Upload } from 'lucide-react'
import { api } from '@/lib/api'

export default function ResumePage() {
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [existingResume, setExistingResume] = useState<any>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [parseError, setParseError] = useState<string | null>(null)
  const [showUploader, setShowUploader] = useState(false)

  useEffect(() => {
    checkExistingResume()
  }, [])

  const checkExistingResume = async () => {
    try {
      setIsLoading(true)
      const response = await api.getResumes()
      if (response.data && response.data.length > 0) {
        const resume = response.data[0]
        setExistingResume(resume)
        setResumeId(resume.id)

        // If resume exists but not parsed, trigger parse automatically
        if (!resume.parsed_data) {
          handleParse(resume.id)
        }
      } else {
        setShowUploader(true)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
      setShowUploader(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleParse = async (id: string) => {
    setIsParsing(true)
    setParseError(null)

    try {
      await api.parseResume(id)
      // Refresh resume data
      const response = await api.getResumes()
      if (response.data && response.data.length > 0) {
        setExistingResume(response.data[0])
      }
      setIsParsing(false)
    } catch (error) {
      console.error('Parsing error:', error)
      setParseError('AI parsing failed. Please try again.')
      setIsParsing(false)
    }
  }

  const handleUploadSuccess = async (id: string) => {
    setResumeId(id)
    setShowUploader(false)
    await handleParse(id)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {existingResume ? 'Your Resume' : 'Upload Your Resume'}
            </h1>
          </div>
          <p className="text-gray-600">
            {existingResume
              ? 'Manage your uploaded resume and AI parsing status'
              : 'Upload your resume so our AI can extract your skills, experience, and qualifications'
            }
          </p>
        </div>

        {/* Existing Resume View */}
        {existingResume && !showUploader && (
          <div className="card mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {existingResume.file_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Uploaded on {new Date(existingResume.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleParse(existingResume.id)}
                  disabled={isParsing}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isParsing ? 'animate-spin' : ''}`} />
                  {isParsing ? 'Parsing...' : 'Reparse'}
                </button>
                <button
                  onClick={() => setShowUploader(true)}
                  className="btn-outline flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Replace
                </button>
              </div>
            </div>

            {/* Parsing Status */}
            {existingResume.parsed_data ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Successfully Parsed</h4>
                  <p className="text-sm text-green-700 mt-1">
                    AI has extracted {existingResume.parsed_data.skills?.length || 0} skills
                    and {existingResume.parsed_data.job_titles?.length || 0} job titles.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Not Parsed Yet</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This resume hasn't been processed by AI yet. Click "Reparse" to extract details.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Uploader */}
        {(showUploader || !existingResume) && (
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Upload New Resume</h3>
              {existingResume && (
                <button
                  onClick={() => setShowUploader(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
            <ResumeUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Parsing State (Overlay) */}
        {isParsing && (
          <div className="card bg-blue-50 border-blue-200 mb-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  AI is analyzing your resume...
                </h3>
                <p className="text-sm text-blue-700">
                  This usually takes about 10-20 seconds. We're extracting your skills and experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {parseError && (
          <div className="card bg-red-50 border-red-200 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Parsing Failed
                </h3>
                <p className="text-sm text-red-700">
                  {parseError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {existingResume && existingResume.parsed_data && !isParsing && (
          <div className="card bg-gray-50 border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Ready for Outreach
                </h3>
                <p className="text-green-700">
                  Your resume is ready. You can now configure your outreach context.
                </p>
              </div>
            </div>
            <a href="/dashboard/context" className="btn-primary inline-block">
              Configure Context →
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

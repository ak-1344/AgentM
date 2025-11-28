'use client'

import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { api } from '@/lib/api'

interface ResumeParseStepProps {
  resumeId: string
  onComplete: (parsedData: any) => void
  onNext: () => void
}

export default function ResumeParseStep({ resumeId, onComplete, onNext }: ResumeParseStepProps) {
  const [parsing, setParsing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<any>(null)

  // Check if resume is already parsed on mount
  useEffect(() => {
    checkIfAlreadyParsed()
  }, [resumeId])

  const checkIfAlreadyParsed = async () => {
    try {
      const response = await api.getCurrentResume()
      if (response.data && response.data.parsed_data) {
        setParsedData(response.data.parsed_data)
        setSuccess(true)
        onComplete(response.data.parsed_data)
      }
    } catch (err) {
      // No existing parsed data
    }
  }

  const handleParse = async () => {
    setParsing(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await api.parseResume(resumeId)
      const data = response.data.parsed_data
      
      setParsedData(data)
      setSuccess(true)
      onComplete(data)
      
      // Don't auto-advance, let user click Continue button
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Parsing failed. Please try again.')
      setParsing(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Parse Resume with AI</h2>
      <p className="text-gray-600 mb-6">
        Our AI will extract your skills, experience, and qualifications using Google Gemini.
      </p>

      {/* Parsing Status */}
      <div className="mb-6">
        {parsing && !success && (
          <div className="p-6 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
                <Loader className="w-8 h-8 text-primary-600 animate-spin absolute inset-0" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-900">
                  Analyzing your resume with Gemini AI...
                </p>
                <p className="text-xs text-primary-700 mt-1">
                  This may take 10-30 seconds
                </p>
              </div>
            </div>
            
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-progress" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {success && parsedData && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Resume parsed successfully!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Extracted your information. Moving to next step...
                </p>
              </div>
            </div>

            {/* Parsed Data Preview */}
            <div className="mt-4 space-y-3">
              {parsedData.name && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Name:</span>
                  <p className="text-sm text-gray-900">{parsedData.name}</p>
                </div>
              )}
              
              {parsedData.skills && parsedData.skills.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Skills ({parsedData.skills.length}):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {parsedData.skills.slice(0, 8).map((skill: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {parsedData.skills.length > 8 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        +{parsedData.skills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {parsedData.job_titles && parsedData.job_titles.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Experience:</span>
                  <p className="text-sm text-gray-900">{parsedData.job_titles.slice(0, 3).join(', ')}</p>
                </div>
              )}

              {parsedData.experience_years && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Years of Experience:</span>
                  <p className="text-sm text-gray-900">{parsedData.experience_years} years</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={handleParse}
                className="text-sm text-red-600 underline mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Parse Button */}
      {!parsing && !success && (
        <button
          onClick={handleParse}
          className="btn-primary w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Parse Resume with AI
        </button>
      )}

      {/* Continue Button (after success) */}
      {success && (
        <button
          onClick={onNext}
          className="btn-primary w-full"
        >
          Continue to Context Setup →
        </button>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'

interface ResumeUploadStepProps {
  onComplete: (resumeId: string) => void
  onNext: () => void
}

export default function ResumeUploadStep({ onComplete, onNext }: ResumeUploadStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOC, or DOCX file')
        setFile(null)
        return
      }
      
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await api.uploadResume(file)
      const resumeId = response.data.resume_id
      
      setSuccess(true)
      onComplete(resumeId)
      
      // Don't auto-advance, let user click button
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
      <p className="text-gray-600 mb-6">
        Upload your resume so AI can extract your skills, experience, and qualifications.
      </p>

      {/* Upload Area */}
      <div className="mb-6">
        <label
          htmlFor="resume-upload"
          className={`
            block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
            transition-colors
            ${file ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
          `}
        >
          <div className="flex flex-col items-center">
            {file ? (
              <>
                <FileText className="w-12 h-12 text-primary-600 mb-3" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, or DOCX (max 10MB)
                </p>
              </>
            )}
          </div>
          <input
            id="resume-upload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Resume uploaded successfully!</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading || success}
        className="btn-primary w-full"
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Uploading...
          </span>
        ) : (
          'Upload Resume'
        )}
      </button>

      {/* Continue Button (after success) */}
      {success && (
        <button
          onClick={onNext}
          className="btn-primary w-full mt-3"
        >
          Continue to Parse Resume →
        </button>
      )}
    </div>
  )
}

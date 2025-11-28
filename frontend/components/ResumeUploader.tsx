'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File as FileIcon, X, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

interface ResumeUploaderProps {
  onUploadSuccess?: (resumeId: string) => void
}

export default function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [parsed, setParsed] = useState(false)

  // Check for existing resume on load
  useEffect(() => {
    const fetchCurrentResume = async () => {
      try {
        const response = await api.getCurrentResume()
        if (response.data) {
          setResumeId(response.data.id)
          // Create a mock file object for display
          const mockFile = new File([""], response.data.file_name || "Existing Resume", { type: "application/pdf" })
          setFile(mockFile)
          setSuccess(true)

          // Check if already parsed
          if (response.data.parsed_data) {
            setParsed(true)
            if (onUploadSuccess) {
              onUploadSuccess(response.data.id)
            }
          }
        }
      } catch (err) {
        // Ignore 404s (no resume)
        console.log("No existing resume found")
      }
    }

    fetchCurrentResume()
  }, [onUploadSuccess])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setError(null)
      setSuccess(false)
      setResumeId(null)
      setParsed(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !!resumeId
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const response = await api.uploadResume(file)
      const newResumeId = response.data.resume_id
      setResumeId(newResumeId)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const handleParse = async () => {
    if (!resumeId) return

    setParsing(true)
    setError(null)

    try {
      await api.parseResume(resumeId)
      setParsed(true)
      if (onUploadSuccess) {
        onUploadSuccess(resumeId)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to parse resume')
    } finally {
      setParsing(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setError(null)
    setSuccess(false)
    setResumeId(null)
    setParsed(false)
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
          </p>
          <p className="text-sm text-gray-600">
            Drag & drop your resume, or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports PDF, DOC, DOCX (max 10MB)
          </p>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FileIcon className="w-10 h-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!uploading && !parsing && !parsed && (
              <button
                onClick={handleRemove}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {parsed && (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            {/* Upload Button */}
            {!resumeId && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Upload Resume'
                )}
              </button>
            )}

            {/* Parse Button */}
            {resumeId && !parsed && (
              <button
                onClick={handleParse}
                disabled={parsing}
                className="btn-primary"
              >
                {parsing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Parsing with AI...</span>
                  </div>
                ) : (
                  'Parse Resume'
                )}
              </button>
            )}

            {/* Cancel Button */}
            {!uploading && !parsing && !parsed && (
              <button
                onClick={handleRemove}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Success Message */}
          {parsed && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Resume processed successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Your resume has been uploaded and parsed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Operation failed
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

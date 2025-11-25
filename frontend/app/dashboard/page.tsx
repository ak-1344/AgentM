'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowRight, FileText, Mail, Target, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface ProgressStatus {
  hasResume: boolean
  hasContext: boolean
  hasSmtp: boolean
  loading: boolean
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressStatus>({
    hasResume: false,
    hasContext: false,
    hasSmtp: false,
    loading: true
  })

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      setProgress(prev => ({ ...prev, loading: true }))
      
      // Check each component in parallel
      const [resumeRes, contextRes, smtpRes] = await Promise.allSettled([
        api.getResumes(),
        api.getContextProfile(),
        api.getSmtpConfig()
      ])

      setProgress({
        hasResume: resumeRes.status === 'fulfilled' && resumeRes.value?.length > 0,
        hasContext: contextRes.status === 'fulfilled' && contextRes.value !== null,
        hasSmtp: smtpRes.status === 'fulfilled' && smtpRes.value !== null,
        loading: false
      })
    } catch (error) {
      console.error('Error loading progress:', error)
      setProgress(prev => ({ ...prev, loading: false }))
    }
  }

  const completedSteps = [progress.hasResume, progress.hasContext, progress.hasSmtp].filter(Boolean).length
  const totalSteps = 3
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Agent M
          </h1>
          <p className="text-gray-600">
            Let's set up your AI-powered outreach campaign
          </p>
        </div>

        {/* Progress Bar */}
        {!progress.loading && completedSteps < totalSteps && (
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Setup Progress: {completedSteps} of {totalSteps} complete
              </span>
              <span className="text-sm font-semibold text-primary-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Message */}
        {!progress.loading && completedSteps === totalSteps && (
          <div className="card mb-6 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  🎉 Setup Complete!
                </h3>
                <p className="text-sm text-green-700">
                  You're all set! Head to the <Link href="/dashboard/email" className="underline font-medium">Email</Link> page to start sending outreach emails.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Getting Started Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Step 1 - Upload Resume */}
          <Link href="/dashboard/resume">
            <div className={`card hover:shadow-lg transition-shadow cursor-pointer h-full ${progress.hasResume ? 'border-green-300 bg-green-50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${progress.hasResume ? 'bg-green-100' : 'bg-primary-100'}`}>
                  <FileText className={`w-6 h-6 ${progress.hasResume ? 'text-green-600' : 'text-primary-600'}`} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-primary-600">Step 1</span>
                  {progress.hasResume && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Your Resume
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your resume so AI can extract your skills and experience
              </p>
              <div className={`flex items-center text-sm font-medium ${progress.hasResume ? 'text-green-600' : 'text-primary-600'}`}>
                <span>{progress.hasResume ? 'Completed' : 'Get started'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Step 2 - Set Context */}
          <Link href="/dashboard/context">
            <div className={`card hover:shadow-lg transition-shadow cursor-pointer h-full ${progress.hasContext ? 'border-green-300 bg-green-50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${progress.hasContext ? 'bg-green-100' : 'bg-primary-100'}`}>
                  <Target className={`w-6 h-6 ${progress.hasContext ? 'text-green-600' : 'text-primary-600'}`} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-primary-600">Step 2</span>
                  {progress.hasContext && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Define Your Context
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tell us what roles and industries you're targeting
              </p>
              <div className={`flex items-center text-sm font-medium ${progress.hasContext ? 'text-green-600' : 'text-primary-600'}`}>
                <span>{progress.hasContext ? 'Completed' : 'Configure'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Step 3 - Setup Email */}
          <Link href="/dashboard/settings">
            <div className={`card hover:shadow-lg transition-shadow cursor-pointer h-full ${progress.hasSmtp ? 'border-green-300 bg-green-50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${progress.hasSmtp ? 'bg-green-100' : 'bg-primary-100'}`}>
                  <Mail className={`w-6 h-6 ${progress.hasSmtp ? 'text-green-600' : 'text-primary-600'}`} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-primary-600">Step 3</span>
                  {progress.hasSmtp && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect Email
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Set up SMTP credentials to send emails from your account
              </p>
              <div className={`flex items-center text-sm font-medium ${progress.hasSmtp ? 'text-green-600' : 'text-primary-600'}`}>
                <span>{progress.hasSmtp ? 'Completed' : 'Setup'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Status Overview */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Setup Status
          </h2>
          {progress.loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading progress...
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {progress.hasResume ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-400" />
                )}
                <span className={`${progress.hasResume ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  Resume uploaded
                </span>
                <span className={`ml-auto text-sm ${progress.hasResume ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {progress.hasResume ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {progress.hasContext ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-400" />
                )}
                <span className={`${progress.hasContext ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  Context configured
                </span>
                <span className={`ml-auto text-sm ${progress.hasContext ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {progress.hasContext ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {progress.hasSmtp ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-400" />
                )}
                <span className={`${progress.hasSmtp ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  Email connected
                </span>
                <span className={`ml-auto text-sm ${progress.hasSmtp ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {progress.hasSmtp ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}


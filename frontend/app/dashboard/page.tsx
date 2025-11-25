'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { ArrowRight, FileText, Mail, Target } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
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

        {/* Getting Started Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Step 1 - Upload Resume */}
          <Link href="/dashboard/resume">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-sm font-semibold text-primary-600">Step 1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Your Resume
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your resume so AI can extract your skills and experience
              </p>
              <div className="flex items-center text-primary-600 text-sm font-medium">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Step 2 - Set Context */}
          <Link href="/dashboard/context">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-sm font-semibold text-primary-600">Step 2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Define Your Context
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tell us what roles and industries you're targeting
              </p>
              <div className="flex items-center text-primary-600 text-sm font-medium">
                <span>Configure</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Step 3 - Setup Email */}
          <Link href="/dashboard/settings">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-sm font-semibold text-primary-600">Step 3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect Email
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Set up SMTP credentials to send emails from your account
              </p>
              <div className="flex items-center text-primary-600 text-sm font-medium">
                <span>Setup</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Status Overview - TODO: Make dynamic based on actual user progress */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Setup Progress
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">1</span>
              </div>
              <span className="text-gray-600">Resume uploaded</span>
              <span className="ml-auto text-sm text-gray-500">Not completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">2</span>
              </div>
              <span className="text-gray-600">Context configured</span>
              <span className="ml-auto text-sm text-gray-500">Not completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">3</span>
              </div>
              <span className="text-gray-600">Email connected</span>
              <span className="ml-auto text-sm text-gray-500">Not completed</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

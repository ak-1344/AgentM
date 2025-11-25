'use client'

import DashboardLayout from '@/components/DashboardLayout'
import ContextSetupForm from '@/components/ContextSetupForm'
import { Target } from 'lucide-react'

export default function ContextPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Define Your Context
            </h1>
          </div>
          <p className="text-gray-600">
            Tell us about your target roles, industries, and preferences to help AI generate personalized emails
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <ContextSetupForm />
        </div>

        {/* Help Text */}
        <div className="mt-6 card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Tips for better results
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Be specific about job titles - this helps AI find the right companies</li>
            <li>• List industries you're genuinely interested in</li>
            <li>• Choose a tone that matches your personality and target companies</li>
            <li>• Include relevant skills and technologies you want to highlight</li>
            <li>• Add geographic preferences to narrow down your search</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}

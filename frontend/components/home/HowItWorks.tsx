'use client'

import { CheckCircle2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Upload Resume & Set Context',
    description: 'Upload your resume and define your job preferences, target companies, and outreach goals'
  },
  {
    number: '02',
    title: 'Start AI Scan',
    description: 'AI agents search across multiple sources to find relevant companies and opportunities'
  },
  {
    number: '03',
    title: 'AI Generates Personalized Drafts',
    description: 'LLM analyzes company context and creates tailored email drafts for each opportunity'
  },
  {
    number: '04',
    title: 'Review & Approve',
    description: 'Review generated emails in your dashboard, make edits, and approve for sending'
  },
  {
    number: '05',
    title: 'Automated Sending & Tracking',
    description: 'Approved emails are sent via SMTP and tracked in your dashboard with real-time updates'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Five simple steps to automate your outreach
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 hidden lg:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
              >
                <div className="flex items-start gap-8">
                  {/* Step number circle */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg z-10 relative">
                      {step.number}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-lg opacity-40" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-12">
                    <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-gray-900">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 text-lg">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

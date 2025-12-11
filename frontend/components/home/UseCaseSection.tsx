'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mail, Building2, CheckCircle } from 'lucide-react'

export default function UseCaseSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Real-World Example
          </h2>
          <p className="text-xl text-gray-600">
            See Agent M in action
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Story Card */}
          <div
          >
            <Card className="border-2 border-gray-100 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-3xl">
                  <span className="text-blue-600">
                    Ak's Job Search Journey
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <p className="text-gray-700 text-lg">
                      <strong>Goal:</strong> Apply to 50 tech companies for frontend developer roles
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pl-14">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-gray-600">Agent M scans job boards and company websites</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-gray-600">AI identifies 50 matching opportunities</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-gray-600">Generates personalized emails for each company</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-gray-600">Ak reviews and approves in dashboard</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-gray-600">All 50 emails sent automatically via SMTP</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-700 font-semibold">
                    ✨ Result: 2 weeks → 2 hours. 50 personalized applications completed!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mock Email Preview */}
          <div
          >
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
              {/* Email header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-white" />
                <div className="text-white">
                  <p className="font-semibold">Generated Email Preview</p>
                  <p className="text-xs text-blue-100">Personalized for each company</p>
                </div>
              </div>

              {/* Email content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">To: TechCorp Inc.</p>
                    <p className="text-sm text-gray-500">hiring@techcorp.com</p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700">
                  <p className="font-semibold text-gray-900">
                    Subject: Frontend Developer Application - Ak
                  </p>
                  
                  <p>Dear TechCorp Hiring Team,</p>
                  
                  <p className="text-sm leading-relaxed">
                    I came across your opening for a Frontend Developer and was excited to learn about 
                    TechCorp's innovative work in cloud-based collaboration tools. With my experience 
                    in React, Next.js, and TypeScript, I believe I would be a great fit for your team.
                  </p>
                  
                  <p className="text-sm leading-relaxed">
                    My recent project building Agent M—an AI-powered outreach automation platform—
                    demonstrates my ability to create scalable, user-friendly applications...
                  </p>
                  
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
                    <p className="text-xs text-blue-700 font-mono">
                      🤖 AI-generated • Context-aware • Personalized for TechCorp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

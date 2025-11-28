'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { Target, Edit, Loader, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function ContextPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState<any>(null)

  useEffect(() => {
    loadContext()
  }, [])

  const loadContext = async () => {
    try {
      setLoading(true)
      const response = await api.getContextProfile()
      setContext(response.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No context yet
        setContext(null)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Your Context Profile
              </h1>
            </div>
            <p className="text-gray-600">
              View and manage your outreach context for personalized email generation
            </p>
          </div>
          
          {context && (
            <button
              onClick={() => router.push('/dashboard/context/edit')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Context
            </button>
          )}
        </div>

        {/* Context Display */}
        {!context ? (
          <div className="card text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Context Profile Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Set up your context to start generating personalized outreach emails
            </p>
            <button
              onClick={() => router.push('/dashboard/context/edit')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Context Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Purpose */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Purpose</h3>
              <p className="text-gray-700 font-medium">{context.purpose}</p>
            </div>

            {/* Target Roles */}
            {context.target_roles?.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {context.target_roles.map((role: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Industries */}
            {context.preferred_industries?.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferred Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {context.preferred_industries.map((industry: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {context.keywords?.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {context.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Geography */}
            {context.geography?.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferred Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {context.geography.map((location: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Email Tone */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Tone</h3>
              <p className="text-gray-700 capitalize">{context.pitch_tone}</p>
            </div>

            {/* Custom Message */}
            {context.custom_message && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Message</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{context.custom_message}</p>
              </div>
            )}

            {/* Resume Information */}
            {context.resume_parsed_data && Object.keys(context.resume_parsed_data).length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Information</h3>
                <div className="space-y-4">
                  {Object.entries(context.resume_parsed_data).map(([key, value]: [string, any]) => (
                    <div key={key} className="border-b border-gray-200 pb-3 last:border-0">
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h4>
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-2">
                          {value.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                            >
                              {typeof item === 'object' ? JSON.stringify(item) : item}
                            </span>
                          ))}
                        </div>
                      ) : typeof value === 'object' && value !== null ? (
                        <pre className="text-sm text-gray-700 bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-gray-700">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

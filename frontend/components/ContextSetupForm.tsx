'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function ContextSetupForm() {
  const [formData, setFormData] = useState({
    targetRoles: '',
    preferredIndustries: '',
    pitchTone: 'professional',
    keywords: '',
    customMessage: '',
    geography: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Convert comma-separated strings to arrays
      const payload = {
        target_roles: formData.targetRoles.split(',').map(s => s.trim()).filter(Boolean),
        preferred_industries: formData.preferredIndustries.split(',').map(s => s.trim()).filter(Boolean),
        pitch_tone: formData.pitchTone,
        keywords: formData.keywords.split(',').map(s => s.trim()).filter(Boolean),
        custom_message: formData.customMessage,
        geography: formData.geography.split(',').map(s => s.trim()).filter(Boolean),
      }

      await api.buildContext(payload)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save context')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Roles */}
      <div>
        <label htmlFor="targetRoles" className="block text-sm font-medium text-gray-700 mb-2">
          Target Roles
        </label>
        <input
          id="targetRoles"
          name="targetRoles"
          type="text"
          value={formData.targetRoles}
          onChange={handleChange}
          placeholder="Software Engineer, Frontend Developer, Full Stack Developer"
          className="input-field"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Comma-separated list of job titles you're targeting
        </p>
      </div>

      {/* Preferred Industries */}
      <div>
        <label htmlFor="preferredIndustries" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Industries
        </label>
        <input
          id="preferredIndustries"
          name="preferredIndustries"
          type="text"
          value={formData.preferredIndustries}
          onChange={handleChange}
          placeholder="Tech, Finance, Healthcare, E-commerce"
          className="input-field"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Industries or sectors you want to work in
        </p>
      </div>

      {/* Pitch Tone */}
      <div>
        <label htmlFor="pitchTone" className="block text-sm font-medium text-gray-700 mb-2">
          Email Tone
        </label>
        <select
          id="pitchTone"
          name="pitchTone"
          value={formData.pitchTone}
          onChange={handleChange}
          className="input-field"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="technical">Technical</option>
          <option value="enthusiastic">Enthusiastic</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          The tone of voice for generated emails
        </p>
      </div>

      {/* Keywords */}
      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
          Keywords & Skills
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          value={formData.keywords}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js, AWS, Python"
          className="input-field"
        />
        <p className="mt-1 text-sm text-gray-500">
          Key technologies and skills to highlight
        </p>
      </div>

      {/* Geography */}
      <div>
        <label htmlFor="geography" className="block text-sm font-medium text-gray-700 mb-2">
          Geographic Preferences
        </label>
        <input
          id="geography"
          name="geography"
          type="text"
          value={formData.geography}
          onChange={handleChange}
          placeholder="Remote, San Francisco, New York, Europe"
          className="input-field"
        />
        <p className="mt-1 text-sm text-gray-500">
          Locations you're interested in (leave empty for any)
        </p>
      </div>

      {/* Custom Message */}
      <div>
        <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Message (Optional)
        </label>
        <textarea
          id="customMessage"
          name="customMessage"
          value={formData.customMessage}
          onChange={handleChange}
          rows={4}
          placeholder="Add any personal message or context you'd like to include in emails..."
          className="input-field resize-none"
        />
        <p className="mt-1 text-sm text-gray-500">
          Additional information to personalize your outreach
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Context saved successfully!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Your outreach preferences have been updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">
                Failed to save context
              </p>
              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </div>
          ) : (
            'Save Context'
          )}
        </button>
      </div>
    </form>
  )
}

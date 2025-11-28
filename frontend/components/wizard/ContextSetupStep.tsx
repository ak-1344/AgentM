'use client'

import { useState, useEffect } from 'react'
import { Target, Sparkles, AlertCircle, CheckCircle, Loader, Plus, X } from 'lucide-react'
import { api } from '@/lib/api'

interface ContextSetupStepProps {
  parsedData: any
  onComplete: () => void
  onNext: () => void
}

interface PredefinedTags {
  purposes: string[]
  roles: string[]
  industries: string[]
  keywords: string[]
  locations: string[]
}

export default function ContextSetupStep({ parsedData, onComplete, onNext }: ContextSetupStepProps) {
  const [formData, setFormData] = useState({
    purpose: '',
    targetRoles: [] as string[],
    preferredIndustries: [] as string[],
    pitchTone: 'professional',
    keywords: [] as string[],
    customMessage: '',
    geography: [] as string[],
  })

  const [predefinedTags, setPredefinedTags] = useState<PredefinedTags | null>(null)
  const [loadingTags, setLoadingTags] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [inputValues, setInputValues] = useState({
    role: '',
    industry: '',
    keyword: '',
    location: ''
  })

  // Load predefined tags on mount
  useEffect(() => {
    loadPredefinedTags()
  }, [])

  const loadPredefinedTags = async () => {
    setLoadingTags(true)
    try {
      const response = await api.getPredefinedTags()
      setPredefinedTags(response.data)
    } catch (err: any) {
      console.error('Failed to load predefined tags:', err)
    } finally {
      setLoadingTags(false)
    }
  }

  const addItem = (field: 'targetRoles' | 'preferredIndustries' | 'keywords' | 'geography', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      })
    }
  }

  const removeItem = (field: 'targetRoles' | 'preferredIndustries' | 'keywords' | 'geography', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    })
  }

  const addFromTag = (field: 'targetRoles' | 'preferredIndustries' | 'keywords' | 'geography', value: string) => {
    addItem(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate purpose is selected
    if (!formData.purpose) {
      setError('Please select a purpose for using this platform')
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const payload = {
        purpose: formData.purpose,
        target_roles: formData.targetRoles,
        preferred_industries: formData.preferredIndustries,
        pitch_tone: formData.pitchTone,
        keywords: formData.keywords,
        custom_message: formData.customMessage,
        geography: formData.geography,
      }

      await api.buildContext(payload)
      setSuccess(true)
      onComplete()
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save context. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const TagInput = ({ 
    label, 
    field, 
    placeholder,
    suggestedTags 
  }: { 
    label: string
    field: 'targetRoles' | 'preferredIndustries' | 'keywords' | 'geography'
    placeholder: string
    suggestedTags?: string[]
  }) => {
    const inputKey = field === 'targetRoles' ? 'role' : 
                     field === 'preferredIndustries' ? 'industry' :
                     field === 'keywords' ? 'keyword' : 'location'
    
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        
        {/* Selected tags */}
        {formData[field].length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData[field].map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(field, index)}
                  className="ml-2 hover:text-primary-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputValues[inputKey]}
            onChange={(e) => {
              const newValue = e.target.value
              setInputValues(prev => ({ ...prev, [inputKey]: newValue }))
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const value = inputValues[inputKey]
                addItem(field, value)
                setInputValues(prev => ({ ...prev, [inputKey]: '' }))
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => {
              const value = inputValues[inputKey]
              addItem(field, value)
              setInputValues(prev => ({ ...prev, [inputKey]: '' }))
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        
        {/* Predefined suggestions */}
        {suggestedTags && suggestedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Common options (click to add):
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.slice(0, 15).map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addFromTag(field, tag)}
                  disabled={formData[field].includes(tag)}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-colors
                    ${formData[field].includes(tag)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Context</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your goals so we can personalize your outreach.
      </p>

      {loadingTags && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600">Loading options...</span>
        </div>
      )}

      {!loadingTags && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Purpose Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your purpose for using this platform? *
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select a purpose...</option>
              {predefinedTags?.purposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>

          {/* Target Roles */}
          <TagInput
            label="Target Roles"
            field="targetRoles"
            placeholder="e.g., Software Engineer"
            suggestedTags={predefinedTags?.roles}
          />

          {/* Preferred Industries */}
          <TagInput
            label="Preferred Industries"
            field="preferredIndustries"
            placeholder="e.g., FinTech"
            suggestedTags={predefinedTags?.industries}
          />

          {/* Keywords */}
          <TagInput
            label="Skills & Keywords"
            field="keywords"
            placeholder="e.g., Python, React"
            suggestedTags={predefinedTags?.keywords}
          />

          {/* Geography */}
          <TagInput
            label="Preferred Locations"
            field="geography"
            placeholder="e.g., Remote, San Francisco"
            suggestedTags={predefinedTags?.locations}
          />

          {/* Pitch Tone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Tone
            </label>
            <select
              value={formData.pitchTone}
              onChange={(e) => setFormData({ ...formData, pitchTone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="formal">Formal</option>
            </select>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              placeholder="Any specific message you want to include in your outreach..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">Context saved successfully!</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {!success && (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Context'
                )}
              </button>
            )}
            
            {success && (
              <button
                type="button"
                onClick={onNext}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2"
              >
                Continue to Email Integration →
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

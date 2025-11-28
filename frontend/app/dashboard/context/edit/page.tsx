'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { Save, Loader, AlertCircle, CheckCircle, Plus, X, Target } from 'lucide-react'
import { api } from '@/lib/api'

export default function EditContextPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingTags, setLoadingTags] = useState(false)
  
  const [formData, setFormData] = useState({
    purpose: '',
    targetRoles: [] as string[],
    preferredIndustries: [] as string[],
    pitchTone: 'professional',
    keywords: [] as string[],
    customMessage: '',
    geography: [] as string[],
    resumeParsedData: {} as Record<string, any>,
  })

  const [resumeJsonText, setResumeJsonText] = useState('')

  const [predefinedTags, setPredefinedTags] = useState<any>(null)
  const [inputValues, setInputValues] = useState({
    role: '',
    industry: '',
    keyword: '',
    location: '',
  })

  useEffect(() => {
    loadContext()
    loadPredefinedTags()
  }, [])

  const loadContext = async () => {
    try {
      setLoading(true)
      const response = await api.getContextProfile()
      if (response.data) {
        const data = response.data
        
        setFormData({
          purpose: data.purpose || '',
          targetRoles: data.target_roles || [],
          preferredIndustries: data.preferred_industries || [],
          pitchTone: data.pitch_tone || 'professional',
          keywords: data.keywords || [],
          customMessage: data.custom_message || '',
          geography: data.geography || [],
          resumeParsedData: data.resume_parsed_data || {},
        })
        
        // Initialize JSON text editor
        setResumeJsonText(JSON.stringify(data.resume_parsed_data || {}, null, 2))
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError('Failed to load context profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadPredefinedTags = async () => {
    setLoadingTags(true)
    try {
      const response = await api.getPredefinedTags()
      setPredefinedTags(response.data)
    } catch (err) {
      console.error('Failed to load predefined tags:', err)
    } finally {
      setLoadingTags(false)
    }
  }

  const addItem = (field: 'targetRoles' | 'preferredIndustries' | 'keywords' | 'geography', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }))
    }
  }

  const removeItem = (field: 'targetRoles' | 'preferredIndustries' | 'keywords' | 'geography', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const updateResumeField = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeParsedData: {
        ...prev.resumeParsedData,
        [key]: value
      }
    }))
  }

  const formatLabel = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const addNewResumeField = () => {
    const fieldName = prompt('Enter field name (e.g., "links", "certifications"):')
    if (fieldName && fieldName.trim()) {
      const cleanName = fieldName.trim().toLowerCase().replace(/\s+/g, '_')
      if (!formData.resumeParsedData[cleanName]) {
        updateResumeField(cleanName, '')
      }
    }
  }

  const removeResumeField = (key: string) => {
    const newData = { ...formData.resumeParsedData }
    delete newData[key]
    setFormData(prev => ({ ...prev, resumeParsedData: newData }))
  }

  const addArrayItem = (key: string, item: string) => {
    if (item.trim()) {
      const currentValue = formData.resumeParsedData[key]
      if (Array.isArray(currentValue)) {
        updateResumeField(key, [...currentValue, item.trim()])
      } else {
        updateResumeField(key, [item.trim()])
      }
    }
  }

  const removeArrayItem = (key: string, index: number) => {
    const currentValue = formData.resumeParsedData[key]
    if (Array.isArray(currentValue)) {
      updateResumeField(key, currentValue.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.purpose) {
      setError('Please select a purpose')
      return
    }
    
    setSaving(true)
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
        resume_parsed_data: formData.resumeParsedData,
      }

      await api.buildContext(payload)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update context')
    } finally {
      setSaving(false)
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
        
        {suggestedTags && suggestedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Common options:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.slice(0, 12).map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addItem(field, tag)}
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Context Profile</h1>
          <p className="text-gray-600 mt-2">
            Update your outreach context and preferences. Changes are saved to your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select a purpose...</option>
              {predefinedTags?.purposes?.map((purpose: string) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>

          {/* Resume Data Section - JSON Editor */}
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Resume Information (JSON)
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Edit your resume data directly as JSON. Changes are saved when you submit the form.
                </p>
              </div>
            </div>
            <div>
              <textarea
                value={resumeJsonText}
                onChange={(e) => {
                  const newValue = e.target.value
                  setResumeJsonText(newValue)
                  // Try to parse in real-time but don't break on errors
                  try {
                    const parsed = JSON.parse(newValue)
                    setFormData(prev => ({ ...prev, resumeParsedData: parsed }))
                  } catch {
                    // Invalid JSON during typing - ignore
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-white"
                rows={20}
                spellCheck={false}
                placeholder={`{
  "name": "Your Name",
  "links": {
    "LinkedIn": "https://linkedin.com/in/yourname",
    "GitHub": "https://github.com/yourname",
    "Portfolio": "https://yourportfolio.com"
  },
  "skills": ["Python", "React", "Node.js"],
  "experience_years": 5,
  "education": ["BS Computer Science, University Name"],
  "job_titles": ["Senior Software Engineer", "Full Stack Developer"],
  "achievements": ["Led team of 10", "Built scalable system"]
}`}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Links should be in format: {`{"LinkedIn": "url", "GitHub": "url"}`} (not an array)
              </p>
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Note: If you see links as an array like ["LinkedIn", "GitHub"], change it to: {`{"LinkedIn": "https://your-url", "GitHub": "https://your-url"}`}
              </p>
            </div>
          </div>

          <TagInput
            label="Target Roles"
            field="targetRoles"
            placeholder="e.g., Software Engineer"
            suggestedTags={predefinedTags?.roles}
          />

          <TagInput
            label="Preferred Industries"
            field="preferredIndustries"
            placeholder="e.g., FinTech"
            suggestedTags={predefinedTags?.industries}
          />

          <TagInput
            label="Skills & Keywords"
            field="keywords"
            placeholder="e.g., Python, React"
            suggestedTags={predefinedTags?.keywords}
          />

          <TagInput
            label="Preferred Locations"
            field="geography"
            placeholder="e.g., Remote, San Francisco"
            suggestedTags={predefinedTags?.locations}
          />

          {/* Pitch Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Tone
            </label>
            <select
              value={formData.pitchTone}
              onChange={(e) => setFormData(prev => ({ ...prev, pitchTone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="formal">Formal</option>
            </select>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={formData.customMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
              placeholder="Any specific message you want to include in your outreach..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">Context updated successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

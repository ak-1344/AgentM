'use client'

import { useState, useEffect } from 'react'
import { Mail, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { api } from '@/lib/api'

interface SmtpSetupStepProps {
  onComplete: () => void
  onSkip: () => void
}

export default function SmtpSetupStep({ onComplete, onSkip }: SmtpSetupStepProps) {
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    use_tls: true,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [hasExisting, setHasExisting] = useState(false)

  useEffect(() => {
    checkExistingConfig()
  }, [])

  const checkExistingConfig = async () => {
    try {
      const response = await api.getSmtpConfig()
      if (response.data) {
        setHasExisting(true)
        setFormData({
          smtp_host: response.data.smtp_host,
          smtp_port: response.data.smtp_port,
          smtp_user: response.data.smtp_user,
          smtp_password: '', // Don't show existing password
          use_tls: response.data.use_tls,
        })
      }
    } catch (err) {
      // No existing config
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    })
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    setError(null)

    try {
      // First save credentials
      await api.saveSmtpCredentials(formData)
      
      // Then test connection
      const response = await api.testSmtpConnection()
      setTestResult(response.data)
      
      if (response.data.success) {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Connection test failed')
      setTestResult({ success: false, message: 'Failed to connect' })
    } finally {
      setTesting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.saveSmtpCredentials(formData)
      setSuccess(true)
      onComplete()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save SMTP credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Integration</h2>
          <p className="text-gray-600 mt-2">
            Connect your email to send outreach messages. This step is optional.
          </p>
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Skip for now
        </button>
      </div>

      {hasExisting && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            You already have SMTP credentials configured. Update them below if needed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {/* SMTP Host */}
        <div>
          <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host
          </label>
          <input
            id="smtp_host"
            name="smtp_host"
            type="text"
            value={formData.smtp_host}
            onChange={handleChange}
            placeholder="smtp.gmail.com"
            className="input-field"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Gmail: smtp.gmail.com | Outlook: smtp-mail.outlook.com
          </p>
        </div>

        {/* SMTP Port */}
        <div>
          <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Port
          </label>
          <input
            id="smtp_port"
            name="smtp_port"
            type="number"
            value={formData.smtp_port}
            onChange={handleChange}
            placeholder="587"
            className="input-field"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Common ports: 587 (TLS), 465 (SSL), 25 (unsecured)
          </p>
        </div>

        {/* SMTP User */}
        <div>
          <label htmlFor="smtp_user" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="smtp_user"
            name="smtp_user"
            type="email"
            value={formData.smtp_user}
            onChange={handleChange}
            placeholder="your-email@gmail.com"
            className="input-field"
            required
          />
        </div>

        {/* SMTP Password */}
        <div>
          <label htmlFor="smtp_password" className="block text-sm font-medium text-gray-700 mb-2">
            Password / App Password
          </label>
          <div className="relative">
            <input
              id="smtp_password"
              name="smtp_password"
              type={showPassword ? 'text' : 'password'}
              value={formData.smtp_password}
              onChange={handleChange}
              placeholder={hasExisting ? 'Leave empty to keep current password' : 'Enter password or app password'}
              className="input-field pr-10"
              required={!hasExisting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            For Gmail, use an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">App Password</a>
          </p>
        </div>

        {/* Use TLS */}
        <div className="flex items-center">
          <input
            id="use_tls"
            name="use_tls"
            type="checkbox"
            checked={formData.use_tls}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="use_tls" className="ml-2 text-sm text-gray-700">
            Use TLS (recommended)
          </label>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-4 border rounded-lg flex items-start gap-3 ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                testResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {testResult.success ? 'Connection successful!' : 'Connection failed'}
              </p>
              <p className={`text-xs mt-1 ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !testResult && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">SMTP credentials saved successfully!</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !formData.smtp_host || !formData.smtp_user}
            className="btn-secondary flex-1"
          >
            {testing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                Testing...
              </span>
            ) : (
              'Test Connection'
            )}
          </button>

          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary flex-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : success ? (
              'Saved Successfully'
            ) : (
              'Save & Finish'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

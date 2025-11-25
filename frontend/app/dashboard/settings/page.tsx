'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import { Settings as SettingsIcon, Mail, TestTube, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

export default function SettingsPage() {
  const [smtpData, setSmtpData] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    useTls: true,
  })

  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [testSuccess, setTestSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setSmtpData({
      ...smtpData,
      [e.target.name]: value,
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await api.saveSmtpCredentials({
        smtp_host: smtpData.smtpHost,
        smtp_port: parseInt(smtpData.smtpPort),
        smtp_user: smtpData.smtpUser,
        smtp_password: smtpData.smtpPassword,
        use_tls: smtpData.useTls,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save SMTP credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setError(null)
    setTestSuccess(false)

    try {
      await api.testSmtpConnection()
      setTestSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'SMTP connection test failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Settings
            </h1>
          </div>
          <p className="text-gray-600">
            Configure your SMTP settings to send emails from your account
          </p>
        </div>

        {/* SMTP Configuration */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Email Configuration (SMTP)
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Provider Preset */}
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                Email Provider
              </label>
              <select
                id="provider"
                className="input-field"
                onChange={(e) => {
                  if (e.target.value === 'gmail') {
                    setSmtpData({ ...smtpData, smtpHost: 'smtp.gmail.com', smtpPort: '587' })
                  } else if (e.target.value === 'outlook') {
                    setSmtpData({ ...smtpData, smtpHost: 'smtp.office365.com', smtpPort: '587' })
                  }
                }}
              >
                <option value="">Select a provider</option>
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook/Office365</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* SMTP Host */}
            <div>
              <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                id="smtpHost"
                name="smtpHost"
                type="text"
                value={smtpData.smtpHost}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="smtp.gmail.com"
              />
            </div>

            {/* SMTP Port */}
            <div>
              <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                id="smtpPort"
                name="smtpPort"
                type="number"
                value={smtpData.smtpPort}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="587"
              />
            </div>

            {/* SMTP User */}
            <div>
              <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="smtpUser"
                name="smtpUser"
                type="email"
                value={smtpData.smtpUser}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="your-email@gmail.com"
              />
            </div>

            {/* SMTP Password */}
            <div>
              <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-2">
                App Password
              </label>
              <input
                id="smtpPassword"
                name="smtpPassword"
                type="password"
                value={smtpData.smtpPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••••••••••"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use an app-specific password, not your regular email password.{' '}
                <a href="/help/smtp-setup" className="text-primary-600 hover:text-primary-700">
                  How to generate?
                </a>
              </p>
            </div>

            {/* Use TLS */}
            <div className="flex items-center gap-2">
              <input
                id="useTls"
                name="useTls"
                type="checkbox"
                checked={smtpData.useTls}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="useTls" className="text-sm text-gray-700">
                Use TLS (Recommended)
              </label>
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      SMTP credentials saved successfully!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Your email configuration has been encrypted and stored securely.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Test Success Message */}
            {testSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Connection test successful!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Your SMTP settings are working correctly.
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
                      Error
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
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
                  'Save Credentials'
                )}
              </button>

              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !smtpData.smtpUser || !smtpData.smtpPassword}
                className="btn-secondary flex items-center gap-2"
              >
                {testing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Guide */}
        <div className="card bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            🔐 Important: App Passwords
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            For security reasons, most email providers require you to use an "App Password" 
            instead of your regular password when connecting third-party applications.
          </p>
          <div className="space-y-2 text-sm text-yellow-800">
            <p><strong>Gmail:</strong> Enable 2FA, then generate an app password at 
              <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                myaccount.google.com/apppasswords
              </a>
            </p>
            <p><strong>Outlook:</strong> Go to Security settings and generate an app password</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

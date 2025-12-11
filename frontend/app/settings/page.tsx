'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { 
    Settings as SettingsIcon, 
    User, 
    Lock, 
    Mail, 
    AlertTriangle, 
    Save, 
    Loader2, 
    Shield, 
    RefreshCw,
    Trash2,
    LogOut,
    Phone,
    Edit2
} from 'lucide-react'
import { api } from '@/lib/api'

export default function SettingsPage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [savingProfile, setSavingProfile] = useState(false)
    
    // Profile state
    const [profileData, setProfileData] = useState({
        full_name: '',
        phone_number: '',
    })
    
    // SMTP state
    const [smtpConfig, setSmtpConfig] = useState({
        host: '',
        port: 587,
        username: '',
        password: '',
        use_tls: true,
    })
    
    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        loadUserProfile()
        loadSmtpConfig()
    }, [])

    const loadUserProfile = async () => {
        try {
            const response = await api.getUserProfile()
            if (response?.data) {
                setProfileData({
                    full_name: response.data.full_name || '',
                    phone_number: response.data.phone_number || '',
                })
            }
        } catch (error) {
            console.error('Failed to load user profile:', error)
        }
    }

    const loadSmtpConfig = async () => {
        try {
            const response = await api.getSmtpConfig()
            if (response?.data) {
                setSmtpConfig({
                    host: response.data.host || '',
                    port: response.data.port || 587,
                    username: response.data.username || '',
                    password: '',
                    use_tls: response.data.use_tls !== false,
                })
            }
        } catch (error) {
            console.error('Failed to load SMTP config:', error)
        }
    }

    const handleSaveProfile = async () => {
        try {
            setSavingProfile(true)
            await api.updateUserProfile(profileData)
            alert('Profile updated successfully!')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Failed to update profile')
        } finally {
            setSavingProfile(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match')
            return
        }
        
        if (passwordData.newPassword.length < 8) {
            alert('Password must be at least 8 characters')
            return
        }

        try {
            setLoading(true)
            // Note: Implement password change via Supabase
            alert('Password change feature coming soon!')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Failed to change password')
        } finally {
            setLoading(false)
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        }
    }

    const handleSaveSmtp = async () => {
        try {
            setLoading(true)
            await api.saveSmtpCredentials(smtpConfig)
            alert('SMTP settings saved successfully!')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Failed to save SMTP settings')
        } finally {
            setLoading(false)
        }
    }

    const handleTestSmtp = async () => {
        try {
            setLoading(true)
            await api.testSmtpConnection()
            alert('SMTP connection successful!')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'SMTP connection failed')
        } finally {
            setLoading(false)
        }
    }

    const handleResetContext = async () => {
        if (!confirm('Are you sure you want to re-run the onboarding wizard? Your current context will be preserved until you complete the wizard.')) {
            return
        }
        router.push('/setup')
    }

    const handleResetData = async () => {
        const confirmation = prompt('Type "RESET" to confirm data reset (this will clear all emails and activity):')
        if (confirmation !== 'RESET') {
            return
        }

        try {
            setLoading(true)
            // Note: Implement data reset endpoint
            alert('Data reset feature coming soon!')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Failed to reset data')
        } finally {
            setLoading(false)
        }
    }

    const handleDisconnectSmtp = async () => {
        if (!confirm('Are you sure you want to disconnect SMTP? You will not be able to send emails until you reconnect.')) {
            return
        }

        try {
            setLoading(true)
            setSmtpConfig({
                host: '',
                port: 587,
                username: '',
                password: '',
                use_tls: true,
            })
            await api.saveSmtpCredentials({
                host: '',
                port: 587,
                username: '',
                password: '',
                use_tls: true,
            })
            alert('SMTP disconnected successfully!')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Failed to disconnect SMTP')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:')
        if (confirmation !== 'DELETE') {
            return
        }

        try {
            setLoading(true)
            await api.deleteUserProfile()
            await signOut()
            router.push('/login')
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Failed to delete account')
            setLoading(false)
        }
    }

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="w-8 h-8 text-primary-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
                        </div>
                    </div>
                </div>

                {/* 1. Basic Info */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profileData.full_name}
                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                placeholder="Enter your full name"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input-field bg-gray-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={profileData.phone_number}
                                onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                                className="input-field"
                            />
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="btn-primary flex items-center gap-2"
                        >
                            {savingProfile ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* 2. Security */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className="input-field"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                                    <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                                </div>
                                <button className="btn-outline flex items-center gap-2" disabled>
                                    <Shield className="w-4 h-4" />
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. SMTP Settings */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-900">SMTP Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Provider (SMTP Host)
                                </label>
                                <input
                                    type="text"
                                    value={smtpConfig.host}
                                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                                    placeholder="smtp.gmail.com"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Port
                                </label>
                                <input
                                    type="number"
                                    value={smtpConfig.port}
                                    onChange={(e) => setSmtpConfig({ ...smtpConfig, port: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={smtpConfig.username}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                                placeholder="your-email@gmail.com"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                App Password
                            </label>
                            <input
                                type="password"
                                value={smtpConfig.password}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                                placeholder="Enter app password"
                                className="input-field"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use an app-specific password for Gmail, Outlook, etc.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="use_tls"
                                checked={smtpConfig.use_tls}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, use_tls: e.target.checked })}
                                className="rounded"
                            />
                            <label htmlFor="use_tls" className="text-sm font-medium text-gray-700">
                                Use TLS/SSL
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveSmtp}
                                disabled={loading}
                                className="btn-primary flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save SMTP
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleTestSmtp}
                                disabled={loading}
                                className="btn-secondary"
                            >
                                Test Connection
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Context Reset/Change */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <RefreshCw className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-900">Context & Preferences</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Re-run Onboarding Wizard</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Update your preferences by going through the setup wizard again. You can modify your outreach type, tone, and other settings.
                            </p>
                            <button
                                onClick={handleResetContext}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Start Setup Wizard
                            </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Edit Context JSON</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Advanced users can directly edit the context profile JSON.
                            </p>
                            <button
                                onClick={() => router.push('/profile')}
                                className="btn-outline flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Open Context Editor
                            </button>
                        </div>
                    </div>
                </div>

                {/* 5. Danger Zone */}
                <div className="card border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-red-900 mb-2">Disconnect SMTP</h3>
                            <p className="text-sm text-red-700 mb-3">
                                Remove your email configuration. You will not be able to send emails until you reconnect.
                            </p>
                            <button
                                onClick={handleDisconnectSmtp}
                                disabled={loading}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                Disconnect SMTP
                            </button>
                        </div>

                        <div className="pt-4 border-t border-red-200">
                            <h3 className="font-medium text-red-900 mb-2">Reset All Data</h3>
                            <p className="text-sm text-red-700 mb-3">
                                Clear all emails, activity logs, and generated content. Your profile and context will be preserved.
                            </p>
                            <button
                                onClick={handleResetData}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Reset Data
                            </button>
                        </div>

                        <div className="pt-4 border-t border-red-200">
                            <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                            <p className="text-sm text-red-700 mb-3">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* 6. Sign Out */}
                <div className="card bg-gray-50 border-gray-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Sign Out</h3>
                            <p className="text-sm text-gray-600 mt-1">Sign out of your account on this device</p>
                        </div>
                        <button
                            onClick={() => {
                                signOut()
                                router.push('/login')
                            }}
                            className="btn-outline flex items-center gap-2 text-gray-700 hover:text-gray-900"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

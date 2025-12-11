'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import ResumeViewer from '@/components/profile/ResumeViewer'
import ContextSummary from '@/components/profile/ContextSummary'
import PreferencesPanel from '@/components/profile/PreferencesPanel'
import JSONEditor from '@/components/JSONEditor'
import { api } from '@/lib/api'
import { Code } from 'lucide-react'

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [resumeData, setResumeData] = useState<any>(null)
    const [contextData, setContextData] = useState<any>(null)
    const [editingResume, setEditingResume] = useState(false)
    const [editingContext, setEditingContext] = useState(false)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (user) {
            loadProfileData()
        }
    }, [user])

    const loadProfileData = async () => {
        try {
            setLoading(true)

            const [resumeRes, contextRes] = await Promise.allSettled([
                api.getCurrentResume(),
                api.getContextProfile(),
            ])

            if (resumeRes.status === 'fulfilled' && resumeRes.value?.data) {
                setResumeData(resumeRes.value.data)
            }

            if (contextRes.status === 'fulfilled' && contextRes.value?.data) {
                setContextData(contextRes.value.data)
            }
        } catch (error) {
            console.error('Error loading profile data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSavePreferences = async (preferences: any) => {
        try {
            await api.buildContext(preferences)

            // Reload context data
            const response = await api.getContextProfile()
            if (response?.data) {
                setContextData(response.data)
            }
        } catch (error: any) {
            console.error('Error saving preferences:', error)
            throw new Error(error.response?.data?.detail || 'Failed to save preferences')
        }
    }

    const handleSaveResumeJSON = async (data: any) => {
        try {
            // Update resume data via API
            await api.updateUserProfile({ resume_data: data })

            // Reload resume data
            const response = await api.getCurrentResume()
            if (response?.data) {
                setResumeData(response.data)
            }
        } catch (error: any) {
            console.error('Error saving resume JSON:', error)
            throw new Error(error.response?.data?.detail || 'Failed to save resume data')
        }
    }

    const handleSaveContextJSON = async (data: any) => {
        try {
            // Update context data via API
            await api.buildContext(data)

            // Reload context data
            const response = await api.getContextProfile()
            if (response?.data) {
                setContextData(response.data)
            }
        } catch (error: any) {
            console.error('Error saving context JSON:', error)
            throw new Error(error.response?.data?.detail || 'Failed to save context data')
        }
    }

    if (authLoading || loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Profile & Context
                        </h1>
                        <p className="text-gray-600">
                            Your AI agent's profile and preferences
                        </p>
                    </div>

                    {/* JSON Edit Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditingResume(true)}
                            disabled={!resumeData}
                            className="btn-outline flex items-center gap-2"
                        >
                            <Code className="w-4 h-4" />
                            Edit Resume JSON
                        </button>
                        <button
                            onClick={() => setEditingContext(true)}
                            disabled={!contextData}
                            className="btn-outline flex items-center gap-2"
                        >
                            <Code className="w-4 h-4" />
                            Edit Context JSON
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Resume */}
                    <div className="space-y-6">
                        <ResumeViewer resumeData={resumeData} loading={loading} />
                    </div>

                    {/* Right Column - Context & Preferences */}
                    <div className="space-y-6">
                        <ContextSummary contextData={contextData} loading={loading} />
                        <PreferencesPanel
                            initialData={contextData}
                            onSave={handleSavePreferences}
                        />
                    </div>
                </div>
            </div>

            {/* JSON Editors */}
            {editingResume && resumeData && (
                <JSONEditor
                    title="Edit Resume Data (JSON)"
                    data={resumeData}
                    onSave={handleSaveResumeJSON}
                    onClose={() => setEditingResume(false)}
                />
            )}

            {editingContext && contextData && (
                <JSONEditor
                    title="Edit Context Data (JSON)"
                    data={contextData}
                    onSave={handleSaveContextJSON}
                    onClose={() => setEditingContext(false)}
                />
            )}
        </AppLayout>
    )
}

'use client'

import { useState } from 'react'
import { Settings, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface PreferencesData {
    excluded_industries?: string[]
    minimum_relevance_score?: number
    auto_approve_threshold?: number
    email_frequency?: 'immediate' | 'daily' | 'weekly'
    ai_filters_enabled?: boolean
}

interface PreferencesPanelProps {
    initialData: PreferencesData | null
    onSave: (data: PreferencesData) => Promise<void>
}

export default function PreferencesPanel({ initialData, onSave }: PreferencesPanelProps) {
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [excludedIndustries, setExcludedIndustries] = useState<string[]>(
        initialData?.excluded_industries || []
    )
    const [newIndustry, setNewIndustry] = useState('')
    const [relevanceScore, setRelevanceScore] = useState(
        initialData?.minimum_relevance_score || 70
    )
    const [autoApproveThreshold, setAutoApproveThreshold] = useState(
        initialData?.auto_approve_threshold || 90
    )
    const [emailFrequency, setEmailFrequency] = useState<'immediate' | 'daily' | 'weekly'>(
        initialData?.email_frequency || 'immediate'
    )
    const [aiFiltersEnabled, setAiFiltersEnabled] = useState(
        initialData?.ai_filters_enabled !== false
    )

    const handleAddIndustry = () => {
        if (newIndustry.trim() && !excludedIndustries.includes(newIndustry.trim())) {
            setExcludedIndustries([...excludedIndustries, newIndustry.trim()])
            setNewIndustry('')
        }
    }

    const handleRemoveIndustry = (industry: string) => {
        setExcludedIndustries(excludedIndustries.filter((i) => i !== industry))
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
            await onSave({
                excluded_industries: excludedIndustries,
                minimum_relevance_score: relevanceScore,
                auto_approve_threshold: autoApproveThreshold,
                email_frequency: emailFrequency,
                ai_filters_enabled: aiFiltersEnabled,
            })

            setSuccess(true)
            setEditing(false)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message || 'Failed to save preferences')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="card">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Settings className="w-6 h-6 text-gray-700" />
                    <h2 className="text-2xl font-bold text-gray-900">AI Preferences</h2>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Excluded Industries */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Excluded Industries
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        AI will not suggest companies from these industries
                    </p>
                    {editing ? (
                        <>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newIndustry}
                                    onChange={(e) => setNewIndustry(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddIndustry()}
                                    placeholder="Add industry to exclude..."
                                    className="input-field flex-1"
                                />
                                <button onClick={handleAddIndustry} className="btn-secondary">
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {excludedIndustries.map((industry) => (
                                    <span
                                        key={industry}
                                        className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full flex items-center gap-1"
                                    >
                                        {industry}
                                        <button
                                            onClick={() => handleRemoveIndustry(industry)}
                                            className="hover:text-red-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {excludedIndustries.length > 0 ? (
                                excludedIndustries.map((industry) => (
                                    <span
                                        key={industry}
                                        className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                                    >
                                        {industry}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">None</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Minimum Relevance Score */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Minimum Relevance Score: {relevanceScore}%
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        Only show companies with relevance score above this threshold
                    </p>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={relevanceScore}
                        onChange={(e) => setRelevanceScore(parseInt(e.target.value))}
                        disabled={!editing}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Auto-Approve Threshold */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Auto-Approve Threshold: {autoApproveThreshold}%
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        Automatically approve emails with personalization score above this threshold
                    </p>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={autoApproveThreshold}
                        onChange={(e) => setAutoApproveThreshold(parseInt(e.target.value))}
                        disabled={!editing}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Email Frequency */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Sending Frequency
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        How often should approved emails be sent
                    </p>
                    <select
                        value={emailFrequency}
                        onChange={(e) => setEmailFrequency(e.target.value as any)}
                        disabled={!editing}
                        className="input-field"
                    >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily Batch</option>
                        <option value="weekly">Weekly Batch</option>
                    </select>
                </div>

                {/* AI Filters */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="font-semibold text-gray-900">Enable AI Filters</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Use AI to filter out low-quality or irrelevant companies
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={aiFiltersEnabled}
                            onChange={(e) => setAiFiltersEnabled(e.target.checked)}
                            disabled={!editing}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700">Preferences saved successfully!</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            {editing && (
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setEditing(false)}
                        className="btn-secondary flex-1"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Preferences
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}

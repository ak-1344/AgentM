'use client'

import { User, Briefcase, Building2, MapPin, Megaphone, MessageSquare, Target, XCircle } from 'lucide-react'

interface ContextData {
    experience_level?: string
    preferred_roles?: string[]
    preferred_industries?: string[]
    location_preferences?: string[]
    outreach_type?: string
    tone_preference?: string
    excluded_industries?: string[]
    minimum_relevance_score?: number
}

interface ContextSummaryProps {
    contextData: ContextData | null
    loading?: boolean
}

const EXPERIENCE_LABELS: Record<string, string> = {
    entry: 'Entry Level (0-2 years)',
    mid: 'Mid Level (3-5 years)',
    senior: 'Senior (6-10 years)',
    lead: 'Lead/Principal (10+ years)',
    executive: 'Executive/C-Level',
}

const OUTREACH_TYPE_LABELS: Record<string, string> = {
    job_hunting: 'Job Hunting',
    freelancing: 'Freelancing Outreach',
    sponsorship: 'Sponsorship Outreach',
    custom: 'Custom Use Case',
}

const TONE_LABELS: Record<string, string> = {
    formal: 'Formal',
    friendly: 'Friendly',
    assertive: 'Assertive',
    humble: 'Humble',
    direct: 'Direct',
}

export default function ContextSummary({ contextData, loading = false }: ContextSummaryProps) {
    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    if (!contextData) {
        return (
            <div className="card">
                <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No context profile configured</p>
                    <a href="/setup" className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        Complete setup →
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Context Profile</h2>
                <a
                    href="/setup"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    Edit →
                </a>
            </div>

            <div className="space-y-6">
                {/* Experience Level */}
                {contextData.experience_level && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Experience Level
                        </h3>
                        <p className="text-lg text-gray-900">
                            {EXPERIENCE_LABELS[contextData.experience_level] || contextData.experience_level}
                        </p>
                    </div>
                )}

                {/* Preferred Roles */}
                {contextData.preferred_roles && contextData.preferred_roles.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Target Roles
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {contextData.preferred_roles.map((role, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Preferred Industries */}
                {contextData.preferred_industries && contextData.preferred_industries.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Preferred Industries
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {contextData.preferred_industries.map((industry, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                                >
                                    {industry}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Location Preferences */}
                {contextData.location_preferences && contextData.location_preferences.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location Preferences
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {contextData.location_preferences.map((location, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                                >
                                    {location}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Outreach Type */}
                {contextData.outreach_type && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <Megaphone className="w-4 h-4" />
                            Outreach Type
                        </h3>
                        <p className="text-lg text-gray-900">
                            {OUTREACH_TYPE_LABELS[contextData.outreach_type] || contextData.outreach_type}
                        </p>
                    </div>
                )}

                {/* Communication Tone */}
                {contextData.tone_preference && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Communication Tone
                        </h3>
                        <p className="text-lg text-gray-900">
                            {TONE_LABELS[contextData.tone_preference] || contextData.tone_preference}
                        </p>
                    </div>
                )}

                {/* Excluded Industries */}
                {contextData.excluded_industries && contextData.excluded_industries.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Excluded Industries
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {contextData.excluded_industries.map((industry, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                                >
                                    {industry}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Minimum Relevance Score */}
                {contextData.minimum_relevance_score !== undefined && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Minimum Relevance Score
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full"
                                    style={{ width: `${contextData.minimum_relevance_score}%` }}
                                ></div>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">
                                {contextData.minimum_relevance_score}%
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

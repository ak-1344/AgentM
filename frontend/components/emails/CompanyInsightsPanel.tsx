'use client'

import { Building2, MapPin, Users, DollarSign, TrendingUp, Globe, Calendar, Award } from 'lucide-react'

interface CompanyInsights {
    name: string
    industry?: string
    location?: string
    size?: string
    revenue?: string
    founded?: string
    website?: string
    description?: string
    recentNews?: string[]
    keyPeople?: Array<{
        name: string
        role: string
    }>
    relevanceScore?: number
}

interface CompanyInsightsPanelProps {
    insights: CompanyInsights | null
    loading?: boolean
}

export default function CompanyInsightsPanel({ insights, loading = false }: CompanyInsightsPanelProps) {
    if (loading) {
        return (
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    if (!insights) {
        return (
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-6 text-center">
                <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No company insights available</p>
            </div>
        )
    }

    return (
        <div className="border border-blue-200 rounded-lg bg-blue-50">
            <div className="p-4 border-b border-blue-200 bg-blue-100">
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Company Insights</h3>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Company Name */}
                <div>
                    <h4 className="text-lg font-bold text-gray-900">{insights.name}</h4>
                    {insights.description && (
                        <p className="text-sm text-gray-600 mt-1">{insights.description}</p>
                    )}
                </div>

                {/* Quick Facts Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {insights.industry && (
                        <div className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Industry</p>
                                <p className="text-sm font-medium text-gray-900">{insights.industry}</p>
                            </div>
                        </div>
                    )}

                    {insights.location && (
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-sm font-medium text-gray-900">{insights.location}</p>
                            </div>
                        </div>
                    )}

                    {insights.size && (
                        <div className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Company Size</p>
                                <p className="text-sm font-medium text-gray-900">{insights.size}</p>
                            </div>
                        </div>
                    )}

                    {insights.revenue && (
                        <div className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Revenue</p>
                                <p className="text-sm font-medium text-gray-900">{insights.revenue}</p>
                            </div>
                        </div>
                    )}

                    {insights.founded && (
                        <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Founded</p>
                                <p className="text-sm font-medium text-gray-900">{insights.founded}</p>
                            </div>
                        </div>
                    )}

                    {insights.website && (
                        <div className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Website</p>
                                <a
                                    href={insights.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate block"
                                >
                                    {insights.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Relevance Score */}
                {insights.relevanceScore !== undefined && (
                    <div className="pt-3 border-t border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">Relevance Score</span>
                            <span className="text-sm font-bold text-blue-600">{insights.relevanceScore}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${insights.relevanceScore}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Key People */}
                {insights.keyPeople && insights.keyPeople.length > 0 && (
                    <div className="pt-3 border-t border-blue-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Key People</p>
                        <div className="space-y-1">
                            {insights.keyPeople.map((person, idx) => (
                                <div key={idx} className="text-sm">
                                    <span className="font-medium text-gray-900">{person.name}</span>
                                    <span className="text-gray-500"> • {person.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent News */}
                {insights.recentNews && insights.recentNews.length > 0 && (
                    <div className="pt-3 border-t border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <p className="text-xs font-medium text-gray-700">Recent News</p>
                        </div>
                        <ul className="space-y-1">
                            {insights.recentNews.map((news, idx) => (
                                <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{news}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

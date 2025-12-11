'use client'

import { Lightbulb, TrendingUp, Target, Sparkles } from 'lucide-react'

interface Recommendation {
    id: string
    type: 'tip' | 'insight' | 'suggestion'
    message: string
    action?: {
        label: string
        href: string
    }
}

interface RecommendationsProps {
    recommendations: Recommendation[]
    loading?: boolean
}

const RECOMMENDATION_CONFIG = {
    tip: {
        icon: Lightbulb,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
    },
    insight: {
        icon: TrendingUp,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
    suggestion: {
        icon: Target,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
    },
}

export default function Recommendations({ recommendations, loading = false }: RecommendationsProps) {
    if (loading) {
        return (
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">AI Recommendations</h2>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-3 border rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (recommendations.length === 0) {
        return (
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">AI Recommendations</h2>
                <div className="text-center py-6">
                    <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recommendations yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                        AI will provide insights as you use the platform
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
            </div>

            <div className="space-y-3">
                {recommendations.map((rec) => {
                    const config = RECOMMENDATION_CONFIG[rec.type]
                    const Icon = config.icon

                    return (
                        <div
                            key={rec.id}
                            className={`p-4 border rounded-lg ${config.bgColor} ${config.borderColor}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 p-2 rounded-lg bg-white`}>
                                    <Icon className={`w-4 h-4 ${config.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">{rec.message}</p>
                                    {rec.action && (
                                        <a
                                            href={rec.action.href}
                                            className={`inline-block mt-2 text-xs font-medium ${config.color} hover:underline`}
                                        >
                                            {rec.action.label} →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

'use client'

import { Clock, Mail, FileText, CheckCircle, XCircle, Zap, Building2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ActivityEvent {
    id: string
    type: 'scan' | 'draft' | 'sent' | 'approved' | 'rejected'
    message: string
    timestamp: string
    metadata?: {
        count?: number
        company?: string
        email?: string
    }
}

interface ActivityTimelineProps {
    events: ActivityEvent[]
    loading?: boolean
}

const EVENT_CONFIG = {
    scan: {
        icon: Zap,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    draft: {
        icon: FileText,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    sent: {
        icon: Mail,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
    approved: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
    rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
    },
}

export default function ActivityTimeline({ events, loading = false }: ActivityTimelineProps) {
    if (loading) {
        return (
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (events.length === 0) {
        return (
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
                <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No activity yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Start an outreach scan to see activity here
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Activity Timeline</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View All
                </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {events.map((event, index) => {
                    const config = EVENT_CONFIG[event.type]
                    const Icon = config.icon

                    return (
                        <div key={event.id} className="flex gap-3">
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium">
                                    {event.message}
                                </p>
                                {event.metadata?.company && (
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        <Building2 className="w-3 h-3 inline mr-1" />
                                        {event.metadata.company}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                                </p>
                            </div>

                            {/* Count Badge (if applicable) */}
                            {event.metadata?.count && (
                                <div className="flex-shrink-0">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {event.metadata.count}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

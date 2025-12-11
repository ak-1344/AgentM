'use client'

import { Mail, Send, Eye, XCircle, TrendingUp } from 'lucide-react'

interface KPIData {
    newMails: number
    mailsSent: number
    underReview: number
    rejected: number
}

interface KPICardsProps {
    data: KPIData
    loading?: boolean
}

const KPI_CONFIG = [
    {
        key: 'newMails',
        label: 'New Mails',
        icon: Mail,
        color: 'blue',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-700',
    },
    {
        key: 'mailsSent',
        label: 'Mails Sent',
        icon: Send,
        color: 'green',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        textColor: 'text-green-700',
    },
    {
        key: 'underReview',
        label: 'Under Review',
        icon: Eye,
        color: 'amber',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600',
        textColor: 'text-amber-700',
    },
    {
        key: 'rejected',
        label: 'Rejected',
        icon: XCircle,
        color: 'red',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600',
        textColor: 'text-red-700',
    },
]

export default function KPICards({ data, loading = false }: KPICardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KPI_CONFIG.map((kpi) => {
                const Icon = kpi.icon
                const value = data[kpi.key as keyof KPIData]

                return (
                    <div
                        key={kpi.key}
                        className="card hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {kpi.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {value.toLocaleString()}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                                <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                            </div>
                        </div>

                        {/* Optional: Add trend indicator */}
                        <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
                            <TrendingUp className="w-3 h-3" />
                            <span>vs last week</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

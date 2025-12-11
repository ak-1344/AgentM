'use client'

import { FileText, User, Mail, Zap, CheckCircle, XCircle, Clock } from 'lucide-react'

interface StatusData {
    resumeUploaded: boolean
    contextComplete: boolean
    smtpConnected: boolean
    aiScanStatus: 'idle' | 'processing' | 'error'
}

interface StatusPanelProps {
    status: StatusData
    loading?: boolean
}

const STATUS_ITEMS = [
    {
        key: 'resumeUploaded',
        label: 'Resume',
        icon: FileText,
        trueText: 'Uploaded',
        falseText: 'Missing',
    },
    {
        key: 'contextComplete',
        label: 'Context',
        icon: User,
        trueText: 'Complete',
        falseText: 'Incomplete',
    },
    {
        key: 'smtpConnected',
        label: 'SMTP',
        icon: Mail,
        trueText: 'Connected',
        falseText: 'Not Connected',
    },
]

const AI_SCAN_STATUS_CONFIG = {
    idle: {
        icon: Clock,
        text: 'Idle',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
    },
    processing: {
        icon: Zap,
        text: 'Processing',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    error: {
        icon: XCircle,
        text: 'Error',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
    },
}

export default function StatusPanel({ status, loading = false }: StatusPanelProps) {
    if (loading) {
        return (
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const aiScanConfig = AI_SCAN_STATUS_CONFIG[status.aiScanStatus]
    const AiScanIcon = aiScanConfig.icon

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>

            <div className="space-y-3">
                {/* Resume, Context, SMTP Status */}
                {STATUS_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isComplete = status[item.key as keyof Omit<StatusData, 'aiScanStatus'>]

                    return (
                        <div
                            key={item.key}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-gray-200'}`}>
                                    <Icon className={`w-4 h-4 ${isComplete ? 'text-green-600' : 'text-gray-400'}`} />
                                </div>
                                <span className="font-medium text-gray-900">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isComplete ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-700">{item.trueText}</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-500">{item.falseText}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })}

                {/* AI Scan Queue Status */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${aiScanConfig.bgColor}`}>
                            <AiScanIcon className={`w-4 h-4 ${aiScanConfig.color}`} />
                        </div>
                        <span className="font-medium text-gray-900">AI Scan Queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${aiScanConfig.color}`}>
                            {aiScanConfig.text}
                        </span>
                        {status.aiScanStatus === 'processing' && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Link */}
            {(!status.resumeUploaded || !status.contextComplete) && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <strong>⚠️ Setup incomplete.</strong>{' '}
                        <a href="/setup" className="underline hover:text-amber-900">
                            Complete your setup
                        </a>{' '}
                        to start using Agent M.
                    </p>
                </div>
            )}
        </div>
    )
}

'use client'

import { useState } from 'react'
import { CheckCircle, FileText, User, Megaphone, MessageSquare, Mail, Loader2 } from 'lucide-react'

interface ReviewStepProps {
    setupData: {
        resumeId: string | null
        parsedData: any
        basicDetails: any
        outreachType: string | null
        toneStyle: string | null
        smtpConfigured: boolean
    }
    onFinish: () => void
    onBack: () => void
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

const EXPERIENCE_LABELS: Record<string, string> = {
    entry: 'Entry Level (0-2 years)',
    mid: 'Mid Level (3-5 years)',
    senior: 'Senior (6-10 years)',
    lead: 'Lead/Principal (10+ years)',
    executive: 'Executive/C-Level',
}

export default function ReviewStep({ setupData, onFinish, onBack }: ReviewStepProps) {
    const [finishing, setFinishing] = useState(false)

    const handleFinish = async () => {
        setFinishing(true)
        try {
            await onFinish()
        } catch (error) {
            console.error('Error finishing setup:', error)
            setFinishing(false)
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Finish</h2>
            <p className="text-gray-600 mb-6">
                Review your setup details before finishing. You can always update these later.
            </p>

            <div className="space-y-4 mb-6">
                {/* Resume */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Resume</h3>
                            {setupData.parsedData ? (
                                <div className="text-sm text-gray-600 space-y-1">
                                    {setupData.parsedData.name && (
                                        <p><strong>Name:</strong> {setupData.parsedData.name}</p>
                                    )}
                                    {setupData.parsedData.skills && (
                                        <p><strong>Skills:</strong> {setupData.parsedData.skills.slice(0, 5).join(', ')}
                                            {setupData.parsedData.skills.length > 5 && ` +${setupData.parsedData.skills.length - 5} more`}
                                        </p>
                                    )}
                                    {setupData.parsedData.experience_years && (
                                        <p><strong>Experience:</strong> {setupData.parsedData.experience_years} years</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Resume uploaded and parsed</p>
                            )}
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                </div>

                {/* Basic Details */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Basic Details</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                {setupData.basicDetails?.experience_level && (
                                    <p><strong>Experience:</strong> {EXPERIENCE_LABELS[setupData.basicDetails.experience_level]}</p>
                                )}
                                {setupData.basicDetails?.preferred_roles && setupData.basicDetails.preferred_roles.length > 0 && (
                                    <p><strong>Roles:</strong> {setupData.basicDetails.preferred_roles.join(', ')}</p>
                                )}
                                {setupData.basicDetails?.preferred_industries && setupData.basicDetails.preferred_industries.length > 0 && (
                                    <p><strong>Industries:</strong> {setupData.basicDetails.preferred_industries.join(', ')}</p>
                                )}
                                {setupData.basicDetails?.location_preferences && setupData.basicDetails.location_preferences.length > 0 && (
                                    <p><strong>Locations:</strong> {setupData.basicDetails.location_preferences.join(', ')}</p>
                                )}
                            </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                </div>

                {/* Outreach Type */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Megaphone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Outreach Type</h3>
                            <p className="text-sm text-gray-600">
                                {setupData.outreachType ? OUTREACH_TYPE_LABELS[setupData.outreachType] : 'Not set'}
                            </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                </div>

                {/* Tone & Style */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Communication Tone</h3>
                            <p className="text-sm text-gray-600">
                                {setupData.toneStyle ? TONE_LABELS[setupData.toneStyle] : 'Not set'}
                            </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                </div>

                {/* SMTP */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${setupData.smtpConfigured ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Mail className={`w-5 h-5 ${setupData.smtpConfigured ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Email Integration</h3>
                            <p className="text-sm text-gray-600">
                                {setupData.smtpConfigured ? 'SMTP configured' : 'Skipped (can be configured later)'}
                            </p>
                        </div>
                        {setupData.smtpConfigured && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                </div>
            </div>

            {/* Success Message */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-900">
                            Setup Complete!
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                            Your AI agent is ready to help you with outreach. Click "Finish Setup" to access your dashboard.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button onClick={onBack} className="btn-secondary flex-1">
                    ← Back
                </button>
                <button
                    onClick={handleFinish}
                    disabled={finishing}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                    {finishing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Finishing...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Finish Setup & Go to Dashboard
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

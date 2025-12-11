'use client'

import { useState } from 'react'
import { Briefcase, Code, Globe, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

interface OutreachTypeStepProps {
    initialType: string | null
    onComplete: (type: string) => void
    onNext: () => void
    onBack: () => void
}

const OUTREACH_TYPES = [
    {
        value: 'job_hunting',
        label: 'Job Hunting',
        description: 'Find full-time positions and apply to companies',
        icon: Briefcase,
        color: 'blue',
    },
    {
        value: 'freelancing',
        label: 'Freelancing Outreach',
        description: 'Connect with clients for freelance projects',
        icon: Code,
        color: 'green',
    },
    {
        value: 'sponsorship',
        label: 'Sponsorship Outreach',
        description: 'Reach out for visa sponsorship opportunities',
        icon: Globe,
        color: 'purple',
    },
    {
        value: 'custom',
        label: 'Custom Use Case',
        description: 'Define your own outreach strategy',
        icon: Sparkles,
        color: 'amber',
    },
]

const COLOR_CLASSES = {
    blue: {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: 'text-blue-600',
        selected: 'border-blue-600 bg-blue-50',
    },
    green: {
        border: 'border-green-200',
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: 'text-green-600',
        selected: 'border-green-600 bg-green-50',
    },
    purple: {
        border: 'border-purple-200',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        icon: 'text-purple-600',
        selected: 'border-purple-600 bg-purple-50',
    },
    amber: {
        border: 'border-amber-200',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        icon: 'text-amber-600',
        selected: 'border-amber-600 bg-amber-50',
    },
}

export default function OutreachTypeStep({
    initialType,
    onComplete,
    onNext,
    onBack,
}: OutreachTypeStepProps) {
    const [selectedType, setSelectedType] = useState(initialType || '')
    const [customDescription, setCustomDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleContinue = async () => {
        if (!selectedType) {
            setError('Please select an outreach type')
            return
        }

        if (selectedType === 'custom' && !customDescription.trim()) {
            setError('Please describe your custom use case')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data = {
                outreach_type: selectedType,
                custom_outreach_description: selectedType === 'custom' ? customDescription : undefined,
            }

            // Save to backend
            await api.buildContext(data)

            onComplete(selectedType)
            onNext()
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save outreach type')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Outreach Type</h2>
            <p className="text-gray-600 mb-6">
                What's your primary goal for using Agent M?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {OUTREACH_TYPES.map((type) => {
                    const Icon = type.icon
                    const colors = COLOR_CLASSES[type.color as keyof typeof COLOR_CLASSES]
                    const isSelected = selectedType === type.value

                    return (
                        <button
                            key={type.value}
                            onClick={() => setSelectedType(type.value)}
                            className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${isSelected
                                    ? colors.selected
                                    : `${colors.border} bg-white hover:${colors.bg}`
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${colors.bg}`}>
                                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-semibold mb-1 ${isSelected ? colors.text : 'text-gray-900'}`}>
                                        {type.label}
                                    </h3>
                                    <p className="text-sm text-gray-600">{type.description}</p>
                                </div>
                                {isSelected && (
                                    <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center`}>
                                        <div className={`w-3 h-3 rounded-full bg-${type.color}-600`}></div>
                                    </div>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Custom Description */}
            {selectedType === 'custom' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe Your Use Case *
                    </label>
                    <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="e.g., Reaching out to research labs for PhD positions, connecting with investors for startup funding, etc."
                        rows={4}
                        className="input-field resize-none"
                    />
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button onClick={onBack} className="btn-secondary flex-1">
                    ← Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={loading || !selectedType}
                    className="btn-primary flex-1"
                >
                    {loading ? 'Saving...' : 'Continue to Tone & Style →'}
                </button>
            </div>
        </div>
    )
}

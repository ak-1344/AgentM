'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { api } from '@/lib/api'

interface ToneStyleStepProps {
    initialTone: string | null
    onComplete: (tone: string) => void
    onNext: () => void
    onBack: () => void
}

const TONE_STYLES = [
    {
        value: 'formal',
        label: 'Formal',
        description: 'Professional and structured communication',
        example: 'Dear Hiring Manager, I am writing to express my interest...',
    },
    {
        value: 'friendly',
        label: 'Friendly',
        description: 'Warm and approachable tone',
        example: 'Hi there! I came across your company and was really excited...',
    },
    {
        value: 'assertive',
        label: 'Assertive',
        description: 'Confident and direct approach',
        example: 'I bring 5+ years of expertise in X and can deliver immediate value...',
    },
    {
        value: 'humble',
        label: 'Humble',
        description: 'Modest and respectful communication',
        example: 'I would be grateful for the opportunity to contribute to your team...',
    },
    {
        value: 'direct',
        label: 'Direct',
        description: 'Straight to the point, no fluff',
        example: 'Looking for software engineering roles. Available immediately...',
    },
]

export default function ToneStyleStep({
    initialTone,
    onComplete,
    onNext,
    onBack,
}: ToneStyleStepProps) {
    const [selectedTone, setSelectedTone] = useState(initialTone || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleContinue = async () => {
        if (!selectedTone) {
            setError('Please select a communication tone')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data = {
                tone_preference: selectedTone,
            }

            // Save to backend
            await api.buildContext(data)

            onComplete(selectedTone)
            onNext()
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save tone preference')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tone & Style</h2>
            <p className="text-gray-600 mb-6">
                Choose how you want AI to communicate on your behalf
            </p>

            <div className="space-y-3 mb-6">
                {TONE_STYLES.map((tone) => {
                    const isSelected = selectedTone === tone.value

                    return (
                        <button
                            key={tone.value}
                            onClick={() => setSelectedTone(tone.value)}
                            className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${isSelected
                                    ? 'border-primary-600 bg-primary-50'
                                    : 'border-gray-200 bg-white hover:border-primary-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-100' : 'bg-gray-100'}`}>
                                    <MessageSquare className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-gray-600'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>
                                            {tone.label}
                                        </h3>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{tone.description}</p>
                                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                                        <p className="text-xs text-gray-700 italic">"{tone.example}"</p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> You can always regenerate emails with different tones later.
                    This is just your default preference.
                </p>
            </div>

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
                    disabled={loading || !selectedTone}
                    className="btn-primary flex-1"
                >
                    {loading ? 'Saving...' : 'Continue to Email Setup →'}
                </button>
            </div>
        </div>
    )
}

'use client'

import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react'

interface PersonalizationScoreProps {
    score: number
    size?: 'small' | 'medium' | 'large'
    showLabel?: boolean
}

export default function PersonalizationScore({
    score,
    size = 'medium',
    showLabel = true
}: PersonalizationScoreProps) {
    // Determine color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100 border-green-200'
        if (score >= 60) return 'text-blue-600 bg-blue-100 border-blue-200'
        if (score >= 40) return 'text-amber-600 bg-amber-100 border-amber-200'
        return 'text-red-600 bg-red-100 border-red-200'
    }

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Fair'
        return 'Poor'
    }

    const sizeClasses = {
        small: 'text-xs px-2 py-1',
        medium: 'text-sm px-3 py-1.5',
        large: 'text-base px-4 py-2',
    }

    const iconSizes = {
        small: 'w-3 h-3',
        medium: 'w-4 h-4',
        large: 'w-5 h-5',
    }

    return (
        <div className="flex items-center gap-2">
            {showLabel && (
                <span className="text-xs text-gray-500 font-medium">
                    Personalization:
                </span>
            )}
            <div className={`
        inline-flex items-center gap-1.5 rounded-full border font-semibold
        ${getScoreColor(score)} ${sizeClasses[size]}
      `}>
                <Sparkles className={iconSizes[size]} />
                <span>{score}%</span>
                {size !== 'small' && (
                    <span className="font-normal opacity-75">
                        {getScoreLabel(score)}
                    </span>
                )}
            </div>
        </div>
    )
}

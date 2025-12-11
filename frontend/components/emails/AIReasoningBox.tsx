'use client'

import { Brain, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface AIReasoningBoxProps {
    reasoning: string
    collapsed?: boolean
}

export default function AIReasoningBox({ reasoning, collapsed = false }: AIReasoningBoxProps) {
    const [isCollapsed, setIsCollapsed] = useState(collapsed)

    if (!reasoning) {
        return null
    }

    return (
        <div className="border border-purple-200 rounded-lg bg-purple-50">
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">AI Reasoning</h3>
                </div>
                {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                ) : (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                )}
            </button>

            {!isCollapsed && (
                <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {reasoning}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

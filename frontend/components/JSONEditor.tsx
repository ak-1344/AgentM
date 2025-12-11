'use client'

import { useState } from 'react'
import { Code, Save, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface JSONEditorProps {
    title: string
    data: any
    onSave: (data: any) => Promise<void>
    onClose: () => void
}

export default function JSONEditor({ title, data, onSave, onClose }: JSONEditorProps) {
    const [jsonText, setJsonText] = useState(JSON.stringify(data, null, 2))
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSave = async () => {
        try {
            // Validate JSON
            const parsedData = JSON.parse(jsonText)

            setSaving(true)
            setError(null)

            await onSave(parsedData)

            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                onClose()
            }, 1500)
        } catch (err: any) {
            if (err instanceof SyntaxError) {
                setError(`Invalid JSON: ${err.message}`)
            } else {
                setError(err.message || 'Failed to save data')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-1 p-4 overflow-auto">
                    <textarea
                        value={jsonText}
                        onChange={(e) => {
                            setJsonText(e.target.value)
                            setError(null)
                        }}
                        className="w-full h-full min-h-[400px] font-mono text-sm p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        spellCheck={false}
                    />
                </div>

                {/* Messages */}
                {error && (
                    <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mx-4 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-700">Saved successfully!</p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500">
                        Edit the JSON data directly. Make sure it's valid JSON before saving.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

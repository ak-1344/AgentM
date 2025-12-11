'use client'

import { useState } from 'react'
import { Play, Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface QuickActionPanelProps {
    onStartScan: () => Promise<void>
    onUploadCSV: (file: File) => Promise<void>
    scanning?: boolean
}

export default function QuickActionPanel({
    onStartScan,
    onUploadCSV,
    scanning = false,
}: QuickActionPanelProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]

        if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
            setUploadError('Please upload a CSV or Excel file')
            return
        }

        setUploading(true)
        setUploadError(null)
        setUploadSuccess(false)

        try {
            await onUploadCSV(file)
            setUploadSuccess(true)
            setTimeout(() => setUploadSuccess(false), 3000)
        } catch (error: any) {
            setUploadError(error.message || 'Failed to upload file')
        } finally {
            setUploading(false)
            // Reset file input
            e.target.value = ''
        }
    }

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

            <div className="space-y-4">
                {/* Start Outreach Scan */}
                <button
                    onClick={onStartScan}
                    disabled={scanning}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                >
                    {scanning ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Scanning for companies...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Start Outreach Scan
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                {/* Upload CSV/Excel */}
                <div>
                    <label
                        htmlFor="csv-upload"
                        className={`
              w-full flex items-center justify-center gap-2 px-6 py-4 
              border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${uploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-primary-300 hover:border-primary-500 hover:bg-primary-50'}
            `}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                <span className="font-medium text-gray-600">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 text-primary-600" />
                                <span className="font-medium text-primary-600">Upload Company CSV / Excel</span>
                            </>
                        )}
                    </label>
                    <input
                        id="csv-upload"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                    <p className="mt-2 text-xs text-gray-500 text-center">
                        Upload a list of companies to target for outreach
                    </p>
                </div>

                {/* Success Message */}
                {uploadSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700">File uploaded successfully!</p>
                    </div>
                )}

                {/* Error Message */}
                {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{uploadError}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

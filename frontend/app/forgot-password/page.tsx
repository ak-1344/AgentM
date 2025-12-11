'use client'

import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="w-12 h-12" />
                        <h1 className="text-4xl font-bold">Agent M</h1>
                    </div>
                    <h2 className="text-3xl font-semibold mb-4">
                        Reset Your Password
                    </h2>
                    <p className="text-primary-100 text-lg">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
            </div>

            {/* Right side - Reset Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 lg:hidden">
                        <Mail className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                        <h1 className="text-3xl font-bold text-gray-900">Agent M</h1>
                    </div>

                    {!success ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h2>
                            <p className="text-gray-600 mb-8">
                                No worries, we'll send you reset instructions.
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="input-field"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send reset link'
                                    )}
                                </button>
                            </form>

                            <Link
                                href="/login"
                                className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to login
                            </Link>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500 mb-8">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <Link href="/login" className="btn-primary inline-block">
                                Back to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

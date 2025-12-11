'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import SetupWizard from '@/components/SetupWizard'
import ResumeUploadStep from '@/components/setup/ResumeUploadStep'
import ResumeParseStep from '@/components/setup/ResumeParseStep'
import BasicDetailsStep from '@/components/setup/BasicDetailsStep'
import OutreachTypeStep from '@/components/setup/OutreachTypeStep'
import ToneStyleStep from '@/components/setup/ToneStyleStep'
import SmtpSetupStep from '@/components/setup/SmtpSetupStep'
import ReviewStep from '@/components/setup/ReviewStep'
import { api } from '@/lib/api'

interface SetupState {
    currentStep: number
    completedSteps: boolean[]
    resumeId: string | null
    parsedData: any | null
    basicDetails: any | null
    outreachType: string | null
    toneStyle: string | null
    smtpConfigured: boolean
}

export default function SetupPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [setupState, setSetupState] = useState<SetupState>({
        currentStep: 1,
        completedSteps: [false, false, false, false, false, false, false],
        resumeId: null,
        parsedData: null,
        basicDetails: null,
        outreachType: null,
        toneStyle: null,
        smtpConfigured: false,
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (user) {
            loadProgress()
        }
    }, [user])

    const loadProgress = async () => {
        try {
            setLoading(true)

            // Check existing progress
            const [resumeRes, contextRes, smtpRes] = await Promise.allSettled([
                api.getCurrentResume(),
                api.getContextProfile(),
                api.getSmtpConfig(),
            ])

            let hasResume = false
            let hasParsedResume = false
            let resumeId = null
            let parsedData = null

            if (resumeRes.status === 'fulfilled' && resumeRes.value?.data) {
                const resume = resumeRes.value.data
                resumeId = resume.id
                hasResume = resume.is_upload_completed || false
                hasParsedResume = resume.is_parse_completed || false
                parsedData = resume.parsed_data
            }

            const hasContext = contextRes.status === 'fulfilled' && contextRes.value?.data !== null
            const contextData = contextRes.status === 'fulfilled' ? contextRes.value?.data : null
            const hasSmtp = smtpRes.status === 'fulfilled' && smtpRes.value?.data !== null

            // Determine which steps are completed
            const hasBasicDetails = contextData?.experience_level || contextData?.preferred_roles?.length > 0
            const hasOutreachType = !!contextData?.outreach_type
            const hasToneStyle = !!contextData?.tone_preference

            const completedSteps = [
                hasResume,
                hasParsedResume,
                hasBasicDetails,
                hasOutreachType,
                hasToneStyle,
                hasSmtp,
                false, // Review step
            ]

            // Determine current step (first incomplete step)
            let currentStep = 1
            for (let i = 0; i < completedSteps.length - 1; i++) {
                if (!completedSteps[i]) {
                    currentStep = i + 1
                    break
                }
                currentStep = i + 2
            }

            setSetupState({
                currentStep,
                completedSteps,
                resumeId,
                parsedData,
                basicDetails: contextData,
                outreachType: contextData?.outreach_type || null,
                toneStyle: contextData?.tone_preference || null,
                smtpConfigured: hasSmtp,
            })
        } catch (error) {
            console.error('Error loading setup progress:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStepChange = (step: number) => {
        setSetupState({ ...setupState, currentStep: step })
    }

    const handleResumeUploaded = (resumeId: string) => {
        const newCompleted = [...setupState.completedSteps]
        newCompleted[0] = true
        setSetupState({
            ...setupState,
            resumeId,
            completedSteps: newCompleted,
        })
    }

    const handleResumeParsed = (parsedData: any) => {
        const newCompleted = [...setupState.completedSteps]
        newCompleted[1] = true
        setSetupState({
            ...setupState,
            parsedData,
            completedSteps: newCompleted,
        })
    }

    const handleBasicDetailsComplete = (data: any) => {
        const newCompleted = [...setupState.completedSteps]
        newCompleted[2] = true
        setSetupState({
            ...setupState,
            basicDetails: data,
            completedSteps: newCompleted,
        })
    }

    const handleOutreachTypeComplete = (type: string) => {
        const newCompleted = [...setupState.completedSteps]
        newCompleted[3] = true
        setSetupState({
            ...setupState,
            outreachType: type,
            completedSteps: newCompleted,
        })
    }

    const handleToneStyleComplete = (tone: string) => {
        const newCompleted = [...setupState.completedSteps]
        newCompleted[4] = true
        setSetupState({
            ...setupState,
            toneStyle: tone,
            completedSteps: newCompleted,
        })
    }

    const handleSmtpComplete = () => {
        const newCompleted = [...setupState.completedSteps]
        newCompleted[5] = true
        setSetupState({
            ...setupState,
            smtpConfigured: true,
            completedSteps: newCompleted,
        })
    }

    const handleFinishSetup = async () => {
        try {
            // Mark setup as complete in user profile
            await api.updateUserProfile({ setup_complete: true })

            // Redirect to home
            router.push('/home')
        } catch (error) {
            console.error('Error finishing setup:', error)
        }
    }

    const goToNextStep = () => {
        setSetupState({
            ...setupState,
            currentStep: Math.min(setupState.currentStep + 1, 7),
        })
    }

    const goToPreviousStep = () => {
        setSetupState({
            ...setupState,
            currentStep: Math.max(setupState.currentStep - 1, 1),
        })
    }

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading setup...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to Agent M
                    </h1>
                    <p className="text-gray-600">
                        Let's set up your AI-powered outreach profile in 6 simple steps
                    </p>
                </div>

                {/* Wizard */}
                <SetupWizard
                    currentStep={setupState.currentStep}
                    onStepChange={handleStepChange}
                    completedSteps={setupState.completedSteps}
                    totalSteps={7}
                >
                    {setupState.currentStep === 1 && (
                        <ResumeUploadStep
                            onComplete={handleResumeUploaded}
                            onNext={goToNextStep}
                        />
                    )}

                    {setupState.currentStep === 2 && setupState.resumeId && (
                        <ResumeParseStep
                            resumeId={setupState.resumeId}
                            onComplete={handleResumeParsed}
                            onNext={goToNextStep}
                            onBack={goToPreviousStep}
                        />
                    )}

                    {setupState.currentStep === 3 && (
                        <BasicDetailsStep
                            parsedData={setupState.parsedData}
                            initialData={setupState.basicDetails}
                            onComplete={handleBasicDetailsComplete}
                            onNext={goToNextStep}
                            onBack={goToPreviousStep}
                        />
                    )}

                    {setupState.currentStep === 4 && (
                        <OutreachTypeStep
                            initialType={setupState.outreachType}
                            onComplete={handleOutreachTypeComplete}
                            onNext={goToNextStep}
                            onBack={goToPreviousStep}
                        />
                    )}

                    {setupState.currentStep === 5 && (
                        <ToneStyleStep
                            initialTone={setupState.toneStyle}
                            onComplete={handleToneStyleComplete}
                            onNext={goToNextStep}
                            onBack={goToPreviousStep}
                        />
                    )}

                    {setupState.currentStep === 6 && (
                        <SmtpSetupStep
                            onComplete={handleSmtpComplete}
                            onSkip={() => {
                                handleSmtpComplete()
                                goToNextStep()
                            }}
                            onNext={goToNextStep}
                            onBack={goToPreviousStep}
                        />
                    )}

                    {setupState.currentStep === 7 && (
                        <ReviewStep
                            setupData={{
                                resumeId: setupState.resumeId,
                                parsedData: setupState.parsedData,
                                basicDetails: setupState.basicDetails,
                                outreachType: setupState.outreachType,
                                toneStyle: setupState.toneStyle,
                                smtpConfigured: setupState.smtpConfigured,
                            }}
                            onFinish={handleFinishSetup}
                            onBack={goToPreviousStep}
                        />
                    )}
                </SetupWizard>
            </div>
        </div>
    )
}

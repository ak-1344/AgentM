'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import SetupWizard from '@/components/SetupWizard'
import SetupCompleteView from '@/components/SetupCompleteView'
import ResumeUploadStep from '@/components/wizard/ResumeUploadStep'
import ResumeParseStep from '@/components/wizard/ResumeParseStep'
import ContextSetupStep from '@/components/wizard/ContextSetupStep'
import SmtpSetupStep from '@/components/wizard/SmtpSetupStep'
import { api } from '@/lib/api'

interface WizardState {
  currentStep: number
  completedSteps: [boolean, boolean, boolean, boolean]
  resumeId: string | null
  parsedData: any | null
  resumeData: any | null
  contextData: any | null
}

export default function DashboardPage() {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    completedSteps: [false, false, false, false],
    resumeId: null,
    parsedData: null,
    resumeData: null,
    contextData: null
  })
  
  const [loading, setLoading] = useState(true)
  const [setupComplete, setSetupComplete] = useState(false)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      setLoading(true)

      // Check each component in parallel
      const [resumeRes, contextRes, smtpRes] = await Promise.allSettled([
        api.getCurrentResume(), // Use getCurrentResume to get latest with completion fields
        api.getContextProfile(),
        api.getSmtpConfig()
      ])

      let hasResume = false
      let hasParsedResume = false
      let resumeId = null
      let parsedData = null
      let resumeData = null

      if (resumeRes.status === 'fulfilled' && resumeRes.value?.data) {
        const latestResume = resumeRes.value.data
        resumeData = latestResume
        resumeId = latestResume.id
        
        // Use the completion tracking fields from backend
        hasResume = latestResume.is_upload_completed || false
        hasParsedResume = latestResume.is_parse_completed || false
        
        if (latestResume.parsed_data) {
          parsedData = latestResume.parsed_data
        }
      }

      const hasContext = contextRes.status === 'fulfilled' && contextRes.value?.data !== null
      const hasSmtp = smtpRes.status === 'fulfilled' && smtpRes.value?.data !== null
      
      const contextData = contextRes.status === 'fulfilled' ? contextRes.value?.data : null

      const completedSteps: [boolean, boolean, boolean, boolean] = [
        hasResume,
        hasParsedResume,
        hasContext,
        hasSmtp
      ]

      // Determine current step
      let currentStep = 1
      if (hasResume && !hasParsedResume) {
        currentStep = 2
      } else if (hasParsedResume && !hasContext) {
        currentStep = 3
      } else if (hasContext && !hasSmtp) {
        currentStep = 4
      } else if (hasResume && hasParsedResume && hasContext) {
        currentStep = 4 // All required steps done, on optional SMTP step
      }

      setWizardState({
        currentStep,
        completedSteps,
        resumeId,
        parsedData,
        resumeData,
        contextData
      })

      // Check if setup is complete (first 3 steps are mandatory)
      if (hasResume && hasParsedResume && hasContext) {
        setSetupComplete(true)
      }

    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStepChange = (step: number) => {
    setWizardState({ ...wizardState, currentStep: step })
  }

  const handleResumeUploaded = (resumeId: string) => {
    setWizardState({
      ...wizardState,
      resumeId,
      completedSteps: [true, false, false, false]
    })
  }

  const handleResumeParsed = (parsedData: any) => {
    setWizardState({
      ...wizardState,
      parsedData,
      completedSteps: [true, true, false, false]
    })
  }

  const handleContextComplete = () => {
    const newCompleted: [boolean, boolean, boolean, boolean] = [...wizardState.completedSteps] as [boolean, boolean, boolean, boolean]
    newCompleted[2] = true
    setWizardState({
      ...wizardState,
      completedSteps: newCompleted
    })
    setSetupComplete(true)
  }

  const handleSmtpComplete = () => {
    const newCompleted: [boolean, boolean, boolean, boolean] = [...wizardState.completedSteps] as [boolean, boolean, boolean, boolean]
    newCompleted[3] = true
    setWizardState({
      ...wizardState,
      completedSteps: newCompleted
    })
  }

  const handleSmtpSkip = () => {
    // Mark as done even if skipped
    handleSmtpComplete()
  }

  const goToNextStep = () => {
    setWizardState({
      ...wizardState,
      currentStep: Math.min(wizardState.currentStep + 1, 4)
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Agent M
          </h1>
          <p className="text-gray-600">
            {setupComplete 
              ? 'Your profile is complete! Review your information below.'
              : "Let's set up your AI-powered outreach campaign in 4 simple steps"
            }
          </p>
        </div>

        {/* Show Complete View if all required steps are done */}
        {setupComplete && wizardState.completedSteps[0] && wizardState.completedSteps[1] && wizardState.completedSteps[2] ? (
          <SetupCompleteView
            resumeData={wizardState.resumeData}
            contextData={wizardState.contextData}
            smtpConfigured={wizardState.completedSteps[3]}
          />
        ) : (
          <SetupWizard
            currentStep={wizardState.currentStep}
            onStepChange={handleStepChange}
            completedSteps={wizardState.completedSteps}
          >
            {wizardState.currentStep === 1 && (
              <ResumeUploadStep
                onComplete={handleResumeUploaded}
                onNext={goToNextStep}
              />
            )}

            {wizardState.currentStep === 2 && wizardState.resumeId && (
              <ResumeParseStep
                resumeId={wizardState.resumeId}
                onComplete={handleResumeParsed}
                onNext={goToNextStep}
              />
            )}

            {wizardState.currentStep === 3 && wizardState.parsedData && (
              <ContextSetupStep
                parsedData={wizardState.parsedData}
                onComplete={handleContextComplete}
                onNext={goToNextStep}
              />
            )}

            {wizardState.currentStep === 4 && (
              <SmtpSetupStep
                onComplete={handleSmtpComplete}
                onSkip={handleSmtpSkip}
              />
            )}
          </SetupWizard>
        )}
      </div>
    </DashboardLayout>
  )
}


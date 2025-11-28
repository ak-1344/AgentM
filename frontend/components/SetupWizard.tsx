'use client'

import { useState } from 'react'
import { FileText, Upload, Target, Mail, CheckCircle2, Circle } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ComponentType<any>
  completed: boolean
}

interface SetupWizardProps {
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  completedSteps: boolean[]
}

export default function SetupWizard({ 
  currentStep, 
  onStepChange, 
  children,
  completedSteps 
}: SetupWizardProps) {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Upload Resume',
      description: 'Upload your resume file',
      icon: Upload,
      completed: completedSteps[0]
    },
    {
      number: 2,
      title: 'Parse Resume',
      description: 'AI extracts your information',
      icon: FileText,
      completed: completedSteps[1]
    },
    {
      number: 3,
      title: 'Setup Context',
      description: 'Configure job search preferences',
      icon: Target,
      completed: completedSteps[2]
    },
    {
      number: 4,
      title: 'Email Integration',
      description: 'Connect your email (optional)',
      icon: Mail,
      completed: completedSteps[3]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = step.completed
            const isClickable = index === 0 || completedSteps[index - 1]

            return (
              <div key={step.number} className="flex-1">
                <div className="flex items-center">
                  {/* Step Circle */}
                  <button
                    onClick={() => isClickable && onStepChange(step.number)}
                    disabled={!isClickable}
                    className={`
                      relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                      ${isActive 
                        ? 'border-primary-600 bg-primary-50 text-primary-600' 
                        : isCompleted 
                          ? 'border-green-500 bg-green-50 text-green-600' 
                          : 'border-gray-300 bg-white text-gray-400'
                      }
                      ${isClickable && !isActive ? 'cursor-pointer hover:border-primary-400' : ''}
                      ${!isClickable ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </button>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`
                        flex-1 h-0.5 mx-2 transition-all
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                      `}
                    />
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        {children}
      </div>
    </div>
  )
}

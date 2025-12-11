'use client'

import { ArrowRight, ArrowDown } from 'lucide-react'

const workflowSteps = [
  { label: 'User', subtitle: 'Upload Context', step: 1 },
  { label: 'Context Setup', subtitle: 'Resume + Preferences', step: 2 },
  { label: 'AI Engine', subtitle: 'Agentic Planning', step: 3 },
  { label: 'Web Scraper', subtitle: 'Multi-source Search', step: 4 },
  { label: 'Email Generator', subtitle: 'LLM Personalization', step: 5 },
  { label: 'SMTP Sender', subtitle: 'Automated Delivery', step: 6 }
]

function WorkflowNode({ label, subtitle, step }: { label: string; subtitle: string; step: number }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
      <div className="relative bg-white rounded-2xl p-6 min-w-[180px] text-center shadow-xl border-2 border-blue-200 hover:border-blue-400 hover:scale-105 transition-all cursor-default">
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
          {step}
        </div>
        <div className="font-bold text-lg text-gray-900">{label}</div>
        <div className="text-xs text-blue-600 mt-1 font-medium">{subtitle}</div>
      </div>
    </div>
  )
}

export default function TechnicalOverview() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Technical Overview
          </h2>
          <p className="text-xl text-gray-600">
            A sophisticated multi-agent AI system
          </p>
        </div>

        {/* Flowchart - 3x2 Grid Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Row 1 */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <WorkflowNode {...workflowSteps[0]} />
            <ArrowRight className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <WorkflowNode {...workflowSteps[1]} />
            <ArrowRight className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <WorkflowNode {...workflowSteps[2]} />
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-end pr-[90px] mb-6">
            <ArrowDown className="w-8 h-8 text-blue-500" />
          </div>

          {/* Row 2 - Reversed order for flow continuity */}
          <div className="flex items-center justify-center gap-6">
            <WorkflowNode {...workflowSteps[5]} />
            <ArrowRight className="w-8 h-8 text-blue-500 flex-shrink-0 rotate-180" />
            <WorkflowNode {...workflowSteps[4]} />
            <ArrowRight className="w-8 h-8 text-blue-500 flex-shrink-0 rotate-180" />
            <WorkflowNode {...workflowSteps[3]} />
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-full border-2 border-blue-200 shadow-lg">
            <p className="text-blue-700 font-mono text-sm">
              Built with Next.js • FastAPI • Supabase • Google Gemini • SMTP Integration
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

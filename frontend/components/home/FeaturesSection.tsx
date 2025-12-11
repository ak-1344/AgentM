'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Scan, Brain, Mail, Send } from 'lucide-react'

const features = [
  {
    icon: Scan,
    title: 'Auto Company Scanning',
    description: 'Intelligent web scraping across multiple sources to find relevant opportunities',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Brain,
    title: 'Agentic AI Processing',
    description: 'Multi-step reasoning and context understanding for perfect matches',
    gradient: 'from-blue-600 to-indigo-600'
  },
  {
    icon: Mail,
    title: 'Personalized Email Generation',
    description: 'LLM-powered email drafts tailored to each company and role',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    icon: Send,
    title: 'SMTP Automation Pipeline',
    description: 'Review, approve, and send emails with full tracking and logging',
    gradient: 'from-blue-500 to-indigo-500'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            What Agent M Does
          </h2>
          <p className="text-xl text-gray-600">
            End-to-end automation for your outreach workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-blue-300 bg-white">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

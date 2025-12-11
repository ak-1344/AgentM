'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HeroSection() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 pt-16">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-200/40 to-purple-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="px-4 py-2 rounded-full bg-blue-100 border border-blue-300 text-blue-700 text-sm font-semibold">
              🤖 Powered by Agentic AI
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Agent M
            </span>
          </h1>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8">
            AI Outreach Automation
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Find companies, generate personalized emails, automate outreach.
            <br />
            <span className="text-blue-600 font-medium">Let AI handle your job applications.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => router.push(user ? '/home' : '/signup')}
              className="text-lg px-8 py-6 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {user ? '🚀 Go to Dashboard' : '✨ Start Now'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('https://github.com/ak-1344/AgentM/blob/main/docs/index.md', '_blank')}
              className="text-lg px-8 py-6 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              📚 View Docs
            </Button>
          </div>

          {/* Preview card */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative rounded-2xl bg-white border-2 border-blue-200 p-8 shadow-2xl">
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-2xl opacity-40" />
              <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-gradient-to-tr from-blue-300 to-blue-400 rounded-full blur-2xl opacity-40" />
              
              <div className="relative space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-left font-mono text-sm space-y-1">
                  <p className="text-gray-400">agent-m ~ outreach</p>
                  <p className="text-gray-500 mt-2">$ agentm generate --target &quot;TechCorp Inc&quot;</p>
                  <p className="text-blue-600 mt-2">⚡ Initializing Agent M...</p>
                  <p className="text-gray-700"><span className="text-green-600">✓</span> Resume context loaded</p>
                  <p className="text-gray-700"><span className="text-green-600">✓</span> Company profile analyzed</p>
                  <p className="text-gray-700"><span className="text-green-600">✓</span> Skills matched: React, TypeScript, AI/ML</p>
                  <p className="text-gray-700"><span className="text-green-600">✓</span> Personalized email generated</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      ✅ Email generated • ✅ Context matched • ✅ Ready to send
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-500 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}

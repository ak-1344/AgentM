'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Rocket, BookOpen } from 'lucide-react'

export default function CTASection() {
  const router = useRouter()

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Ready to Automate Your Outreach?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-600">
            Join the future of AI-powered job applications. Let Agent M handle the tedious work while you focus on what matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 text-xl px-10 py-7 shadow-2xl hover:shadow-blue-500/30 transition-all group"
            >
              <Rocket className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('https://github.com/ak-1344/AgentM/blob/main/docs/index.md', '_blank')}
              className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-xl px-10 py-7"
            >
              <BookOpen className="w-6 h-6 mr-2" />
              View Documentation
            </Button>
          </div>

          <div className="mt-12">
            <p className="text-gray-500 text-sm">
              No credit card required • Free tier available • Open source
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Cpu, Globe, Database, Sparkles } from 'lucide-react'

const techniques = [
  {
    icon: Cpu,
    title: 'Agentic AI Planning',
    description: 'Multi-step reasoning with tool selection, task decomposition, and autonomous decision-making',
    features: ['Chain-of-thought reasoning', 'Dynamic tool selection', 'Self-correction loops']
  },
  {
    icon: Globe,
    title: 'Multi-step Retrieval & Scraping',
    description: 'Intelligent web scraping with rate limiting, caching, and error recovery',
    features: ['Distributed scraping', 'Anti-bot detection', 'Content extraction']
  },
  {
    icon: Database,
    title: 'Context Embedding & Filtering',
    description: 'Semantic search using vector embeddings for precise context matching',
    features: ['Vector similarity search', 'Contextual filtering', 'Relevance scoring']
  },
  {
    icon: Sparkles,
    title: 'Personalized LLM Generation',
    description: 'Fine-tuned prompt engineering with company-specific context injection',
    features: ['Template customization', 'Tone adaptation', 'Multi-language support']
  }
]

export default function AlgorithmsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Algorithms & Techniques
          </h2>
          <p className="text-xl text-gray-600">
            Powered by cutting-edge AI and ML technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techniques.map((technique, index) => (
            <div
              key={index}
            >
              <Card className="h-full bg-white border-2 border-gray-100 hover:border-blue-300 transition-all hover:shadow-2xl hover:shadow-blue-200/50">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg">
                    <technique.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 mb-2">
                    {technique.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    {technique.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {technique.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="text-blue-500 mt-0.5">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Tech stack badges */}
        <div
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {['Google Gemini', 'LangChain', 'Vector DB', 'BeautifulSoup', 'Selenium', 'FastAPI', 'Supabase'].map((tech, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-white shadow-md rounded-full border border-blue-200 text-sm font-mono text-blue-700"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

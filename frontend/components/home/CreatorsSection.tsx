'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Github, Linkedin, Twitter } from 'lucide-react'

const creators = [
  {
    name: 'Ak',
    role: 'Frontend + Integration Developer',
    description: 'Full-stack developer specializing in React, Next.js, and modern web technologies',
    avatar: '👨‍💻',
    gradient: 'from-blue-500 to-indigo-600',
    links: {
      github: 'https://github.com/ak-1344',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Uday',
    role: 'Agentic AI Developer',
    description: 'AI/ML engineer focused on autonomous agents, LLMs, and intelligent automation',
    avatar: '🤖',
    gradient: 'from-indigo-500 to-blue-600',
    links: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  }
]

export default function CreatorsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Meet the Creators
          </h2>
          <p className="text-xl text-gray-600">
            Built by two passionate developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {creators.map((creator, index) => (
            <div
              key={index}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-blue-300 bg-white">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-6 relative">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${creator.gradient} flex items-center justify-center text-6xl shadow-2xl`}>
                      {creator.avatar}
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${creator.gradient} rounded-full blur-2xl opacity-20`} />
                  </div>
                  <CardTitle className="text-2xl mb-2 text-gray-900">{creator.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-blue-600">
                    {creator.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <p className="text-gray-600">
                    {creator.description}
                  </p>
                  
                  {/* Social links */}
                  <div className="flex justify-center gap-4">
                    <a
                      href={creator.links.github}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-5 h-5 text-gray-700" />
                    </a>
                    <a
                      href={creator.links.linkedin}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-5 h-5 text-gray-700" />
                    </a>
                    <a
                      href={creator.links.twitter}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-5 h-5 text-gray-700" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Agent M
            </span>
          </div>

          {/* Nav items */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/ak-1344/AgentM/blob/main/docs/index.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Docs
            </a>
            <a
              href="https://github.com/ak-1344/AgentM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              GitHub
            </a>

            {/* Auth button */}
            {!loading && (
              <>
                {user ? (
                  <Button
                    onClick={() => router.push('/home')}
                    className="shadow-lg hover:shadow-xl"
                  >
                    🚀 Go to Dashboard
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => router.push('/login')}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push('/signup')}
                      className="shadow-lg hover:shadow-xl"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

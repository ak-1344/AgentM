'use client'

import { Github, FileText, Shield, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Agent M
              </h3>
            </div>
            <p className="text-gray-500 mb-4">
              AI-powered outreach automation that finds companies, generates personalized emails, and automates your job applications.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/ak-1344/AgentM"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-purple-100 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/ak-1344/AgentM/blob/main/docs/index.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/ak-1344/AgentM" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/ak-1344/AgentM/blob/main/docs/api/ENDPOINTS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 transition-colors"
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/ak-1344/AgentM/blob/main/SECURITY.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Security Policy
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/ak-1344/AgentM/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 transition-colors"
                >
                  MIT License
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/ak-1344/AgentM/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Support & Issues
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Agent M. Built with ❤️ by Ak & Uday.
            </p>
            <div className="h-1 w-48 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  )
}

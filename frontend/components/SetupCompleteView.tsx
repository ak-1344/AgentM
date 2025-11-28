'use client'

import { useState } from 'react'
import { CheckCircle2, FileText, Target, Mail, User, Briefcase, MapPin, Code, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface SetupCompleteViewProps {
  resumeData: any
  contextData: any
  smtpConfigured: boolean
}

export default function SetupCompleteView({ resumeData, contextData, smtpConfigured }: SetupCompleteViewProps) {
  const [expandedSections, setExpandedSections] = useState({
    resume: true,
    context: true,
    smtp: false
  })

  const toggleSection = (section: 'resume' | 'context' | 'smtp') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    })
  }

  const parsedData = resumeData?.parsed_data || {}

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              🎉 Setup Complete!
            </h2>
            <p className="text-green-700 mb-4">
              Your Agent M profile is ready. Review your information below or head to the Email page to start your outreach campaign.
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/email" className="btn-primary">
                Start Sending Emails →
              </Link>
              <Link href="/dashboard/resume" className="btn-secondary">
                View Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="card">
        <button
          onClick={() => toggleSection('resume')}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-semibold text-gray-900">Resume Data</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Parsed ✓
            </span>
          </div>
          {expandedSections.resume ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.resume && (
          <div className="space-y-4 pt-4 border-t">
            {/* Name */}
            {parsedData.name && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Name</span>
                </div>
                <p className="text-gray-900 ml-6">{parsedData.name}</p>
              </div>
            )}

            {/* Skills */}
            {parsedData.skills && parsedData.skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Skills ({parsedData.skills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {parsedData.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {parsedData.job_titles && parsedData.job_titles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Experience</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {parsedData.job_titles.map((title: string, idx: number) => (
                    <li key={idx} className="text-gray-900">• {title}</li>
                  ))}
                </ul>
                {parsedData.experience_years && (
                  <p className="text-sm text-gray-600 ml-6 mt-2">
                    Total: {parsedData.experience_years} years
                  </p>
                )}
              </div>
            )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Education</span>
                <ul className="space-y-1 ml-6">
                  {parsedData.education.map((edu: string, idx: number) => (
                    <li key={idx} className="text-gray-900">• {edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            {parsedData.links && parsedData.links.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Links</span>
                <div className="space-y-1 ml-6">
                  {parsedData.links.map((link: string, idx: number) => (
                    <a
                      key={idx}
                      href={link.includes('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      {link}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON Toggle */}
            <details className="mt-4">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                View Raw JSON
              </summary>
              <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-auto max-h-64">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* Context Section */}
      <div className="card">
        <button
          onClick={() => toggleSection('context')}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-semibold text-gray-900">Job Search Context</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Configured ✓
            </span>
          </div>
          {expandedSections.context ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.context && contextData && (
          <div className="space-y-4 pt-4 border-t">
            {/* Target Roles */}
            {contextData.target_roles && contextData.target_roles.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Target Roles</span>
                <div className="flex flex-wrap gap-2 ml-4">
                  {contextData.target_roles.map((role: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Industries */}
            {contextData.preferred_industries && contextData.preferred_industries.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Preferred Industries</span>
                <div className="flex flex-wrap gap-2 ml-4">
                  {contextData.preferred_industries.map((industry: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {contextData.keywords && contextData.keywords.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Keywords</span>
                <div className="flex flex-wrap gap-2 ml-4">
                  {contextData.keywords.map((keyword: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Geography */}
            {contextData.geography && contextData.geography.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Preferred Locations</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {contextData.geography.map((location: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Email Tone */}
            {contextData.pitch_tone && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Email Tone</span>
                <p className="text-gray-900 ml-4 capitalize">{contextData.pitch_tone}</p>
              </div>
            )}

            {/* Custom Message */}
            {contextData.custom_message && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Custom Message</span>
                <p className="text-gray-900 ml-4 italic">"{contextData.custom_message}"</p>
              </div>
            )}

            {/* Raw JSON Toggle */}
            <details className="mt-4">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                View Raw JSON
              </summary>
              <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-auto max-h-64">
                {JSON.stringify(contextData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* SMTP Section */}
      <div className="card">
        <button
          onClick={() => toggleSection('smtp')}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-semibold text-gray-900">Email Integration</h3>
            {smtpConfigured ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Connected ✓
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                Not configured
              </span>
            )}
          </div>
          {expandedSections.smtp ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.smtp && (
          <div className="pt-4 border-t">
            {smtpConfigured ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>SMTP credentials configured. You can send emails directly.</span>
              </div>
            ) : (
              <div className="text-gray-600">
                <p className="mb-3">SMTP not configured. You can still generate emails but won't be able to send them automatically.</p>
                <Link href="/dashboard/settings" className="btn-secondary inline-block">
                  Configure SMTP
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">1.</span>
            <span>Go to the <Link href="/dashboard/email" className="text-primary-600 underline font-medium">Email page</Link> to generate and send outreach emails</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">2.</span>
            <span>Edit your <Link href="/dashboard/context" className="text-primary-600 underline font-medium">context</Link> anytime to refine your search</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">3.</span>
            <span>Update your <Link href="/dashboard/resume" className="text-primary-600 underline font-medium">resume</Link> to improve AI suggestions</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

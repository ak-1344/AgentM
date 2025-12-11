'use client'

import { FileText, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Calendar } from 'lucide-react'

interface ResumeData {
    id: string
    filename: string
    uploaded_at: string
    parsed_data?: {
        name?: string
        email?: string
        phone?: string
        location?: string
        summary?: string
        skills?: string[]
        experience?: Array<{
            title: string
            company: string
            duration: string
            description?: string
        }>
        education?: Array<{
            degree: string
            institution: string
            year: string
        }>
        certifications?: string[]
        experience_years?: number
    }
}

interface ResumeViewerProps {
    resumeData: ResumeData | null
    loading?: boolean
}

export default function ResumeViewer({ resumeData, loading = false }: ResumeViewerProps) {
    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    if (!resumeData) {
        return (
            <div className="card">
                <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No resume uploaded</p>
                    <a href="/setup" className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        Upload your resume →
                    </a>
                </div>
            </div>
        )
    }

    const parsed = resumeData.parsed_data

    return (
        <div className="card">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Resume</h2>
                    <p className="text-sm text-gray-500">
                        Uploaded: {new Date(resumeData.uploaded_at).toLocaleDateString()}
                    </p>
                </div>
                <a
                    href="/setup"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    Edit →
                </a>
            </div>

            {parsed ? (
                <div className="space-y-6">
                    {/* Personal Info */}
                    {(parsed.name || parsed.email || parsed.phone || parsed.location) && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {parsed.name && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{parsed.name}</span>
                                    </div>
                                )}
                                {parsed.email && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{parsed.email}</span>
                                    </div>
                                )}
                                {parsed.phone && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{parsed.phone}</span>
                                    </div>
                                )}
                                {parsed.location && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{parsed.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {parsed.summary && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{parsed.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {parsed.skills && parsed.skills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Skills ({parsed.skills.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {parsed.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {parsed.experience && parsed.experience.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Experience
                                {parsed.experience_years && (
                                    <span className="text-sm font-normal text-gray-500">
                                        ({parsed.experience_years} years)
                                    </span>
                                )}
                            </h3>
                            <div className="space-y-4">
                                {parsed.experience.map((exp, idx) => (
                                    <div key={idx} className="border-l-2 border-primary-200 pl-4">
                                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                                        <p className="text-sm text-gray-600">{exp.company}</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {exp.duration}
                                        </p>
                                        {exp.description && (
                                            <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {parsed.education && parsed.education.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                Education
                            </h3>
                            <div className="space-y-3">
                                {parsed.education.map((edu, idx) => (
                                    <div key={idx} className="border-l-2 border-green-200 pl-4">
                                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                        <p className="text-sm text-gray-600">{edu.institution}</p>
                                        <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {parsed.certifications && parsed.certifications.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Certifications
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                                {parsed.certifications.map((cert, idx) => (
                                    <li key={idx} className="text-gray-700">{cert}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-gray-500">Resume uploaded but not yet parsed</p>
                    <a href="/setup" className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        Parse resume →
                    </a>
                </div>
            )}
        </div>
    )
}

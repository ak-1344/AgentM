'use client'

import { useState, useEffect } from 'react'
import { User, Briefcase, MapPin, Building2 } from 'lucide-react'
import { api } from '@/lib/api'

interface BasicDetailsStepProps {
    parsedData: any
    initialData: any
    onComplete: (data: any) => void
    onNext: () => void
    onBack: () => void
}

const EXPERIENCE_LEVELS = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior (6-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' },
    { value: 'executive', label: 'Executive/C-Level' },
]

const COMMON_ROLES = [
    'Software Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Machine Learning Engineer',
    'Cloud Architect',
]

const COMMON_INDUSTRIES = [
    'Technology',
    'Finance',
    'Healthcare',
    'E-commerce',
    'Education',
    'Gaming',
    'Robotics',
    'AI/ML',
    'Cybersecurity',
    'Blockchain',
]

export default function BasicDetailsStep({
    parsedData,
    initialData,
    onComplete,
    onNext,
    onBack,
}: BasicDetailsStepProps) {
    const [experienceLevel, setExperienceLevel] = useState(initialData?.experience_level || '')
    const [roles, setRoles] = useState<string[]>(initialData?.preferred_roles || [])
    const [customRole, setCustomRole] = useState('')
    const [industries, setIndustries] = useState<string[]>(initialData?.preferred_industries || [])
    const [customIndustry, setCustomIndustry] = useState('')
    const [locations, setLocations] = useState<string[]>(initialData?.location_preferences || [])
    const [customLocation, setCustomLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Pre-fill from parsed data if available
    useEffect(() => {
        if (parsedData && !initialData) {
            // Try to infer experience level from years
            if (parsedData.experience_years) {
                const years = parsedData.experience_years
                if (years <= 2) setExperienceLevel('entry')
                else if (years <= 5) setExperienceLevel('mid')
                else if (years <= 10) setExperienceLevel('senior')
                else setExperienceLevel('lead')
            }

            // Pre-fill roles from job titles
            if (parsedData.job_titles && parsedData.job_titles.length > 0) {
                setRoles(parsedData.job_titles.slice(0, 3))
            }
        }
    }, [parsedData, initialData])

    const toggleRole = (role: string) => {
        if (roles.includes(role)) {
            setRoles(roles.filter((r) => r !== role))
        } else {
            setRoles([...roles, role])
        }
    }

    const addCustomRole = () => {
        if (customRole.trim() && !roles.includes(customRole.trim())) {
            setRoles([...roles, customRole.trim()])
            setCustomRole('')
        }
    }

    const toggleIndustry = (industry: string) => {
        if (industries.includes(industry)) {
            setIndustries(industries.filter((i) => i !== industry))
        } else {
            setIndustries([...industries, industry])
        }
    }

    const addCustomIndustry = () => {
        if (customIndustry.trim() && !industries.includes(customIndustry.trim())) {
            setIndustries([...industries, customIndustry.trim()])
            setCustomIndustry('')
        }
    }

    const addLocation = () => {
        if (customLocation.trim() && !locations.includes(customLocation.trim())) {
            setLocations([...locations, customLocation.trim()])
            setCustomLocation('')
        }
    }

    const removeLocation = (location: string) => {
        setLocations(locations.filter((l) => l !== location))
    }

    const handleContinue = async () => {
        if (!experienceLevel || roles.length === 0) {
            setError('Please select experience level and at least one role')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data = {
                experience_level: experienceLevel,
                preferred_roles: roles,
                preferred_industries: industries,
                location_preferences: locations,
            }

            // Save to backend (partial context update)
            await api.buildContext(data)

            onComplete(data)
            onNext()
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save details')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Details</h2>
            <p className="text-gray-600 mb-6">
                Tell us about your experience and what you're looking for
            </p>

            <div className="space-y-6">
                {/* Experience Level */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4" />
                        Experience Level *
                    </label>
                    <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select experience level</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Preferred Roles */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        Roles You're Applying For *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {COMMON_ROLES.map((role) => (
                            <button
                                key={role}
                                onClick={() => toggleRole(role)}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${roles.includes(role)
                                        ? 'bg-primary-600 text-white border-primary-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomRole()}
                            placeholder="Add custom role..."
                            className="input-field flex-1"
                        />
                        <button onClick={addCustomRole} className="btn-secondary">
                            Add
                        </button>
                    </div>
                    {roles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <span
                                    key={role}
                                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded flex items-center gap-1"
                                >
                                    {role}
                                    <button
                                        onClick={() => setRoles(roles.filter((r) => r !== role))}
                                        className="hover:text-primary-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preferred Industries */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Building2 className="w-4 h-4" />
                        Preferred Industries (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {COMMON_INDUSTRIES.map((industry) => (
                            <button
                                key={industry}
                                onClick={() => toggleIndustry(industry)}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${industries.includes(industry)
                                        ? 'bg-primary-600 text-white border-primary-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                                    }`}
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customIndustry}
                            onChange={(e) => setCustomIndustry(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomIndustry()}
                            placeholder="Add custom industry..."
                            className="input-field flex-1"
                        />
                        <button onClick={addCustomIndustry} className="btn-secondary">
                            Add
                        </button>
                    </div>
                </div>

                {/* Location Preferences */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        Location Preferences (Optional)
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                            placeholder="e.g., San Francisco, Remote, New York"
                            className="input-field flex-1"
                        />
                        <button onClick={addLocation} className="btn-secondary">
                            Add
                        </button>
                    </div>
                    {locations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {locations.map((location) => (
                                <span
                                    key={location}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded flex items-center gap-1"
                                >
                                    {location}
                                    <button
                                        onClick={() => removeLocation(location)}
                                        className="hover:text-gray-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="btn-secondary flex-1">
                    ← Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={loading || !experienceLevel || roles.length === 0}
                    className="btn-primary flex-1"
                >
                    {loading ? 'Saving...' : 'Continue to Outreach Type →'}
                </button>
            </div>
        </div>
    )
}

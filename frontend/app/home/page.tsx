'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import KPICards from '@/components/dashboard/KPICards'
import QuickActionPanel from '@/components/dashboard/QuickActionPanel'
import StatusPanel from '@/components/dashboard/StatusPanel'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import Recommendations from '@/components/dashboard/Recommendations'
import { api } from '@/lib/api'

interface DashboardData {
  kpis: {
    newMails: number
    mailsSent: number
    underReview: number
    rejected: number
  }
  status: {
    resumeUploaded: boolean
    contextComplete: boolean
    smtpConnected: boolean
    aiScanStatus: 'idle' | 'processing' | 'error'
  }
  activities: any[]
  recommendations: any[]
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    kpis: {
      newMails: 0,
      mailsSent: 0,
      underReview: 0,
      rejected: 0,
    },
    status: {
      resumeUploaded: false,
      contextComplete: false,
      smtpConnected: false,
      aiScanStatus: 'idle',
    },
    activities: [],
    recommendations: [],
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load all dashboard data in parallel
      const [statsRes, resumeRes, contextRes, smtpRes, emailsRes, activityRes] = await Promise.allSettled([
        api.getUserStats(),
        api.getCurrentResume(),
        api.getContextProfile(),
        api.getSmtpConfig(),
        api.getEmails(),
        api.getActivityFeed(10),
      ])

      // Process KPIs from emails
      let kpis = {
        newMails: 0,
        mailsSent: 0,
        underReview: 0,
        rejected: 0,
      }

      if (emailsRes.status === 'fulfilled' && emailsRes.value?.data?.emails) {
        const emails = emailsRes.value.data.emails
        kpis = {
          newMails: emails.filter((e: any) => e.status === 'new').length,
          mailsSent: emails.filter((e: any) => e.sent_at).length,
          underReview: emails.filter((e: any) => e.status === 'under_review').length,
          rejected: emails.filter((e: any) => e.status === 'rejected').length,
        }
      }

      // Process status
      const hasResume = resumeRes.status === 'fulfilled' && resumeRes.value?.data?.is_upload_completed
      const hasContext = contextRes.status === 'fulfilled' && contextRes.value?.data !== null
      const hasSmtp = smtpRes.status === 'fulfilled' && smtpRes.value?.data !== null

      const status = {
        resumeUploaded: hasResume || false,
        contextComplete: hasContext || false,
        smtpConnected: hasSmtp || false,
        aiScanStatus: 'idle' as const,
      }

      // Process activities
      const activities = activityRes.status === 'fulfilled' && activityRes.value?.data?.events
        ? activityRes.value.data.events
        : []

      // Generate recommendations based on status
      const recommendations = generateRecommendations(status, kpis)

      setDashboardData({
        kpis,
        status,
        activities,
        recommendations,
      })

      // Check if setup is incomplete and redirect
      if (!hasResume || !hasContext) {
        // Show a brief message before redirecting
        setTimeout(() => {
          router.push('/setup')
        }, 2000)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRecommendations = (status: any, kpis: any) => {
    const recs = []

    if (!status.resumeUploaded) {
      recs.push({
        id: '1',
        type: 'tip',
        message: 'Upload your resume to get started with AI-powered outreach.',
        action: { label: 'Upload Resume', href: '/setup' },
      })
    }

    if (!status.smtpConnected && status.resumeUploaded && status.contextComplete) {
      recs.push({
        id: '2',
        type: 'suggestion',
        message: 'Connect your email to start sending outreach messages automatically.',
        action: { label: 'Setup SMTP', href: '/settings' },
      })
    }

    if (kpis.newMails > 5) {
      recs.push({
        id: '3',
        type: 'insight',
        message: `You have ${kpis.newMails} new draft emails waiting for review.`,
        action: { label: 'Review Emails', href: '/emails' },
      })
    }

    if (status.resumeUploaded && status.contextComplete && kpis.mailsSent === 0) {
      recs.push({
        id: '4',
        type: 'tip',
        message: 'Start an outreach scan to find companies and generate personalized emails.',
      })
    }

    return recs
  }

  const handleStartScan = async () => {
    try {
      setScanning(true)
      await api.startOutreachScan()

      // Update AI scan status
      setDashboardData({
        ...dashboardData,
        status: {
          ...dashboardData.status,
          aiScanStatus: 'processing',
        },
      })

      // Reload dashboard data after a delay
      setTimeout(() => {
        loadDashboardData()
      }, 3000)
    } catch (error: any) {
      console.error('Error starting scan:', error)
      alert(error.response?.data?.detail || 'Failed to start scan')
    } finally {
      setScanning(false)
    }
  }

  const handleUploadCSV = async (file: File) => {
    try {
      await api.uploadCompanyCSV(file)

      // Reload dashboard data
      await loadDashboardData()
    } catch (error: any) {
      console.error('Error uploading CSV:', error)
      throw new Error(error.response?.data?.detail || 'Failed to upload CSV')
    }
  }

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's your outreach overview.
          </p>
        </div>

        {/* KPI Cards */}
        <KPICards data={dashboardData.kpis} loading={loading} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Status */}
          <div className="lg:col-span-1 space-y-6">
            <QuickActionPanel
              onStartScan={handleStartScan}
              onUploadCSV={handleUploadCSV}
              scanning={scanning}
            />
            <StatusPanel status={dashboardData.status} loading={loading} />
          </div>

          {/* Right Column - Activity & Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityTimeline events={dashboardData.activities} loading={loading} />
            <Recommendations recommendations={dashboardData.recommendations} loading={loading} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

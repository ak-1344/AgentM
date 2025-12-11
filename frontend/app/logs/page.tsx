'use client'

import { useEffect, useState, useRef } from 'react'
import AppLayout from '@/components/AppLayout'
import { Terminal, RefreshCw, Filter, Download, X } from 'lucide-react'
import { api } from '@/lib/api'
import type { LogEntry } from '@/types/email'

const LOG_LEVELS = ['all', 'info', 'warning', 'error', 'success'] as const
type LogLevel = typeof LOG_LEVELS[number]

const LOG_COLORS = {
  info: 'text-blue-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  success: 'text-green-400',
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<LogLevel>('all')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 3000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const fetchLogs = async () => {
    try {
      const response = await api.getLogs(100)
      setLogs(response.data.logs || [])
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filter === 'all' || log.level === filter
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesLevel && matchesSearch
  })

  const downloadLogs = () => {
    const logsText = filteredLogs.map(log => 
      `[${new Date(log.timestamp).toISOString()}] [${log.level.toUpperCase()}] [${log.category}] ${log.message}`
    ).join('\n')
    
    const blob = new Blob([logsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-m-logs-${new Date().toISOString()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Live Logs</h1>
                <p className="text-gray-600 mt-1">Real-time system activity and events</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Auto-refresh</span>
              </label>

              <button
                onClick={fetchLogs}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={downloadLogs}
                className="btn-outline flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as LogLevel)}
              className="input-field py-2"
            >
              {LOG_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="input-field w-full pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-600">
              Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> logs
            </span>
          </div>
        </div>

        <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-auto font-mono text-sm">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading logs...</div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">No logs found</div>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex gap-3 hover:bg-gray-800 px-2 py-1 rounded">
                  <span className="text-gray-500 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>

                  <span className={`${LOG_COLORS[log.level]} font-semibold flex-shrink-0 w-20`}>
                    [{log.level.toUpperCase()}]
                  </span>

                  <span className="text-purple-400 flex-shrink-0">
                    [{log.category}]
                  </span>

                  <span className="text-gray-300 flex-1">
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          {autoRefresh && (
            <span>Auto-refreshing every 3 seconds • </span>
          )}
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </AppLayout>
  )
}

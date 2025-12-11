'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
    Home,
    User,
    Mail,
    Terminal,
    Settings,
    LogOut,
    PanelLeft,
    Menu,
} from 'lucide-react'

const NAV_ITEMS = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/emails', label: 'Emails', icon: Mail },
    { href: '/logs', label: 'Logs', icon: Terminal },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) {
        return null
    }

    const showExpanded = !isCollapsed
    const sidebarWidth = showExpanded ? 'w-64' : 'w-16'

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`
          ${sidebarWidth} 
          fixed left-0 top-0 h-screen
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          z-50
          shadow-sm
        `}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {showExpanded ? (
                        <>
                            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg text-gray-900">Agent M</span>
                            </Link>
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Collapse sidebar"
                            >
                                <PanelLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 w-full">
                            <Link href="/" className="hover:opacity-80 transition-opacity" title="Go to homepage">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                            </Link>
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Expand sidebar"
                            >
                                <PanelLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all group relative
                  ${isActive
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                  ${!showExpanded ? 'justify-center' : ''}
                `}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                                {showExpanded && (
                                    <span>{item.label}</span>
                                )}

                                {/* Tooltip for collapsed state */}
                                {!showExpanded && (
                                    <div className="
                    absolute left-full ml-2 px-2 py-1 
                    bg-gray-900 text-white text-sm rounded
                    opacity-0 group-hover:opacity-100
                    pointer-events-none whitespace-nowrap
                    transition-opacity z-50
                  ">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section at Bottom */}
                <div className="border-t border-gray-200">
                    {/* Settings */}
                    <Link
                        href="/settings"
                        className={`
              flex items-center gap-3 px-3 py-2.5 m-3 rounded-lg
              transition-all group relative
              ${pathname === '/settings'
                                ? 'bg-primary-50 text-primary-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }
              ${!showExpanded ? 'justify-center' : ''}
            `}
                    >
                        <Settings className={`w-5 h-5 flex-shrink-0 ${pathname === '/settings' ? 'text-primary-600' : 'text-gray-500'}`} />
                        {showExpanded && <span>Settings</span>}

                        {!showExpanded && (
                            <div className="
                absolute left-full ml-2 px-2 py-1 
                bg-gray-900 text-white text-sm rounded
                opacity-0 group-hover:opacity-100
                pointer-events-none whitespace-nowrap
                transition-opacity z-50
              ">
                                Settings
                            </div>
                        )}
                    </Link>

                    {/* User Profile */}
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                        {showExpanded ? (
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-semibold text-white shadow-sm">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                    title="Sign out"
                                >
                                    <LogOut className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleSignOut}
                                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm group relative"
                                    title="Sign out"
                                >
                                    {user.email?.[0].toUpperCase()}

                                    <div className="
                      absolute left-full ml-2 px-2 py-1 
                      bg-gray-900 text-white text-sm rounded
                      opacity-0 group-hover:opacity-100
                      pointer-events-none whitespace-nowrap
                      transition-opacity z-50
                    ">
                                        {user.email}
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`
        ${showExpanded ? 'ml-64' : 'ml-16'}
        flex-1 transition-all duration-300 ease-in-out
        min-h-screen
      `}>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

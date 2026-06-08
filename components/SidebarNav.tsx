'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, Users, KanbanSquare,
  Shield, LogOut, ChevronLeft, ChevronRight, X,
} from 'lucide-react'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const navItems = [
  { href: '/dashboard',            label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/jobs',       label: 'Jobs',       icon: Briefcase       },
  { href: '/dashboard/candidates', label: 'Candidates', icon: Users           },
  { href: '/dashboard/kanban',     label: 'Pipeline',   icon: KanbanSquare    },
]

const adminItems = [
  { href: '/dashboard/admin', label: 'Admin', icon: Shield },
]

export default function SidebarNav({ profile, mobileOpen = false, onMobileClose }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  async function handleSignOut() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isAdmin = profile?.role === 'admin'
  const items   = isAdmin ? [...navItems, ...adminItems] : navItems

  const inner = (isMobile: boolean) => {
    const showLabel = isMobile || !collapsed
    return (
      <>
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: '#52371C' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #EF8547, #C19265)' }}
          >
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          {showLabel && (
            <span className="text-white font-bold text-base tracking-tight flex-1">
              Devotion ATS
            </span>
          )}
          {isMobile && (
            <button onClick={onMobileClose} style={{ color: '#C8A882', cursor: 'pointer' }}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center justify-center w-5 h-5 rounded-full border z-10"
            style={{
              marginLeft: collapsed ? '60px' : '228px',
              marginTop: '56px',
              background: '#6E4A26',
              borderColor: '#A97444',
              position: 'relative',
              alignSelf: 'flex-end',
              transition: 'margin 0.3s',
              cursor: 'pointer',
            }}
          >
            {collapsed
              ? <ChevronRight className="w-3 h-3 text-white" />
              : <ChevronLeft className="w-3 h-3 text-white" />}
          </button>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                title={!showLabel ? label : undefined}
                onClick={isMobile ? onMobileClose : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                style={{
                  background: active ? 'rgba(239, 133, 71, 0.2)' : 'transparent',
                  color: active ? '#F5A472' : '#C8A882',
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {showLabel && <span className="text-sm font-medium">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User + sign out */}
        <div className="border-t p-3" style={{ borderColor: '#52371C' }}>
          {showLabel && (
            <div
              className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg, #EF8547, #C19265)', color: 'white' }}
              >
                {profile?.full_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs truncate" style={{ color: '#9B7A5A' }}>
                  {isAdmin ? 'Admin' : profile?.company_name || 'Customer'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            title={!showLabel ? 'Sign out' : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all"
            style={{ color: '#9B7A5A', cursor: 'pointer' }}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {showLabel && <span className="text-sm">Sign out</span>}
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col transition-all duration-300 border-r shrink-0"
        style={{
          width: collapsed ? '72px' : '240px',
          background: '#3D2B1A',
          borderColor: '#52371C',
        }}
      >
        {inner(false)}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={onMobileClose}
          />
          <aside
            className="relative flex flex-col w-72 h-full overflow-y-auto"
            style={{ background: '#3D2B1A' }}
          >
            {inner(true)}
          </aside>
        </div>
      )}
    </>
  )
}

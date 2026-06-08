import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Briefcase, Users, TrendingUp, Calendar, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()

  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  // Fetch stats
  const [jobsRes, candidatesRes] = await Promise.all([
    adminSupabase
      .from('jobs')
      .select('id, title, status, created_at')
      .eq('owner_id', user.id),
    adminSupabase
      .from('candidates')
      .select('id, full_name, created_at, stage_id')
      .eq('owner_id', user.id),
  ])

  const jobs = jobsRes.data || []
  const candidates = candidatesRes.data || []

  const openJobs = jobs.filter(j => j.status === 'open').length
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const newThisWeek = candidates.filter(c => c.created_at > weekAgo).length
  const inPipeline = candidates.filter(c => c.stage_id).length

  const stats = [
    {
      label: 'Active Jobs',
      value: openJobs,
      sub: `${jobs.length} total`,
      icon: Briefcase,
      color: '#EF8547',
      bg: '#FEEEE3',
    },
    {
      label: 'Total Candidates',
      value: candidates.length,
      sub: `+${newThisWeek} this week`,
      icon: Users,
      color: '#A97444',
      bg: '#F2E8DC',
    },
    {
      label: 'In Pipeline',
      value: inPipeline,
      sub: 'across all stages',
      icon: TrendingUp,
      color: '#8B5E32',
      bg: '#E5D0B8',
    },
    {
      label: 'Open Roles',
      value: openJobs,
      sub: 'need candidates',
      icon: Calendar,
      color: '#C19265',
      bg: '#F9C4A0',
    },
  ]

  const recentJobs = [...jobs].reverse().slice(0, 4)
  const recentCandidates = [...candidates].reverse().slice(0, 5)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-1"
          style={{ color: '#3D2B1A' }}
        >
          {(() => {
            const h = new Date().getHours()
            return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
          })()}, {profile?.full_name?.split(' ')[0]}
        </h1>
        <p className="text-sm" style={{ color: '#9B8070' }}>
          Here's what's happening with your hiring pipeline today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-5 border"
            style={{ background: 'white', borderColor: '#E5D0B8' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: bg }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-3xl font-bold mb-1" style={{ color: '#3D2B1A' }}>
              {value}
            </p>
            <p className="text-sm font-medium mb-0.5" style={{ color: '#3D2B1A' }}>
              {label}
            </p>
            <p className="text-xs" style={{ color: '#9B8070' }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Jobs + Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Recent Jobs */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'white', borderColor: '#E5D0B8' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: '#3D2B1A' }}>
              Recent Jobs
            </h2>
            <Link
              href="/dashboard/jobs"
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: '#EF8547' }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-8 h-8 mx-auto mb-3" style={{ color: '#D4B48E' }} />
              <p className="text-sm mb-4" style={{ color: '#9B8070' }}>
                No jobs posted yet
              </p>
              <Link
                href="/dashboard/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #EF8547, #C19265)' }}
              >
                <Plus className="w-3.5 h-3.5" /> Post a job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map(job => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: '#FAF5F0' }}
                >
                  <p className="text-sm font-medium" style={{ color: '#3D2B1A' }}>
                    {job.title}
                  </p>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: job.status === 'open' ? '#FEEEE3' : '#E5D0B8',
                      color: job.status === 'open' ? '#9C421B' : '#6E4A26',
                    }}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Candidates */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'white', borderColor: '#E5D0B8' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: '#3D2B1A' }}>
              Recent Candidates
            </h2>
            <Link
              href="/dashboard/candidates"
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: '#EF8547' }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentCandidates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-3" style={{ color: '#D4B48E' }} />
              <p className="text-sm mb-4" style={{ color: '#9B8070' }}>
                No candidates added yet
              </p>
              <Link
                href="/dashboard/candidates"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #EF8547, #C19265)' }}
              >
                <Plus className="w-3.5 h-3.5" /> Add candidate
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCandidates.map(candidate => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#FAF5F0' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #FCDCC7, #F9C4A0)',
                      color: '#6E4A26',
                    }}
                  >
                    {candidate.full_name[0].toUpperCase()}
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#3D2B1A' }}>
                    {candidate.full_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: 'linear-gradient(135deg, #FFF8F3, #FEEEE3)',
          borderColor: '#F9C4A0',
        }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: '#6B4E38' }}>
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/dashboard/jobs', label: 'Post New Job', primary: true },
            { href: '/dashboard/candidates', label: 'Add Candidate', primary: false },
            { href: '/dashboard/kanban', label: 'View Pipeline', primary: false },
          ].map(({ href, label, primary }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: primary
                  ? 'linear-gradient(135deg, #EF8547, #C19265)'
                  : 'white',
                color: primary ? 'white' : '#6B4E38',
                border: primary ? 'none' : '1.5px solid #E5D0B8',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
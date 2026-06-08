'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Briefcase } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #FEEEE3 40%, #FFF5D6 100%)' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #E5D0B8 0%, #C19265 50%, #A97444 100%)' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-90 h-90 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FFD970, transparent)' }}
        />
        <div
          className="absolute -bottom-15 -left-15 w-70 h-70 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FFF8F3, transparent)' }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,248,243,0.2)' }}
          >
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Devotion ATS
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Hire smarter,<br />
            <em>faster.</em>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-sm">
            Track every candidate, across every stage - with AI-powered insights
            that help you make better hiring decisions.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Visual Kanban pipeline',
              'AI candidate assessment',
              'One-click job posting',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: '#FFD970' }}
                />
                <span className="text-white/90 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-sm relative z-10">
          The right talent, found at the right time.
        </p>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#A97444' }}
            >
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl" style={{ color: '#3D2B1A' }}>
              Devotion ATS
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: '#3D2B1A' }}
            >
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: '#9B8070' }}>
              Sign in to your Devotion ATS account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: '#6B4E38' }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                style={{
                  border: '1.5px solid #E5D0B8',
                  background: 'rgba(255,255,255,0.8)',
                  color: '#3D2B1A',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#EF8547')}
                onBlur={(e) => (e.target.style.borderColor = '#E5D0B8')}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: '#6B4E38' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm transition-all duration-200"
                  style={{
                    border: '1.5px solid #E5D0B8',
                    background: 'rgba(255,255,255,0.8)',
                    color: '#3D2B1A',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#EF8547')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5D0B8')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#9B8070' }}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  background: '#FEEEE3',
                  border: '1px solid #F9C4A0',
                  color: '#9C421B',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200"
              style={{
                background: loading
                  ? '#D4B48E'
                  : 'linear-gradient(135deg, #EF8547 0%, #C19265 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(169, 116, 68, 0.3)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <Link
              href="/auth/forgot-password"
              className="block text-xs font-medium"
              style={{ color: '#EF8547' }}
            >
              Forgot your password?
            </Link>
            <p className="text-xs" style={{ color: '#9B8070' }}>
              Don't have access? Contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
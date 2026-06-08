'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Briefcase, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #FEEEE3 40%, #FFF5D6 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
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

        {sent ? (
          // Success state
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'white', border: '1px solid #E5D0B8' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#FEEEE3' }}
            >
              <span className="text-2xl">📬</span>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#3D2B1A' }}>
              Check your email
            </h2>
            <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
              We sent a password reset link to{' '}
              <strong style={{ color: '#3D2B1A' }}>{email}</strong>.
              Check your inbox and click the link.
            </p>
            <Link
              href="/auth/login"
              className="text-sm font-medium"
              style={{ color: '#EF8547' }}
            >
              Back to login
            </Link>
          </div>
        ) : (
          // Form state
          <div
            className="rounded-2xl p-8"
            style={{ background: 'white', border: '1px solid #E5D0B8' }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#3D2B1A' }}>
              Forgot password?
            </h2>
            <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#6B4E38' }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: '1.5px solid #E5D0B8',
                    background: 'white',
                    color: '#3D2B1A',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#EF8547')}
                  onBlur={e => (e.target.style.borderColor = '#E5D0B8')}
                />
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: loading
                    ? '#D4B48E'
                    : 'linear-gradient(135deg, #EF8547, #C19265)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <Link
              href="/auth/login"
              className="flex items-center gap-2 mt-6 text-sm font-medium"
              style={{ color: '#9B8070' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
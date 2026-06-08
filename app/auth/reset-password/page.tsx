'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [ready, setReady]               = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase puts the token in the URL hash
    // The client picks it up automatically on load
    const checkSession = async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      } else {
        setError('Invalid or expired reset link. Please request a new one.')
      }
    }
    checkSession()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
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

        <div
          className="rounded-2xl p-8"
          style={{ background: 'white', border: '1px solid #E5D0B8' }}
        >
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#3D2B1A' }}>
            Set new password
          </h2>
          <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
            Choose a strong password for your account.
          </p>

          {!ready && !error && (
            <div className="text-center py-4">
              <p className="text-sm" style={{ color: '#9B8070' }}>
                Verifying reset link...
              </p>
            </div>
          )}

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm mb-4"
              style={{
                background: '#FEEEE3',
                border: '1px solid #F9C4A0',
                color: '#9C421B',
              }}
            >
              {error}
            </div>
          )}

          {ready && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#6B4E38' }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: '1.5px solid #E5D0B8',
                      background: 'white',
                      color: '#3D2B1A',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#EF8547')}
                    onBlur={e => (e.target.style.borderColor = '#E5D0B8')}
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

              {/* Confirm password */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#6B4E38' }}
                >
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  placeholder="Re-enter your password"
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
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
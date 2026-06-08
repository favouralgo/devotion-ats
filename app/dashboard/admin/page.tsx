'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Shield, Users, Trash2,
  Pencil, Crown, Building2, Eye, EyeOff,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'customer'
  company_name: string | null
  created_at: string
}

// User Modal for creating/editing users

function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: Profile | null
  onClose: () => void
  onSave: (data: Partial<Profile> & { password?: string }) => Promise<void>
}) {
  const [form, setForm] = useState({
    email:        user?.email        ?? '',
    password:     '',
    full_name:    user?.full_name    ?? '',
    role:         user?.role         ?? 'customer',
    company_name: user?.company_name ?? '',
  })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const input = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all'
  const inputStyle = { border: '1.5px solid #E5D0B8', background: 'white', color: '#3D2B1A' }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#EF8547')
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#E5D0B8')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(form)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setSaving(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(61,43,26,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{ background: '#FFF8F3', border: '1px solid #E5D0B8' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#E5D0B8' }}
        >
          <h2 className="text-lg font-bold" style={{ color: '#3D2B1A'} }>
            {user ? 'Edit Account' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none"
            style={{ color: '#9B8070' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Email *
            </label>
            <input
              type="email"
              className={`${input} ${user ? 'opacity-60' : ''}`}
              style={inputStyle}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={focus} onBlur={blur}
              required
              disabled={!!user}
              placeholder="user@company.com"
            />
          </div>

          {/* Password - only on create */}
          {!user && (
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={input}
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={focus} onBlur={blur}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9B8070', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Full name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Full Name
            </label>
            <input
              className={input}
              style={inputStyle}
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              onFocus={focus} onBlur={blur}
              placeholder="Jane Doe"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Role
            </label>
            <select
              className={input}
              style={inputStyle}
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as 'admin' | 'customer' })}
              onFocus={focus} onBlur={blur}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Company Name
            </label>
            <input
              className={input}
              style={inputStyle}
              value={form.company_name}
              onChange={e => setForm({ ...form, company_name: e.target.value })}
              onFocus={focus} onBlur={blur}
              placeholder="Acme Corp"
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FEEEE3', border: '1px solid #F9C4A0', color: '#9C421B' }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
              style={{ borderColor: '#E5D0B8', color: '#6B4E38', background: 'white' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{
                background: saving ? '#D4B48E' : 'linear-gradient(135deg, #EF8547, #C19265)',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : user ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Modal 

function DeleteModal({
  user,
  onClose,
  onConfirm,
}: {
  user: Profile
  onClose: () => void
  onConfirm: () => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)

  async function handle() {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(61,43,26,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-6"
        style={{ background: '#FFF8F3', border: '1px solid #E5D0B8' }}
      >
        <h2 className="text-lg font-bold mb-2" style={{ color: '#3D2B1A' }}>
          Delete Account
        </h2>
        <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: '#3D2B1A' }}>{user.full_name || user.email}</strong>?
          All their data will be permanently lost.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
            style={{ borderColor: '#E5D0B8', color: '#6B4E38', background: 'white' }}
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: '#C0391B', cursor: deleting ? 'not-allowed' : 'pointer' }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Page 

export default function AdminPage() {
  const [users, setUsers]           = useState<Profile[]>([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editUser, setEditUser]     = useState<Profile | null>(null)
  const [deleteUser, setDeleteUser] = useState<Profile | null>(null)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const res = await fetch('/api/admin')
    if (res.ok) {
      setUsers(await res.json())
    }
    setLoading(false)
  }

  async function handleSave(formData: Partial<Profile> & { password?: string }) {
    let res
    if (editUser) {
      res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editUser.id, ...formData }),
      })
    } else {
      res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to save')

    setShowModal(false)
    setEditUser(null)
    fetchUsers()
  }

  async function handleDelete() {
    if (!deleteUser) return
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteUser.id }),
    })
    setDeleteUser(null)
    fetchUsers()
  }

  const admins    = users.filter(u => u.role === 'admin')
  const customers = users.filter(u => u.role === 'customer')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: '#3D2B1A' }}
          >
            <Shield className="w-7 h-7" style={{ color: '#EF8547' }} />
            Admin Panel
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9B8070' }}>
            {users.length} accounts · {admins.length} admin{admins.length !== 1 ? 's' : ''} · {customers.length} customer{customers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setEditUser(null); setShowModal(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #EF8547, #C19265)',
            boxShadow: '0 4px 12px rgba(169,116,68,0.3)',
            cursor: 'pointer',
          }}
        >
          <Plus className="w-4 h-4" /> Create Account
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Accounts', value: users.length,     icon: Users,     color: '#EF8547', bg: '#FEEEE3' },
          { label: 'Admins',         value: admins.length,    icon: Crown,     color: '#A97444', bg: '#F2E8DC' },
          { label: 'Customers',      value: customers.length, icon: Building2, color: '#8B5E32', bg: '#E5D0B8' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl border p-5"
            style={{ background: 'white', borderColor: '#E5D0B8' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: bg }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#3D2B1A' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#9B8070' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl animate-pulse"
              style={{ background: '#F2E8DC' }}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: '#E5D0B8' }}
        >
          {/* Table header */}
          <div
            className="px-5 py-3 border-b grid grid-cols-5 gap-4"
            style={{ background: '#FAF5F0', borderColor: '#E5D0B8' }}
          >
            {['User', 'Role', 'Company', 'Joined', ''].map(h => (
              <p key={h} className="text-xs font-semibold" style={{ color: '#9B8070' }}>
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {users.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ background: 'white' }}
            >
              <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#D4B48E' }} />
              <p className="text-sm" style={{ color: '#9B8070' }}>No accounts yet</p>
            </div>
          ) : (
            users.map(user => (
              <div
                key={user.id}
                className="px-5 py-4 border-b last:border-b-0 grid grid-cols-5 gap-4 items-center group"
                style={{ background: 'white', borderColor: '#F2E8DC' }}
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: user.role === 'admin'
                        ? 'linear-gradient(135deg, #EF8547, #C19265)'
                        : 'linear-gradient(135deg, #F2E8DC, #E5D0B8)',
                      color: user.role === 'admin' ? 'white' : '#6E4A26',
                    }}
                  >
                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#3D2B1A' }}>
                      {user.full_name || '—'}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#9B8070' }}>
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium w-fit"
                  style={
                    user.role === 'admin'
                      ? { background: '#FEEEE3', color: '#9C421B' }
                      : { background: '#F2E8DC', color: '#6E4A26' }
                  }
                >
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </span>

                {/* Company */}
                <p className="text-sm truncate" style={{ color: '#6B4E38' }}>
                  {user.company_name || '—'}
                </p>

                {/* Joined */}
                <p className="text-xs" style={{ color: '#9B8070' }}>
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditUser(user); setShowModal(true) }}
                    className="p-1.5 rounded-lg"
                    style={{ color: '#6B4E38', background: '#F2E8DC' }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteUser(user)}
                    className="p-1.5 rounded-lg"
                    style={{ color: '#9C421B', background: '#FEEEE3' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <UserModal
          user={editUser}
          onClose={() => { setShowModal(false); setEditUser(null) }}
          onSave={handleSave}
        />
      )}

      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
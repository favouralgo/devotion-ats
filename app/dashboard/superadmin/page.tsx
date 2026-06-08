'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Building2, Users, Trash2,
  Crown, Briefcase, UserCheck,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Organisation {
  id: string
  name: string
  owner_id: string | null
  created_at: string
  member_count: number
  admin_count: number
  customer_count: number
}

// Create Org Modal

function CreateOrgModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (data: {
    name: string
    admin_email: string
    admin_password: string
    admin_name: string
  }) => Promise<void>
}) {
  const [form, setForm] = useState({
    name:           '',
    admin_name:     '',
    admin_email:    '',
    admin_password: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const input = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all'
  const inputStyle = { border: '1.5px solid #E5D0B8', background: 'white', color: '#3D2B1A' }
  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = '#EF8547')
  const blur = (e: React.FocusEvent<HTMLInputElement>) =>
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
          <h2 className="text-lg font-bold" style={{ color: '#3D2B1A' }}>
            Create Organisation
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
          {/* Divider */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: '#C8A882' }}>
              Organisation Details
            </p>
            <div>
              <label className="block text-sm font-semibold mb-1.5"
                style={{ color: '#6B4E38' }}>
                Organisation Name *
              </label>
              <input
                className={input} style={inputStyle}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={focus} onBlur={blur}
                required
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          {/* Admin details */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: '#C8A882' }}>
              Admin Account
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#6B4E38' }}>
                  Admin Full Name
                </label>
                <input
                  className={input} style={inputStyle}
                  value={form.admin_name}
                  onChange={e => setForm({ ...form, admin_name: e.target.value })}
                  onFocus={focus} onBlur={blur}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#6B4E38' }}>
                  Admin Email *
                </label>
                <input
                  type="email"
                  className={input} style={inputStyle}
                  value={form.admin_email}
                  onChange={e => setForm({ ...form, admin_email: e.target.value })}
                  onFocus={focus} onBlur={blur}
                  required
                  placeholder="admin@acmecorp.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5"
                  style={{ color: '#6B4E38' }}>
                  Admin Password *
                </label>
                <input
                  type="password"
                  className={input} style={inputStyle}
                  value={form.admin_password}
                  onChange={e => setForm({ ...form, admin_password: e.target.value })}
                  onFocus={focus} onBlur={blur}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                />
              </div>
            </div>
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

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
              style={{ borderColor: '#E5D0B8', color: '#6B4E38', background: 'white' }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{
                background: saving ? '#D4B48E' : 'linear-gradient(135deg, #EF8547, #C19265)',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Creating...' : 'Create Organisation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Modal 

function DeleteModal({
  org,
  onClose,
  onConfirm,
}: {
  org: Organisation
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
          Delete Organisation
        </h2>
        <p className="text-sm mb-2" style={{ color: '#9B8070' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: '#3D2B1A' }}>{org.name}</strong>?
        </p>
        <p className="text-sm mb-6 font-medium" style={{ color: '#9C421B' }}>
          This will permanently delete all their jobs, candidates and accounts.
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
            onClick={handle} disabled={deleting}
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

export default function SuperAdminPage() {
  const [orgs, setOrgs]             = useState<Organisation[]>([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [deleteOrg, setDeleteOrg]   = useState<Organisation | null>(null)

  useEffect(() => { fetchOrgs() }, [])

  async function fetchOrgs() {
    setLoading(true)
    const res = await fetch('/api/organisations')
    if (res.ok) setOrgs(await res.json())
    setLoading(false)
  }

  async function handleCreate(formData: {
    name: string
    admin_email: string
    admin_password: string
    admin_name: string
  }) {
    const res = await fetch('/api/organisations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create')
    setShowModal(false)
    fetchOrgs()
  }

  async function handleDelete() {
    if (!deleteOrg) return
    await fetch('/api/organisations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteOrg.id }),
    })
    setDeleteOrg(null)
    fetchOrgs()
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: '#3D2B1A' }}
          >
            <Crown className="w-7 h-7" style={{ color: '#EF8547' }} />
            Superadmin
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9B8070' }}>
            {orgs.length} organisation{orgs.length !== 1 ? 's' : ''} on the platform
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #EF8547, #C19265)',
            boxShadow: '0 4px 12px rgba(169,116,68,0.3)',
          }}
        >
          <Plus className="w-4 h-4" /> New Organisation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Organisations',
            value: orgs.length,
            icon: Building2,
            color: '#EF8547',
            bg: '#FEEEE3',
          },
          {
            label: 'Total Admins',
            value: orgs.reduce((a, o) => a + o.admin_count, 0),
            icon: UserCheck,
            color: '#A97444',
            bg: '#F2E8DC',
          },
          {
            label: 'Total Customers',
            value: orgs.reduce((a, o) => a + o.customer_count, 0),
            icon: Users,
            color: '#8B5E32',
            bg: '#E5D0B8',
          },
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

      {/* Organisations list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl animate-pulse"
              style={{ background: '#F2E8DC' }}
            />
          ))}
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-20">
          <Building2
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: '#D4B48E' }}
          />
          <h3 className="font-bold text-lg mb-2" style={{ color: '#3D2B1A' }}>
            No organisations yet
          </h3>
          <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
            Create your first organisation to get started
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #EF8547, #C19265)' }}
          >
            Create First Organisation
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orgs.map(org => (
            <div
              key={org.id}
              className="rounded-2xl border p-5 group"
              style={{ background: 'white', borderColor: '#E5D0B8' }}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FEEEE3, #F2E8DC)' }}
                >
                  <Building2 className="w-5 h-5" style={{ color: '#EF8547' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-base"
                    style={{ color: '#3D2B1A' }}
                  >
                    {org.name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: '#9B8070' }}>
                    Created {formatDistanceToNow(new Date(org.created_at), { addSuffix: true })}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p
                      className="text-lg font-bold"
                      style={{ color: '#3D2B1A' }}
                    >
                      {org.admin_count}
                    </p>
                    <p className="text-xs" style={{ color: '#9B8070' }}>
                      Admin{org.admin_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-lg font-bold"
                      style={{ color: '#3D2B1A' }}
                    >
                      {org.customer_count}
                    </p>
                    <p className="text-xs" style={{ color: '#9B8070' }}>
                      Customer{org.customer_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-lg font-bold"
                      style={{ color: '#3D2B1A' }}
                    >
                      {org.member_count}
                    </p>
                    <p className="text-xs" style={{ color: '#9B8070' }}>
                      Total
                    </p>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => setDeleteOrg(org)}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#9C421B', background: '#FEEEE3' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <CreateOrgModal
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
        />
      )}

      {deleteOrg && (
        <DeleteModal
          org={deleteOrg}
          onClose={() => setDeleteOrg(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
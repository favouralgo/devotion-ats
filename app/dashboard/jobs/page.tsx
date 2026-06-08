'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Briefcase, MapPin, Clock,
  DollarSign, Pencil, Trash2, Search,
} from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string | null
  location: string | null
  employment_type: string
  description: string | null
  requirements: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  status: 'open' | 'paused' | 'closed'
  created_at: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  open:   { bg: '#FEEEE3', color: '#9C421B' },
  paused: { bg: '#FFF5D6', color: '#6B4600' },
  closed: { bg: '#E5D0B8', color: '#6E4A26' },
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function JobModal({
  job,
  onClose,
  onSave,
}: {
  job: Job | null
  onClose: () => void
  onSave: (data: Partial<Job>) => Promise<void>
}) {
  const [form, setForm] = useState({
    title:            job?.title            ?? '',
    department:       job?.department       ?? '',
    location:         job?.location         ?? '',
    employment_type:  job?.employment_type  ?? 'full-time',
    description:      job?.description      ?? '',
    requirements:     job?.requirements     ?? '',
    salary_min:       job?.salary_min?.toString()  ?? '',
    salary_max:       job?.salary_max?.toString()  ?? '',
    salary_currency:  job?.salary_currency  ?? 'USD',
    status:           job?.status           ?? 'open',
  })
  const [saving, setSaving] = useState(false)

  const input =
    'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all'
  const inputStyle = {
    border: '1.5px solid #E5D0B8',
    background: 'white',
    color: '#3D2B1A',
  }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#EF8547')
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#E5D0B8')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      salary_min: form.salary_min ? parseInt(form.salary_min) : null,
      salary_max: form.salary_max ? parseInt(form.salary_max) : null,
    } as Partial<Job>)
    setSaving(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(61,43,26,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: '#FFF8F3', border: '1px solid #E5D0B8' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#E5D0B8' }}
        >
          <h2 className="text-lg font-bold" style={{ color: '#3D2B1A' }}>
            {job ? 'Edit Job' : 'Post New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none"
            style={{ color: '#9B8070' }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Job Title *
            </label>
            <input
              className={input}
              style={inputStyle}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              onFocus={focus} onBlur={blur}
              required
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          {/* Department + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Department
              </label>
              <input
                className={input}
                style={inputStyle}
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="e.g. Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Location
              </label>
              <input
                className={input}
                style={inputStyle}
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="e.g. Lagos, Nigeria"
              />
            </div>
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Employment Type
              </label>
              <select
                className={input}
                style={inputStyle}
                value={form.employment_type}
                onChange={e => setForm({ ...form, employment_type: e.target.value })}
                onFocus={focus} onBlur={blur}
              >
                {['full-time','part-time','contract','internship','remote'].map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Status
              </label>
              <select
                className={input}
                style={inputStyle}
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as Job['status'] })}
                onFocus={focus} onBlur={blur}
              >
                {['open','paused','closed'].map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Job Description
            </label>
            <textarea
              className={input}
              style={inputStyle}
              rows={4}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              onFocus={focus} onBlur={blur}
              placeholder="Describe the role, responsibilities, and team..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Requirements
            </label>
            <textarea
              className={input}
              style={inputStyle}
              rows={3}
              value={form.requirements}
              onChange={e => setForm({ ...form, requirements: e.target.value })}
              onFocus={focus} onBlur={blur}
              placeholder="Required skills, qualifications, experience..."
            />
          </div>

          {/* Salary */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Min Salary
              </label>
              <input
                type="number"
                className={input}
                style={inputStyle}
                value={form.salary_min}
                onChange={e => setForm({ ...form, salary_min: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Max Salary
              </label>
              <input
                type="number"
                className={input}
                style={inputStyle}
                value={form.salary_max}
                onChange={e => setForm({ ...form, salary_max: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="80000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Currency
              </label>
              <select
                className={input}
                style={inputStyle}
                value={form.salary_currency}
                onChange={e => setForm({ ...form, salary_currency: e.target.value })}
                onFocus={focus} onBlur={blur}
              >
                {['USD','EUR','GBP','NGN','CAD','AUD'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

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
                background: saving
                  ? '#D4B48E'
                  : 'linear-gradient(135deg, #EF8547, #C19265)',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : job ? 'Save Changes' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  job,
  onClose,
  onConfirm,
}: {
  job: Job
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
          Delete Job
        </h2>
        <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
          Are you sure you want to delete <strong style={{ color: '#3D2B1A' }}>{job.title}</strong>?
          This cannot be undone.
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const [jobs, setJobs]             = useState<Job[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('all')
  const [showModal, setShowModal]   = useState(false)
  const [editJob, setEditJob]       = useState<Job | null>(null)
  const [deleteJob, setDeleteJob]   = useState<Job | null>(null)

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    setLoading(true)
    const res = await fetch('/api/jobs')
    const data = await res.json()
    setJobs(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function handleSave(formData: Partial<Job>) {
    if (editJob) {
      await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editJob.id, ...formData }),
      })
    } else {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }
    setShowModal(false)
    setEditJob(null)
    fetchJobs()
  }

  async function handleDelete() {
    if (!deleteJob) return
    await fetch('/api/jobs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteJob.id }),
    })
    setDeleteJob(null)
    fetchJobs()
  }

  const filtered = jobs.filter(j => {
    const matchSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#3D2B1A' }}>
            Jobs
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9B8070' }}>
            {jobs.length} total · {jobs.filter(j => j.status === 'open').length} open
          </p>
        </div>
        <button
          onClick={() => { setEditJob(null); setShowModal(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #EF8547, #C19265)',
            boxShadow: '0 4px 12px rgba(169,116,68,0.3)',
          }}
        >
          <Plus className="w-4 h-4" /> Post Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: '#9B8070' }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none w-64"
            style={{ border: '1.5px solid #E5D0B8', background: 'white', color: '#3D2B1A' }}
          />
        </div>

        <div className="flex gap-2">
          {['all', 'open', 'paused', 'closed'].map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: statusFilter === s ? '#EF8547' : 'white',
                color: statusFilter === s ? 'white' : '#6B4E38',
                border: `1.5px solid ${statusFilter === s ? '#EF8547' : '#E5D0B8'}`,
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl animate-pulse"
              style={{ background: '#F2E8DC' }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4B48E' }} />
          <h3 className="font-bold text-lg mb-2" style={{ color: '#3D2B1A' }}>
            No jobs found
          </h3>
          <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
            {search ? 'Try a different search term' : 'Post your first job to get started'}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #EF8547, #C19265)' }}
            >
              Post First Job
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(job => (
            <div
              key={job.id}
              className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md"
              style={{ background: 'white', borderColor: '#E5D0B8' }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate" style={{ color: '#3D2B1A' }}>
                    {job.title}
                  </h3>
                  {job.department && (
                    <p className="text-xs mt-0.5" style={{ color: '#9B8070' }}>
                      {job.department}
                    </p>
                  )}
                </div>
                <span
                  className="ml-2 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={STATUS_STYLES[job.status] ?? STATUS_STYLES.closed}
                >
                  {job.status}
                </span>
              </div>

              {/* Meta */}
              <div className="space-y-1.5 mb-4">
                {job.location && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#9B8070' }}>
                    <MapPin className="w-3 h-3" /> {job.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs" style={{ color: '#9B8070' }}>
                  <Clock className="w-3 h-3" /> {job.employment_type}
                </div>
                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#9B8070' }}>
                    <DollarSign className="w-3 h-3" />
                    {job.salary_currency}{' '}
                    {job.salary_min?.toLocaleString()}
                    {job.salary_max ? ` – ${job.salary_max.toLocaleString()}` : '+'}
                  </div>
                )}
              </div>

              {job.description && (
                <p
                  className="text-xs mb-4 line-clamp-2"
                  style={{ color: '#9B8070' }}
                >
                  {job.description}
                </p>
              )}

              {/* Actions */}
              <div
                className="flex items-center gap-2 pt-3 border-t"
                style={{ borderColor: '#F2E8DC' }}
              >
                <button
                  onClick={() => { setEditJob(job); setShowModal(true) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ color: '#6B4E38', background: '#F2E8DC' }}
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteJob(job)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ color: '#9C421B', background: '#FEEEE3' }}
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <JobModal
          job={editJob}
          onClose={() => { setShowModal(false); setEditJob(null) }}
          onSave={handleSave}
        />
      )}

      {deleteJob && (
        <DeleteModal
          job={deleteJob}
          onClose={() => setDeleteJob(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Users, Link2, Brain,
  Pencil, Trash2, Search, ChevronDown, ChevronUp,
} from 'lucide-react'

interface Stage {
  id: string
  name: string
  color: string
  position: number
}

interface Job {
  id: string
  title: string
  status: string
}

interface AIAssessment {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no'
  experience_match: number
  skills_match: number
  assessed_at: string
}

interface Candidate {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  linkedin_url: string | null
  current_position: string | null
  current_company: string | null
  years_experience: number | null
  skills: string[] | null
  notes: string | null
  rating: number | null
  ai_score: number | null
  ai_assessment: AIAssessment | null
  source: string
  job_id: string | null
  stage_id: string | null
  job: Job | null
  stage: Stage | null
  created_at: string
  assessing?: boolean
}

// Candidate Modal 

function CandidateModal({
  candidate, jobs, stages, onClose, onSave,
}: {
  candidate: Candidate | null
  jobs: Job[]
  stages: Stage[]
  onClose: () => void
  onSave: (data: Partial<Candidate>) => Promise<void>
}) {
  const [form, setForm] = useState({
    full_name:        candidate?.full_name        ?? '',
    email:            candidate?.email            ?? '',
    phone:            candidate?.phone            ?? '',
    linkedin_url:     candidate?.linkedin_url     ?? '',
    current_position: candidate?.current_position ?? '',
    current_company:  candidate?.current_company  ?? '',
    years_experience: candidate?.years_experience?.toString() ?? '',
    skills:           candidate?.skills?.join(', ') ?? '',
    notes:            candidate?.notes            ?? '',
    job_id:           candidate?.job_id           ?? '',
    stage_id:         candidate?.stage_id         ?? '',
    source:           candidate?.source           ?? 'manual',
    rating:           candidate?.rating?.toString() ?? '',
  })
  const [saving, setSaving] = useState(false)

  const input = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all'
  const inputStyle = { border: '1.5px solid #E5D0B8', background: 'white', color: '#3D2B1A' }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#EF8547')
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#E5D0B8')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      years_experience: form.years_experience ? parseInt(form.years_experience) : null,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      rating: form.rating ? parseInt(form.rating) : null,
      job_id: form.job_id || null,
      stage_id: form.stage_id || null,
    } as Partial<Candidate>)
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
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#E5D0B8' }}
        >
          <h2 className="text-lg font-bold" style={{ color: '#3D2B1A' }}>
            {candidate ? 'Edit Candidate' : 'Add Candidate'}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: '#9B8070' }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Full Name *
            </label>
            <input
              className={input} style={inputStyle}
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              onFocus={focus} onBlur={blur}
              required placeholder="Jane Doe"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Email
              </label>
              <input
                type="email" className={input} style={inputStyle}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Phone
              </label>
              <input
                className={input} style={inputStyle}
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="+234 800 0000000"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              LinkedIn URL
            </label>
            <input
              className={input} style={inputStyle}
              value={form.linkedin_url}
              onChange={e => setForm({ ...form, linkedin_url: e.target.value })}
              onFocus={focus} onBlur={blur}
              placeholder="https://linkedin.com/in/janedoe"
            />
          </div>

          {/* Current Position + Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Current Position
              </label>
              <input
                className={input} style={inputStyle}
                value={form.current_position}
                onChange={e => setForm({ ...form, current_position: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Current Company
              </label>
              <input
                className={input} style={inputStyle}
                value={form.current_company}
                onChange={e => setForm({ ...form, current_company: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          {/* Years experience + Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Years of Experience
              </label>
              <input
                type="number" min="0" max="50"
                className={input} style={inputStyle}
                value={form.years_experience}
                onChange={e => setForm({ ...form, years_experience: e.target.value })}
                onFocus={focus} onBlur={blur}
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Source
              </label>
              <select
                className={input} style={inputStyle}
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
                onFocus={focus} onBlur={blur}
              >
                {['manual','linkedin','referral','job-board','other'].map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Skills (comma-separated)
            </label>
            <input
              className={input} style={inputStyle}
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              onFocus={focus} onBlur={blur}
              placeholder="React, Node.js, TypeScript"
            />
          </div>

          {/* Job + Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Assign to Job
              </label>
              <select
                className={input} style={inputStyle}
                value={form.job_id}
                onChange={e => setForm({ ...form, job_id: e.target.value })}
                onFocus={focus} onBlur={blur}
              >
                <option value="">— No job —</option>
                {jobs.filter(j => j.status === 'open').map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
                Pipeline Stage
              </label>
              <select
                className={input} style={inputStyle}
                value={form.stage_id}
                onChange={e => setForm({ ...form, stage_id: e.target.value })}
                onFocus={focus} onBlur={blur}
              >
                <option value="">— No stage —</option>
                {stages.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Rating
            </label>
            <select
              className={input} style={inputStyle}
              value={form.rating}
              onChange={e => setForm({ ...form, rating: e.target.value })}
              onFocus={focus} onBlur={blur}
            >
              <option value="">Not rated</option>
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{'★'.repeat(n)}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#6B4E38' }}>
              Notes
            </label>
            <textarea
              className={input} style={inputStyle}
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              onFocus={focus} onBlur={blur}
              placeholder="Internal notes about this candidate..."
            />
          </div>

          {/* Actions */}
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
              {saving ? 'Saving...' : candidate ? 'Save Changes' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Modal 

function DeleteModal({
  candidate, onClose, onConfirm,
}: {
  candidate: Candidate
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
          Delete Candidate
        </h2>
        <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: '#3D2B1A' }}>{candidate.full_name}</strong>?
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

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs]             = useState<Job[]>([])
  const [stages, setStages]         = useState<Stage[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [jobFilter, setJobFilter]   = useState('all')
  const [showModal, setShowModal]   = useState(false)
  const [editCandidate, setEdit]    = useState<Candidate | null>(null)
  const [deleteCandidate, setDelete] = useState<Candidate | null>(null)
  const [expandedId, setExpanded]   = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [cRes, jRes, sRes] = await Promise.all([
      fetch('/api/candidates'),
      fetch('/api/jobs'),
      fetch('/api/stages'),
    ])
    setCandidates(await cRes.json() || [])
    setJobs(await jRes.json() || [])
    setStages(await sRes.json() || [])
    setLoading(false)
  }

  async function handleSave(formData: Partial<Candidate>) {
    if (editCandidate) {
      await fetch('/api/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editCandidate.id, ...formData }),
      })
    } else {
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }
    setShowModal(false)
    setEdit(null)
    fetchAll()
  }

  async function handleDelete() {
    if (!deleteCandidate) return
    await fetch('/api/candidates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteCandidate.id }),
    })
    setDelete(null)
    fetchAll()
  }

  async function handleAssess(candidateId: string) {
    const candidate = candidates.find(c => c.id === candidateId)
    if (!candidate) return

    const job = candidate.job_id ? jobs.find(j => j.id === candidate.job_id) : null

    setCandidates(prev =>
      prev.map(c => c.id === candidateId ? { ...c, assessing: true } : c)
    )

    const res = await fetch('/api/ai-assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_id: candidateId,
        job_description: job
          ? `${job.title}\n${(job as any).description || ''}\n${(job as any).requirements || ''}`
          : '',
        candidate_info: {
          full_name:        candidate.full_name,
          current_position: candidate.current_position,
          current_company:  candidate.current_company,
          years_experience: candidate.years_experience,
          skills:           candidate.skills,
          linkedin_url:     candidate.linkedin_url,
          notes:            candidate.notes,
        },
      }),
    })

    const data = await res.json()

    if (data.assessment) {
      setCandidates(prev =>
        prev.map(c =>
          c.id === candidateId
            ? { ...c, ai_score: data.assessment.score, ai_assessment: data.assessment, assessing: false }
            : c
        )
      )
    }
  }

  const filtered = candidates.filter(c => {
    const matchSearch =
      !search ||
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.current_position?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    const matchJob = jobFilter === 'all' || c.job_id === jobFilter
    return matchSearch && matchJob
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#3D2B1A' }}>
            Candidates
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9B8070' }}>
            {candidates.length} total candidates
          </p>
        </div>
        <button
          onClick={() => { setEdit(null); setShowModal(true) }}
          className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
          style={{
            background: 'linear-gradient(135deg, #EF8547, #C19265)',
            boxShadow: '0 4px 12px rgba(169,116,68,0.3)',
            cursor: 'pointer',
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Candidate</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: '#9B8070' }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none w-full sm:w-64"
            style={{ border: '1.5px solid #E5D0B8', background: 'white', color: '#3D2B1A' }}
          />
        </div>
        <select
          value={jobFilter}
          onChange={e => setJobFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none w-full sm:w-auto"
          style={{ border: '1.5px solid #E5D0B8', background: 'white', color: '#6B4E38' }}
        >
          <option value="all">All Jobs</option>
          {jobs.map(j => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl animate-pulse"
              style={{ background: '#F2E8DC' }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4B48E' }} />
          <h3 className="font-bold text-lg mb-2" style={{ color: '#3D2B1A' }}>
            No candidates yet
          </h3>
          <p className="text-sm mb-6" style={{ color: '#9B8070' }}>
            {search ? 'Try a different search term' : 'Add your first candidate to start tracking'}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #EF8547, #C19265)' }}
            >
              Add First Candidate
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const expanded = expandedId === c.id
            const assessment = c.ai_assessment

            return (
              <div
                key={c.id}
                className="rounded-2xl border transition-all"
                style={{ background: 'white', borderColor: '#E5D0B8' }}
              >
                {/* Row */}
                <div className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #FCDCC7, #F9C4A0)',
                      color: '#6E4A26',
                    }}
                  >
                    {c.full_name[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: '#3D2B1A' }}>
                        {c.full_name}
                      </span>
                      {c.rating && (
                        <span className="text-xs" style={{ color: '#FFB300' }}>
                          {'★'.repeat(c.rating)}
                        </span>
                      )}
                      {c.stage && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: c.stage.color + '25',
                            color: c.stage.color,
                            border: `1px solid ${c.stage.color}50`,
                          }}
                        >
                          {c.stage.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#9B8070' }}>
                      {[c.current_position, c.current_company].filter(Boolean).join(' @ ')}
                      {c.years_experience ? ` · ${c.years_experience}y exp` : ''}
                    </p>
                    {c.job && (
                      <p className="text-xs mt-0.5" style={{ color: '#C19265' }}>
                         {c.job.title}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  {c.skills && c.skills.length > 0 && (
                    <div className="hidden md:flex gap-1.5 flex-wrap max-w-xs">
                      {c.skills.slice(0, 3).map(s => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#F2E8DC', color: '#6E4A26' }}
                        >
                          {s}
                        </span>
                      ))}
                      {c.skills.length > 3 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#E5D0B8', color: '#6E4A26' }}
                        >
                          +{c.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* AI score */}
                  {assessment && (
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="13" fill="none" stroke="#E5D0B8" strokeWidth="3" />
                          <circle
                            cx="16" cy="16" r="13" fill="none" stroke="#EF8547" strokeWidth="3"
                            strokeDasharray={`${(assessment.score / 100) * 82} 82`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          className="absolute inset-0 flex items-center justify-center font-bold"
                          style={{ fontSize: '9px', color: '#EF8547' }}
                        >
                          {assessment.score}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Assess button */}
                  {!c.ai_assessment && (
                    <button
                      onClick={() => handleAssess(c.id)}
                      disabled={c.assessing}
                      className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all shrink-0"
                      style={{
                        background: c.assessing ? '#F2E8DC' : '#FFF5D6',
                        color: c.assessing ? '#9B8070' : '#8B5E32',
                        border: '1px solid #FFD970',
                        cursor: c.assessing ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Brain className="w-3 h-3" />
                      {c.assessing ? 'Assessing...' : 'AI Assess'}
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {c.linkedin_url && (
                      <a
                        href={c.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg"
                        style={{ color: '#0077B5' }}
                      >
                        <Link2 className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setExpanded(expanded ? null : c.id)}
                      className="p-1.5 rounded-lg"
                      style={{ color: '#9B8070' }}
                    >
                      {expanded
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setEdit(c); setShowModal(true) }}
                      className="p-1.5 rounded-lg"
                      style={{ color: '#6B4E38' }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDelete(c)}
                      className="p-1.5 rounded-lg"
                      style={{ color: '#9C421B' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded - AI assessment */}
                {expanded && (
                  <div
                    className="border-t px-4 pb-4 pt-3"
                    style={{ borderColor: '#F2E8DC' }}
                  >
                    {assessment ? (
                      <div
                        className="rounded-xl p-4"
                        style={{ background: '#FFF8F3', border: '1px solid #F9C4A0' }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="text-xs font-bold flex items-center gap-1.5"
                            style={{ color: '#8B5E32' }}
                          >
                            <Brain className="w-3.5 h-3.5" /> AI Assessment
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs" style={{ color: '#9B8070' }}>
                              {new Date(assessment.assessed_at).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => handleAssess(c.id)}
                              disabled={c.assessing}
                              className="text-xs px-2 py-1 rounded-lg font-medium"
                              style={{
                                background: c.assessing ? '#F2E8DC' : 'rgba(239,133,71,0.12)',
                                color: c.assessing ? '#C8A882' : '#EF8547',
                                cursor: c.assessing ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {c.assessing ? 'Assessing…' : 'Re-assess'}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm mb-3" style={{ color: '#3D2B1A' }}>
                          {assessment.summary}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold mb-1.5" style={{ color: '#6E4A26' }}>
                              Strengths
                            </p>
                            {assessment.strengths?.map((s, i) => (
                              <p key={i} className="text-xs mb-1" style={{ color: '#6B4E38' }}>
                                • {s}
                              </p>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-1.5" style={{ color: '#9C421B' }}>
                              Gaps
                            </p>
                            {assessment.gaps?.map((g, i) => (
                              <p key={i} className="text-xs mb-1" style={{ color: '#6B4E38' }}>
                                • {g}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div
                          className="flex gap-4 mt-3 pt-3 border-t"
                          style={{ borderColor: '#F9C4A0' }}
                        >
                          <p className="text-xs" style={{ color: '#9B8070' }}>
                            Experience match:{' '}
                            <strong style={{ color: '#6E4A26' }}>
                              {assessment.experience_match}%
                            </strong>
                          </p>
                          <p className="text-xs" style={{ color: '#9B8070' }}>
                            Skills match:{' '}
                            <strong style={{ color: '#6E4A26' }}>
                              {assessment.skills_match}%
                            </strong>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm mb-3" style={{ color: '#9B8070' }}>
                          No AI assessment yet
                        </p>
                        <button
                          onClick={() => handleAssess(c.id)}
                          disabled={c.assessing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium mx-auto"
                          style={{
                            background: c.assessing ? '#F2E8DC' : 'linear-gradient(135deg, #EF8547, #C19265)',
                            color: c.assessing ? '#C8A882' : 'white',
                            cursor: c.assessing ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <Brain className="w-3.5 h-3.5" />
                          {c.assessing ? 'Assessing…' : 'Assess with AI'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <CandidateModal
          candidate={editCandidate}
          jobs={jobs}
          stages={stages}
          onClose={() => { setShowModal(false); setEdit(null) }}
          onSave={handleSave}
        />
      )}

      {deleteCandidate && (
        <DeleteModal
          candidate={deleteCandidate}
          onClose={() => setDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

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

interface Candidate {
  id: string
  full_name: string
  email: string | null
  current_position: string | null
  current_company: string | null
  years_experience: number | null
  skills: string[] | null
  rating: number | null
  ai_score: number | null
  linkedin_url: string | null
  job_id: string | null
  stage_id: string | null
  job: Job | null
  stage: Stage | null
}

// ─── Candidate Card ───────────────────────────────────────────────────────────

function CandidateCard({
  candidate,
  onDragStart,
}: {
  candidate: Candidate
  onDragStart: (e: React.DragEvent, candidateId: string) => void
}) {
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, candidate.id)}
      className="rounded-xl border p-3 cursor-grab active:cursor-grabbing group"
      style={{
        background: 'white',
        borderColor: '#E5D0B8',
        userSelect: 'none',
      }}
    >
      {/* Name + avatar */}
      <div className="flex items-start gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FCDCC7, #F9C4A0)',
            color: '#6E4A26',
          }}
        >
          {candidate.full_name[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight truncate" style={{ color: '#3D2B1A' }}>
            {candidate.full_name}
          </p>
          {(candidate.current_position || candidate.current_company) && (
            <p className="text-xs truncate mt-0.5" style={{ color: '#9B8070' }}>
              {[candidate.current_position, candidate.current_company]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* Job */}
      {candidate.job && (
        <p className="text-xs mb-2 truncate" style={{ color: '#C19265' }}>
          📌 {candidate.job.title}
        </p>
      )}

      {/* Skills */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {candidate.skills.slice(0, 2).map(s => (
            <span
              key={s}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: '#F2E8DC', color: '#6E4A26' }}
            >
              {s}
            </span>
          ))}
          {candidate.skills.length > 2 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: '#E5D0B8', color: '#9B8070' }}
            >
              +{candidate.skills.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          {candidate.rating && (
            <span className="text-xs" style={{ color: '#FFB300' }}>
              {'★'.repeat(candidate.rating)}
            </span>
          )}
          {candidate.years_experience && (
            <span className="text-xs" style={{ color: '#9B8070' }}>
              {candidate.years_experience}y
            </span>
          )}
        </div>

        {candidate.ai_score && (
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="#E5D0B8" strokeWidth="2.5" />
              <circle
                cx="12" cy="12" r="9" fill="none" stroke="#EF8547" strokeWidth="2.5"
                strokeDasharray={`${(candidate.ai_score / 100) * 56} 56`}
                strokeLinecap="round"
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center font-bold"
              style={{ fontSize: '7px', color: '#EF8547' }}
            >
              {candidate.ai_score}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  candidates,
  onDrop,
  onDragOver,
  onDragStart,
}: {
  stage: Stage
  candidates: Candidate[]
  onDrop: (e: React.DragEvent, stageId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDragStart: (e: React.DragEvent, candidateId: string) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div className="flex-shrink-0 w-64 flex flex-col">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: stage.color }}
        />
        <span className="font-semibold text-sm flex-1" style={{ color: '#3D2B1A' }}>
          {stage.name}
        </span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: stage.color + '25', color: stage.color }}
        >
          {candidates.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDrop={e => { setIsDragOver(false); onDrop(e, stage.id) }}
        onDragOver={e => { onDragOver(e); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        className="flex-1 rounded-xl p-2 space-y-2 transition-all duration-150 overflow-y-auto"
        style={{
          background: isDragOver ? stage.color + '15' : '#FAF5F0',
          border: `2px dashed ${isDragOver ? stage.color : 'transparent'}`,
          minHeight: '120px',
          maxHeight: 'calc(100vh - 240px)',
        }}
      >
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onDragStart={onDragStart}
          />
        ))}
        {candidates.length === 0 && (
          <div className="flex items-center justify-center h-16">
            <p className="text-xs" style={{ color: '#C8A882' }}>
              Drop here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KanbanPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [stages, setStages]         = useState<Stage[]>([])
  const [jobs, setJobs]             = useState<Job[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [jobFilter, setJobFilter]   = useState('all')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [cRes, sRes, jRes] = await Promise.all([
      fetch('/api/candidates'),
      fetch('/api/stages'),
      fetch('/api/jobs'),
    ])
    setCandidates(await cRes.json() || [])
    setStages(await sRes.json() || [])
    setJobs(await jRes.json() || [])
    setLoading(false)
  }

  function handleDragStart(e: React.DragEvent, candidateId: string) {
    e.dataTransfer.setData('candidateId', candidateId)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  async function handleDrop(e: React.DragEvent, stageId: string) {
    e.preventDefault()
    const candidateId = e.dataTransfer.getData('candidateId')
    if (!candidateId) return

    // Optimistic update
    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId
          ? { ...c, stage_id: stageId, stage: stages.find(s => s.id === stageId) ?? null }
          : c
      )
    )

    await fetch('/api/candidates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: candidateId, stage_id: stageId }),
    })
  }

  // Filter candidates
  const filtered = candidates.filter(c => {
    const matchSearch =
      !search ||
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.current_position?.toLowerCase().includes(search.toLowerCase())
    const matchJob = jobFilter === 'all' || c.job_id === jobFilter
    return matchSearch && matchJob
  })

  // Unassigned candidates
  const unassigned = filtered.filter(c => !c.stage_id)

  if (loading) {
    return (
      <div className="p-8">
        <div
          className="h-8 w-48 rounded-lg animate-pulse mb-6"
          style={{ background: '#F2E8DC' }}
        />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-64 h-96 rounded-2xl animate-pulse flex-shrink-0"
              style={{ background: '#F2E8DC' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#3D2B1A' }}>
              Hiring Pipeline
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#9B8070' }}>
              {filtered.length} candidates · drag cards to move between stages
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 pb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: '#9B8070' }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by name..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-56"
              style={{
                border: '1.5px solid #E5D0B8',
                background: 'white',
                color: '#3D2B1A',
              }}
            />
          </div>
          <select
            value={jobFilter}
            onChange={e => setJobFilter(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm outline-none"
            style={{
              border: '1.5px solid #E5D0B8',
              background: 'white',
              color: '#6B4E38',
            }}
          >
            <option value="all">All Jobs</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto px-8 pb-8">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {stages.map(stage => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              candidates={filtered.filter(c => c.stage_id === stage.id)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
            />
          ))}

          {/* Unassigned column */}
          {unassigned.length > 0 && (
            <KanbanColumn
              stage={{
                id: 'unassigned',
                name: 'Unassigned',
                color: '#C8A882',
                position: 99,
              }}
              candidates={unassigned}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
            />
          )}
        </div>
      </div>
    </div>
  )
}
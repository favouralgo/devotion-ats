import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await createAdminClient()
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  const adminSupabase = createAdminClient()
  let query = adminSupabase
    .from('candidates')
    .select('*, job:jobs(id, title, status), stage:stages(id, name, color, position)')
    .order('created_at', { ascending: false })

  if (!isAdmin) {
    query = query.eq('owner_id', user.id)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const { data, error } = await createAdminClient()
    .from('candidates')
    .insert({ ...body, owner_id: user.id })
    .select('*, job:jobs(id, title), stage:stages(id, name, color, position)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log activity
  await createAdminClient()
    .from('activities')
    .insert({
      candidate_id: data.id,
      owner_id: user.id,
      type: 'note',
      content: 'Candidate added to pipeline',
    })

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, ...updates } = body

  const { data: old } = await createAdminClient()
    .from('candidates')
    .select('stage_id')
    .eq('id', id)
    .single()

  const { data, error } = await createAdminClient()
    .from('candidates')
    .update(updates)
    .eq('id', id)
    .select('*, job:jobs(id, title), stage:stages(id, name, color, position)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log stage change
  if (updates.stage_id && updates.stage_id !== old?.stage_id) {
    await createAdminClient()
      .from('activities')
      .insert({
        candidate_id: id,
        owner_id: user.id,
        type: 'stage_change',
        content: 'Moved to new stage',
        metadata: { from: old?.stage_id, to: updates.stage_id },
      })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()

  const { error } = await createAdminClient()
    .from('candidates')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
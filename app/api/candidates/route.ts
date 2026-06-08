import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await createAdminClient()
    .from('profiles')
    .select('role, organisation_id')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export async function GET() {
  const auth = await getUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { user, profile } = auth
  const adminSupabase = createAdminClient()

  let query = adminSupabase
    .from('candidates')
    .select('*, job:jobs(id, title, status), stage:stages(id, name, color, position)')
    .order('created_at', { ascending: false })

  if (profile?.role === 'superadmin') {
    // sees everything
  } else if (profile?.role === 'admin') {
    query = query.eq('organisation_id', profile.organisation_id)
  } else {
    query = query.eq('owner_id', user.id)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const auth = await getUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { user, profile } = auth
  const body = await request.json()

  const { data, error } = await createAdminClient()
    .from('candidates')
    .insert({
      ...body,
      owner_id: user.id,
      organisation_id: profile?.organisation_id ?? null,
    })
    .select('*, job:jobs(id, title), stage:stages(id, name, color, position)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await createAdminClient()
    .from('activities')
    .insert({
      candidate_id: data.id,
      owner_id: user.id,
      organisation_id: profile?.organisation_id ?? null,
      type: 'note',
      content: 'Candidate added to pipeline',
    })

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const auth = await getUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

  if (updates.stage_id && updates.stage_id !== old?.stage_id) {
    const { user, profile } = auth
    await createAdminClient()
      .from('activities')
      .insert({
        candidate_id: id,
        owner_id: user.id,
        organisation_id: profile?.organisation_id ?? null,
        type: 'stage_change',
        content: 'Moved to new stage',
        metadata: { from: old?.stage_id, to: updates.stage_id },
      })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const auth = await getUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()

  const { error } = await createAdminClient()
    .from('candidates')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
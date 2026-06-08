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
    .from('jobs')
    .select('*')
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
    .from('jobs')
    .insert({
      ...body,
      owner_id: user.id,
      organisation_id: profile?.organisation_id ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const auth = await getUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await createAdminClient()
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const auth = await getUser()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()

  const { error } = await createAdminClient()
    .from('jobs')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
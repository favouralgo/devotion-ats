import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
    .from('stages')
    .select('*')
    .order('position')

  if (profile?.role === 'superadmin') {
    // sees everything
  } else if (profile?.role === 'admin') {
    query = query.eq('organisation_id', profile.organisation_id)
  } else {
    query = query.eq('owner_id', user.id)
  }

  let { data } = await query

  // Create default stages if none exist
  if (!data || data.length === 0) {
    const defaults = [
      { owner_id: user.id, organisation_id: profile?.organisation_id ?? null, name: 'Applied',   color: '#C8A882', position: 0 },
      { owner_id: user.id, organisation_id: profile?.organisation_id ?? null, name: 'Screening', color: '#F5A472', position: 1 },
      { owner_id: user.id, organisation_id: profile?.organisation_id ?? null, name: 'Interview', color: '#EF8547', position: 2 },
      { owner_id: user.id, organisation_id: profile?.organisation_id ?? null, name: 'Technical', color: '#E06828', position: 3 },
      { owner_id: user.id, organisation_id: profile?.organisation_id ?? null, name: 'Offer',     color: '#FFD970', position: 4 },
      { owner_id: user.id, organisation_id: profile?.organisation_id ?? null, name: 'Hired',     color: '#8B5E32', position: 5 },
      { owner_id: user.id, organisation_id: profile?.organisation_id ?? null, name: 'Rejected',  color: '#9B8B7A', position: 6 },
    ]
    const { data: created } = await adminSupabase
      .from('stages')
      .insert(defaults)
      .select()
    data = created
  }

  return NextResponse.json(data || [])
}
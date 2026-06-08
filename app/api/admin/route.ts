import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function requireSuperAdminOrAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await createAdminClient()
    .from('profiles')
    .select('role, organisation_id')
    .eq('id', user.id)
    .single()

  if (!profile) return null
  if (!['superadmin', 'admin'].includes(profile.role)) return null

  return { user, profile }
}

export async function GET() {
  const auth = await requireSuperAdminOrAdmin()
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { profile } = auth
  const adminSupabase = createAdminClient()

  let query = adminSupabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .neq('role', 'superadmin')

 
  // Admins see only customers in their org (only filter if organisation_id exists)
    if (profile.role === 'admin' && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const auth = await requireSuperAdminOrAdmin()
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { profile } = auth
  const { email, password, full_name, role, company_name, organisation_id } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  // Admins can only create customers in their own org
  // Superadmin can create anyone
  const assignedOrgId = profile.role === 'superadmin'
    ? organisation_id ?? null
    : profile.organisation_id

  const assignedRole = profile.role === 'superadmin'
    ? role || 'admin'
    : 'customer'

  const { data: authData, error: authError } = await createAdminClient()
    .auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role: assignedRole },
    })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  await createAdminClient()
    .from('profiles')
    .update({
      full_name,
      role: assignedRole,
      company_name,
      organisation_id: assignedOrgId,
    })
    .eq('id', authData.user.id)

  return NextResponse.json({ success: true, user: authData.user })
}

export async function PUT(request: NextRequest) {
  const auth = await requireSuperAdminOrAdmin()
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, password, ...updates } = await request.json()

  const { data, error } = await createAdminClient()
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const auth = await requireSuperAdminOrAdmin()
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()

  const { error } = await createAdminClient()
    .auth.admin.deleteUser(id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
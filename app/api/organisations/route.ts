import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function requireSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await createAdminClient()
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') return null
  return user
}

export async function GET() {
  const user = await requireSuperAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const adminSupabase = createAdminClient()

  // Get organisations with member count
  const { data: orgs, error } = await adminSupabase
    .from('organisations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get member counts per org
  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('organisation_id, role')

  const orgsWithStats = orgs?.map(org => ({
    ...org,
    member_count: profiles?.filter(p => p.organisation_id === org.id).length || 0,
    admin_count: profiles?.filter(p => p.organisation_id === org.id && p.role === 'admin').length || 0,
    customer_count: profiles?.filter(p => p.organisation_id === org.id && p.role === 'customer').length || 0,
  }))

  return NextResponse.json(orgsWithStats)
}

export async function POST(request: NextRequest) {
  const user = await requireSuperAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, admin_email, admin_password, admin_name } = await request.json()

  if (!name || !admin_email || !admin_password) {
    return NextResponse.json(
      { error: 'Organisation name, admin email and password are required' },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  // Create organisation
  const { data: org, error: orgError } = await adminSupabase
    .from('organisations')
    .insert({ name, owner_id: user.id })
    .select()
    .single()

  if (orgError) return NextResponse.json({ error: orgError.message }, { status: 500 })

  // Create admin user for this org
  const { data: authData, error: authError } = await adminSupabase
    .auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
      user_metadata: { full_name: admin_name, role: 'admin' },
    })

  if (authError) {
    // Rollback org creation
    await adminSupabase.from('organisations').delete().eq('id', org.id)
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Update admin profile with org
  await adminSupabase
    .from('profiles')
    .update({
      full_name: admin_name,
      role: 'admin',
      organisation_id: org.id,
    })
    .eq('id', authData.user.id)

  // Update org owner to the new admin
  await adminSupabase
    .from('organisations')
    .update({ owner_id: authData.user.id })
    .eq('id', org.id)

  return NextResponse.json({ success: true, org })
}

export async function DELETE(request: NextRequest) {
  const user = await requireSuperAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()

  const { error } = await createAdminClient()
    .from('organisations')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
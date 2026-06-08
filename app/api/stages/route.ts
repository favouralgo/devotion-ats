import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminSupabase = createAdminClient()

  let { data } = await adminSupabase
    .from('stages')
    .select('*')
    .eq('owner_id', user.id)
    .order('position')

  // Create default stages if none exist
  if (!data || data.length === 0) {
    const defaults = [
      { owner_id: user.id, name: 'Applied',    color: '#C8A882', position: 0 },
      { owner_id: user.id, name: 'Screening',  color: '#F5A472', position: 1 },
      { owner_id: user.id, name: 'Interview',  color: '#EF8547', position: 2 },
      { owner_id: user.id, name: 'Technical',  color: '#E06828', position: 3 },
      { owner_id: user.id, name: 'Offer',      color: '#FFD970', position: 4 },
      { owner_id: user.id, name: 'Hired',      color: '#8B5E32', position: 5 },
      { owner_id: user.id, name: 'Rejected',   color: '#9B8B7A', position: 6 },
    ]
    const { data: created } = await adminSupabase
      .from('stages')
      .insert(defaults)
      .select()
    data = created
  }

  return NextResponse.json(data || [])
}
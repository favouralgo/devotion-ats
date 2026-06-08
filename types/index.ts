export type Role = 'superadmin'| 'admin' | 'customer'

export interface Organisation {
  id: string
  name: string
  owner_id: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  company_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
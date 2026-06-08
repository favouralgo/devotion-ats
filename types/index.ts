export type Role = 'admin' | 'customer'

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
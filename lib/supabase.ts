import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Matches the `patients` table columns in Supabase
export type Patient = {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  last_visit: string
  status: 'Stable' | 'Critical' | 'Recovering'
  phone?: string | null
  email?: string | null
  address?: string | null
  created_at?: string
  created_by?: string | null
}

// Matches the `profiles` table — one row per auth user
export type Profile = {
  id: string
  full_name: string
  role: string
  created_at?: string
}

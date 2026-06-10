import { create } from 'zustand'
import type { Patient, Profile } from '@/lib/supabase'

interface AppState {
  user: any | null
  profile: Profile | null
  patients: Patient[]
  viewMode: 'grid' | 'list'
  setUser: (user: any) => void
  setProfile: (profile: Profile | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setPatients: (patients: Patient[]) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  profile: null,
  patients: [],
  viewMode: 'grid',
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setPatients: (patients) => set({ patients }),
}))

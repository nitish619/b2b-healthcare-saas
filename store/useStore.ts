import { create } from 'zustand';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  status: 'Stable' | 'Critical' | 'Recovering';
}

interface AppState {
  user: any | null;
  patients: Patient[];
  viewMode: 'grid' | 'list';
  setUser: (user: any) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setPatients: (patients: Patient[]) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  patients: [
    { id: '1', name: 'John Doe', age: 45, gender: 'Male', condition: 'Hypertension', lastVisit: '2024-03-20', status: 'Stable' },
    { id: '2', name: 'Jane Smith', age: 32, gender: 'Female', condition: 'Diabetes Type 2', lastVisit: '2024-03-22', status: 'Recovering' },
    { id: '3', name: 'Robert Brown', age: 68, gender: 'Male', condition: 'Post-Surgery Recovery', lastVisit: '2024-03-24', status: 'Critical' },
    { id: '4', name: 'Emily Davis', age: 29, gender: 'Female', condition: 'Asthma', lastVisit: '2024-03-18', status: 'Stable' },
    { id: '5', name: 'Michael Wilson', age: 54, gender: 'Male', condition: 'Chronic Kidney Disease', lastVisit: '2024-03-21', status: 'Stable' },
    { id: '6', name: 'Sarah Miller', age: 41, gender: 'Female', condition: 'Rheumatoid Arthritis', lastVisit: '2024-03-23', status: 'Recovering' },
  ],
  viewMode: 'grid',
  setUser: (user) => set({ user }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setPatients: (patients) => set({ patients }),
}));

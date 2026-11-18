import { create } from 'zustand';
import type { Tematica } from '@/types';

const INITIAL_TEMATICAS: Tematica[] = [
  { id: '1', nombre: 'ANATOMÍA GENERAL DE CABEZA Y CUELLO', ordenAparicion: 1, creadoEn: new Date().toISOString() },
  { id: '2', nombre: 'ANATOMÍA DENTARIA', ordenAparicion: 2, creadoEn: new Date().toISOString() },
  { id: '3', nombre: 'ANATOMÍA MAXILAR', ordenAparicion: 3, creadoEn: new Date().toISOString() },
  { id: '4', nombre: 'ANATOMÍA MANDIBULAR', ordenAparicion: 4, creadoEn: new Date().toISOString() },
  { id: '5', nombre: 'ANATOMÍA EN RADIOGRAFÍA PERIAPICAL', ordenAparicion: 5, creadoEn: new Date().toISOString() },
  { id: '6', nombre: 'ANATOMÍA EN PANORÁMICA', ordenAparicion: 6, creadoEn: new Date().toISOString() },
  { id: '7', nombre: 'ANATOMÍA EN TELERRADIOGRAFÍA DE PERFIL / FRONTAL', ordenAparicion: 7, creadoEn: new Date().toISOString() },
  { id: '8', nombre: 'ANATOMÍA EN RADIOGRAFÍA OCLUSAL', ordenAparicion: 8, creadoEn: new Date().toISOString() },
];

interface TematicasState {
  tematicas: Tematica[];
  isLoading: boolean;
  addTematica: (data: Omit<Tematica, 'id' | 'creadoEn'>) => void;
  updateTematica: (id: string, data: Partial<Tematica>) => void;
  deleteTematica: (id: string) => void;
  getTematica: (id: string) => Tematica | undefined;
}

export const useTematicasStore = create<TematicasState>((set, get) => ({
  tematicas: INITIAL_TEMATICAS,
  isLoading: false,
  addTematica: (data) => set(state => ({
    tematicas: [...state.tematicas, {
      ...data,
      id: Date.now().toString(),
      creadoEn: new Date().toISOString(),
    }],
  })),
  updateTematica: (id, data) => set(state => ({
    tematicas: state.tematicas.map(t => t.id === id ? { ...t, ...data } : t),
  })),
  deleteTematica: (id) => set(state => ({
    tematicas: state.tematicas.filter(t => t.id !== id),
  })),
  getTematica: (id) => get().tematicas.find(t => t.id === id),
}));


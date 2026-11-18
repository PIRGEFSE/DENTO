import { create } from 'zustand';
import type { Radiografia } from '@/types';

interface MultimediaState {
  radiografias: Radiografia[];
}

export const useMultimediaStore = create<MultimediaState>(() => ({
  radiografias: [],
}));


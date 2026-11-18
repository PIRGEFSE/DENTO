import { create } from 'zustand';
import type { Hotspot, Radiografia } from '@/types';

const HOTSPOT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const MOCK_RADIOGRAFIAS: Radiografia[] = [
  {
    id: '1',
    tematicaId: '1',
    titulo: 'Radiografía Periapical Molar Superior',
    url: '/placeholder-xray.svg',
    tipo: 'periapical',
    hotspots: [
      { id: 'h1', x: 30, y: 40, etiqueta: 'Conducto Radicular', descripcion: 'Canal principal del diente', color: '#EF4444' },
      { id: 'h2', x: 60, y: 55, etiqueta: 'Ápice Dental', descripcion: 'Punta de la raíz', color: '#3B82F6' },
      { id: 'h3', x: 45, y: 25, etiqueta: 'Corona', descripcion: 'Parte visible del diente', color: '#10B981' },
    ],
  },
  {
    id: '2',
    tematicaId: '2',
    titulo: 'Panorámica Completa',
    url: '/placeholder-xray.svg',
    tipo: 'panoramica',
    hotspots: [],
  },
];

interface HotspotsState {
  radiografias: Radiografia[];
  activeRadiografiaId: string | null;
  selectedHotspotId: string | null;
  isDragging: boolean;
  isAddingMode: boolean;

  setActiveRadiografia: (id: string) => void;
  setSelectedHotspot: (id: string | null) => void;
  setIsDragging: (v: boolean) => void;
  toggleAddingMode: () => void;

  // Agrega una nueva radiografía (creada desde el formulario de Nueva Multimedia)
  addRadiografia: (radiografia: Radiografia) => void;

  addHotspot: (radiografiaId: string, x: number, y: number) => Hotspot;
  updateHotspot: (radiografiaId: string, hotspotId: string, data: Partial<Hotspot>) => void;
  deleteHotspot: (radiografiaId: string, hotspotId: string) => void;
  moveHotspot: (radiografiaId: string, hotspotId: string, x: number, y: number) => void;

  getActiveRadiografia: () => Radiografia | undefined;
  getSelectedHotspot: () => Hotspot | undefined;
}

export const useHotspotsStore = create<HotspotsState>((set, get) => ({
  radiografias: MOCK_RADIOGRAFIAS,
  activeRadiografiaId: null,
  selectedHotspotId: null,
  isDragging: false,
  isAddingMode: false,

  setActiveRadiografia: (id) => set({ activeRadiografiaId: id, selectedHotspotId: null }),
  setSelectedHotspot: (id) => set({ selectedHotspotId: id }),
  setIsDragging: (v) => set({ isDragging: v }),
  toggleAddingMode: () => set(s => ({ isAddingMode: !s.isAddingMode, selectedHotspotId: null })),

  // Inserta la nueva radiografía al inicio de la lista para que aparezca primero
  addRadiografia: (radiografia) =>
    set(state => ({ radiografias: [radiografia, ...state.radiografias] })),

  addHotspot: (radiografiaId, x, y) => {
    const hs: Hotspot = {
      id: Date.now().toString(),
      x,
      y,
      etiqueta: 'Nuevo Hotspot',
      descripcion: '',
      color: HOTSPOT_COLORS[Math.floor(Math.random() * HOTSPOT_COLORS.length)],
    };
    set(state => ({
      radiografias: state.radiografias.map(r =>
        r.id === radiografiaId ? { ...r, hotspots: [...r.hotspots, hs] } : r
      ),
      selectedHotspotId: hs.id,
      isAddingMode: false,
    }));
    return hs;
  },
  updateHotspot: (radiografiaId, hotspotId, data) => set(state => ({
    radiografias: state.radiografias.map(r =>
      r.id === radiografiaId
        ? { ...r, hotspots: r.hotspots.map(h => h.id === hotspotId ? { ...h, ...data } : h) }
        : r
    ),
  })),
  deleteHotspot: (radiografiaId, hotspotId) => set(state => ({
    radiografias: state.radiografias.map(r =>
      r.id === radiografiaId
        ? { ...r, hotspots: r.hotspots.filter(h => h.id !== hotspotId) }
        : r
    ),
    selectedHotspotId: null,
  })),
  moveHotspot: (radiografiaId, hotspotId, x, y) => set(state => ({
    radiografias: state.radiografias.map(r =>
      r.id === radiografiaId
        ? { ...r, hotspots: r.hotspots.map(h => h.id === hotspotId ? { ...h, x, y } : h) }
        : r
    ),
  })),
  getActiveRadiografia: () => {
    const { radiografias, activeRadiografiaId } = get();
    return radiografias.find(r => r.id === activeRadiografiaId);
  },
  getSelectedHotspot: () => {
    const { radiografias, activeRadiografiaId, selectedHotspotId } = get();
    const r = radiografias.find(r => r.id === activeRadiografiaId);
    return r?.hotspots.find(h => h.id === selectedHotspotId);
  },
}));


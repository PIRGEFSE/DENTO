import { create } from 'zustand';
import type { MetricSummary, TematicaAnalytics, ActivityPoint } from '@/types';

interface AnalyticsFilter {
  periodo: 'semana' | 'mes' | 'semestre';
  carrera: string;
  tematicaSeleccionadaId: string | 'todas';
}

interface AnalyticsState {
  filtros: AnalyticsFilter;
  metricasResumen: MetricSummary;
  tematicasAnalytics: TematicaAnalytics[];
  historialActividad: ActivityPoint[];
  setPeriodo: (periodo: 'semana' | 'mes' | 'semestre') => void;
  setTematicaSeleccionada: (id: string | 'todas') => void;
  setCarrera: (carrera: string) => void;
  getMetricasFiltradas: () => MetricSummary;
}

const INITIAL_SUMMARY: MetricSummary = {
  totalEstudiantes: 248,
  estudiantesActivos: 186,
  sesionesXRCompletadas: 1420,
  precisionPromedioHotspots: 84.6,
  tiempoPromedioPorSesionMin: 18.5,
};

const INITIAL_TEMATICAS_ANALYTICS: TematicaAnalytics[] = [
  {
    tematicaId: '1',
    nombre: 'Anatomía General de Cabeza y Cuello',
    estudiantesCompletados: 174,
    tasaPrecisionHotspots: 89.2,
    hotspotMasDificil: 'Agujero Mentoniano',
    tiempoPromedioMin: 15.2,
  },
  {
    tematicaId: '2',
    nombre: 'Anatomía Dentaria',
    estudiantesCompletados: 162,
    tasaPrecisionHotspots: 91.5,
    hotspotMasDificil: 'Conducto Radicular Molar',
    tiempoPromedioMin: 12.8,
  },
  {
    tematicaId: '3',
    nombre: 'Anatomía Maxilar',
    estudiantesCompletados: 145,
    tasaPrecisionHotspots: 78.4,
    hotspotMasDificil: 'Espina Nasal Anterior',
    tiempoPromedioMin: 21.0,
  },
  {
    tematicaId: '4',
    nombre: 'Anatomía Mandibular',
    estudiantesCompletados: 138,
    tasaPrecisionHotspots: 82.1,
    hotspotMasDificil: 'Fosa Submandibular',
    tiempoPromedioMin: 19.4,
  },
  {
    tematicaId: '5',
    nombre: 'Anatomía en Radiografía Periapical',
    estudiantesCompletados: 129,
    tasaPrecisionHotspots: 76.8,
    hotspotMasDificil: 'Ápice y Espacio Periodontal',
    tiempoPromedioMin: 24.3,
  },
  {
    tematicaId: '6',
    nombre: 'Anatomía en Panorámica',
    estudiantesCompletados: 110,
    tasaPrecisionHotspots: 73.2,
    hotspotMasDificil: 'Cóndilo Mandibular & Fosa Glenoidea',
    tiempoPromedioMin: 28.5,
  },
];

const INITIAL_ACTIVITY: ActivityPoint[] = [
  { dia: 'Lun', sesiones: 48, intentosHotspots: 320, evaluaciones: 35 },
  { dia: 'Mar', sesiones: 62, intentosHotspots: 410, evaluaciones: 52 },
  { dia: 'Mié', sesiones: 85, intentosHotspots: 590, evaluaciones: 71 },
  { dia: 'Jue', sesiones: 92, intentosHotspots: 640, evaluaciones: 84 },
  { dia: 'Vie', sesiones: 74, intentosHotspots: 480, evaluaciones: 60 },
  { dia: 'Sáb', sesiones: 31, intentosHotspots: 210, evaluaciones: 22 },
  { dia: 'Dom', sesiones: 19, intentosHotspots: 140, evaluaciones: 14 },
];

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  filtros: {
    periodo: 'mes',
    carrera: 'Odontología UTalca',
    tematicaSeleccionadaId: 'todas',
  },
  metricasResumen: INITIAL_SUMMARY,
  tematicasAnalytics: INITIAL_TEMATICAS_ANALYTICS,
  historialActividad: INITIAL_ACTIVITY,

  setPeriodo: (periodo) =>
    set((state) => ({
      filtros: { ...state.filtros, periodo },
      metricasResumen: {
        ...state.metricasResumen,
        sesionesXRCompletadas:
          periodo === 'semana' ? 411 : periodo === 'mes' ? 1420 : 4290,
      },
    })),

  setTematicaSeleccionada: (id) =>
    set((state) => ({
      filtros: { ...state.filtros, tematicaSeleccionadaId: id },
    })),

  setCarrera: (carrera) =>
    set((state) => ({
      filtros: { ...state.filtros, carrera },
    })),

  getMetricasFiltradas: () => {
    const { filtros, metricasResumen, tematicasAnalytics } = get();
    if (filtros.tematicaSeleccionadaId === 'todas') {
      return metricasResumen;
    }
    const tematica = tematicasAnalytics.find(
      (t) => t.tematicaId === filtros.tematicaSeleccionadaId
    );
    if (!tematica) return metricasResumen;

    return {
      ...metricasResumen,
      precisionPromedioHotspots: tematica.tasaPrecisionHotspots,
      tiempoPromedioPorSesionMin: tematica.tiempoPromedioMin,
    };
  },
}));


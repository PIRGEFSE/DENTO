export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'administrador' | 'docente' | 'alumno';
}

export interface Tematica {
  id: string;
  nombre: string;
  descripcionBreve?: string;
  ordenAparicion: number;
  informacion?: {
    tituloBloque: string;
    contenidoEducativo: string;
  };
  creadoEn: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  etiqueta: string;
  descripcion?: string;
  color?: string;
}

export interface Radiografia {
  id: string;
  tematicaId: string;
  titulo: string;
  url: string;
  tipo: 'periapical' | 'panoramica' | 'telerradiografia' | 'oclusal';
  hotspots: Hotspot[];
}

export interface Evaluacion {
  id: string;
  tematicaId: string;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

export interface MetricSummary {
  totalEstudiantes: number;
  estudiantesActivos: number;
  sesionesXRCompletadas: number;
  precisionPromedioHotspots: number;
  tiempoPromedioPorSesionMin: number;
}

export interface TematicaAnalytics {
  tematicaId: string;
  nombre: string;
  estudiantesCompletados: number;
  tasaPrecisionHotspots: number;
  hotspotMasDificil: string;
  tiempoPromedioMin: number;
}

export interface ActivityPoint {
  dia: string;
  sesiones: number;
  intentosHotspots: number;
  evaluaciones: number;
}

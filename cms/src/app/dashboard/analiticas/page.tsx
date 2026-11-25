'use client';

import BackLink from '@/components/layout/BackLink';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import {
  BarChart3,
  Users,
  Target,
  Clock,
  Award,
  AlertTriangle,
  TrendingUp,
  Filter,
} from 'lucide-react';

export default function AnaliticasPage() {
  const {
    filtros,
    historialActividad,
    tematicasAnalytics,
    setPeriodo,
    setTematicaSeleccionada,
    getMetricasFiltradas,
  } = useAnalyticsStore();

  const metricas = getMetricasFiltradas();

  // Calcular alturas normalizadas para el gráfico de barras SVG
  const maxSesiones = Math.max(...historialActividad.map((h) => h.sesiones), 1);

  return (
    <div className="space-y-8">
      <BackLink href="/dashboard" />

      {/* Header & Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: '#C41E3A' }}
          >
            Tablero Analítico RX DentoMax
          </p>
          <h1 className="text-3xl font-bold text-white">Métricas de Aprendizaje XR</h1>
          <p className="text-gray-400 text-sm mt-1">
            Seguimiento de interacciones en visores XR, precisión de hotspots anatómicos y autoevaluaciones.
          </p>
        </div>

        {/* Selector de Periodo */}
        <div
          className="inline-flex rounded-lg p-1 border self-start md:self-auto"
          style={{ background: '#141414', borderColor: '#2a2a2a' }}
        >
          {(['semana', 'mes', 'semestre'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filtros.periodo === p
                  ? 'bg-white text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro por temática */}
      <div
        className="flex items-center gap-3 p-3 rounded-lg border text-xs"
        style={{ background: '#141414', borderColor: '#1e1e1e' }}
      >
        <Filter size={14} className="text-gray-400" />
        <span className="text-gray-400 font-medium">Filtrar por unidad anatómica:</span>
        <select
          value={filtros.tematicaSeleccionadaId}
          onChange={(e) => setTematicaSeleccionada(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-red-600"
        >
          <option value="todas">Todas las Temáticas (Consolidado)</option>
          {tematicasAnalytics.map((t) => (
            <option key={t.tematicaId} value={t.tematicaId}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Estudiantes */}
        <div
          className="p-5 rounded-xl border space-y-2"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase tracking-wider font-medium">Estudiantes Activos</span>
            <Users size={16} className="text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{metricas.estudiantesActivos}</span>
            <span className="text-xs text-gray-500">/ {metricas.totalEstudiantes} matriculados</span>
          </div>
          <div className="text-[11px] text-green-400 flex items-center gap-1">
            <TrendingUp size={12} /> 75% tasa de participación
          </div>
        </div>

        {/* Sesiones XR */}
        <div
          className="p-5 rounded-xl border space-y-2"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase tracking-wider font-medium">Sesiones XR Completadas</span>
            <BarChart3 size={16} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metricas.sesionesXRCompletadas.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-gray-500">Prácticas radiográficas interactivas</p>
        </div>

        {/* Precisión Hotspots */}
        <div
          className="p-5 rounded-xl border space-y-2"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase tracking-wider font-medium">Precisión en Hotspots</span>
            <Target size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metricas.precisionPromedioHotspots.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${metricas.precisionPromedioHotspots}%`,
                background:
                  metricas.precisionPromedioHotspots > 80
                    ? '#10B981'
                    : metricas.precisionPromedioHotspots > 70
                    ? '#F59E0B'
                    : '#EF4444',
              }}
            />
          </div>
        </div>

        {/* Tiempo Promedio */}
        <div
          className="p-5 rounded-xl border space-y-2"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase tracking-wider font-medium">Tiempo Promedio</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metricas.tiempoPromedioPorSesionMin} min
            </span>
            <span className="text-xs text-gray-500">por sesión</span>
          </div>
          <p className="text-[11px] text-gray-500">Estudio minucioso de anatomía</p>
        </div>
      </div>

      {/* Gráfico de Actividad Semanal & Hotspots Críticos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras de Actividad */}
        <div
          className="lg:col-span-2 rounded-xl border p-6 space-y-4"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Actividad Semanal de Sesiones y Hotspots</h2>
            <span className="text-xs text-gray-500">Interacciones en visor XR</span>
          </div>

          <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-neutral-800">
            {historialActividad.map((h) => {
              const heightPercent = Math.round((h.sesiones / maxSesiones) * 100);
              return (
                <div key={h.dia} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip hover */}
                  <div className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded shadow">
                    {h.sesiones} sesiones ({h.intentosHotspots} hits)
                  </div>
                  {/* Barra */}
                  <div
                    className="w-full rounded-t-md transition-all duration-300 hover:brightness-125 cursor-pointer relative"
                    style={{
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, #C41E3A 0%, #63121f 100%)',
                    }}
                  />
                  {/* Día */}
                  <span className="text-xs text-gray-500">{h.dia}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-400 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ background: '#C41E3A' }} />
              Sesiones XR registradas
            </div>
          </div>
        </div>

        {/* Hotspots Anatómicos de Mayor Dificultad */}
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-white font-semibold text-sm">Puntos Anatómicos Críticos</h2>
          </div>
          <p className="text-xs text-gray-500">
            Estructuras donde los estudiantes presentan mayor tasa de error en la identificación:
          </p>

          <div className="space-y-3 pt-2">
            {tematicasAnalytics.map((t) => (
              <div
                key={t.tematicaId}
                className="p-3 rounded-lg border flex flex-col gap-1.5"
                style={{ background: '#1a1a1a', borderColor: '#262626' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">{t.hotspotMasDificil}</span>
                  <span
                    className="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: t.tasaPrecisionHotspots < 80 ? '#7f1d1d' : '#374151',
                      color: t.tasaPrecisionHotspots < 80 ? '#fca5a5' : '#d1d5db',
                    }}
                  >
                    {t.tasaPrecisionHotspots}% precisión
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 truncate">{t.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla detallada por Temática */}
      <div
        className="rounded-xl border p-6 space-y-4"
        style={{ background: '#141414', borderColor: '#1e1e1e' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">Rendimiento por Unidad Temática</h2>
          <span className="text-xs text-gray-500">Datos sincronizados con RX DentoMax App</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-gray-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Unidad Anatómica</th>
                <th className="pb-3 font-semibold text-center">Alumnos Completados</th>
                <th className="pb-3 font-semibold text-center">Precisión Hotspots</th>
                <th className="pb-3 font-semibold text-center">Tiempo Promedio</th>
                <th className="pb-3 font-semibold">Estructura más Compleja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {tematicasAnalytics.map((item) => (
                <tr key={item.tematicaId} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3 font-medium text-white">{item.nombre}</td>
                  <td className="py-3 text-center text-gray-300 font-mono">
                    {item.estudiantesCompletados}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className="font-mono px-2 py-0.5 rounded text-xs"
                      style={{
                        background:
                          item.tasaPrecisionHotspots > 85
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        color: item.tasaPrecisionHotspots > 85 ? '#34d399' : '#f87171',
                      }}
                    >
                      {item.tasaPrecisionHotspots}%
                    </span>
                  </td>
                  <td className="py-3 text-center text-gray-400 font-mono">
                    {item.tiempoPromedioMin} min
                  </td>
                  <td className="py-3 text-gray-400">{item.hotspotMasDificil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


'use client';
// Página: /dashboard/multimedia
// Lista todas las radiografías registradas.
// Si el usuario es administrador, muestra el botón "Nueva Multimedia"
// que lleva al formulario de carga de imagen.

import { useRouter } from 'next/navigation';
import { useHotspotsStore } from '@/stores/hotspotsStore';
import { useAuthStore } from '@/stores/authStore';
import BackLink from '@/components/layout/BackLink';
import { Crosshair, ImageIcon, Plus } from 'lucide-react';

const TIPO_LABELS: Record<string, string> = {
  periapical: 'Periapical',
  panoramica: 'Panorámica',
  telerradiografia: 'Telerradiografía',
  oclusal: 'Oclusal',
};

export default function MultimediaPage() {
  const router = useRouter();
  const { radiografias } = useHotspotsStore();

  // Verificar rol del usuario para mostrar el botón "Nueva Multimedia" solo al administrador
  const { user } = useAuthStore();
  const isAdmin = user?.rol === 'administrador';

  return (
    <div>
      <BackLink href="/dashboard" />

      {/* Encabezado con botón Nueva Multimedia (solo admin) */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#C41E3A' }}>
            Gestión de Contenido
          </p>
          <h1 className="text-3xl font-bold text-white">Multimedia</h1>
          <p className="text-gray-400 text-sm mt-2">
            Administra radiografías y edita sus hotspots anatómicos interactivos.
          </p>
        </div>

        {/* Botón visible únicamente para el rol administrador */}
        {isAdmin && (
          <button
            onClick={() => router.push('/dashboard/multimedia/nueva')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 mt-1 shrink-0"
            style={{ background: '#C41E3A', color: '#ffffff' }}
          >
            <Plus size={16} />
            Nueva Multimedia
          </button>
        )}
      </div>

      {/* Lista de radiografías */}
      <div className="space-y-3">
        {radiografias.map(r => (
          <div
            key={r.id}
            className="flex items-center justify-between p-4 rounded-lg border"
            style={{ background: '#141414', borderColor: '#1e1e1e' }}
          >
            <div className="flex items-center gap-4">
              {/* Thumbnail de la imagen o ícono placeholder */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ background: '#1e1e1e' }}
              >
                {r.url && r.url !== '/placeholder-xray.svg' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.url}
                    alt={r.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={18} className="text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{r.titulo}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{TIPO_LABELS[r.tipo] ?? r.tipo}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-500">{r.hotspots.length} hotspot(s)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push(`/dashboard/multimedia/${r.id}/hotspots`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-gray-300 border transition-colors hover:bg-gray-800"
              style={{ borderColor: '#2a2a2a' }}
            >
              <Crosshair size={12} />
              Editar Hotspots
            </button>
          </div>
        ))}

        {radiografias.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            No hay radiografías registradas.
            {isAdmin && (
              <p className="text-xs text-gray-700 mt-2">
                Usa el botón <span style={{ color: '#C41E3A' }}>Nueva Multimedia</span> para agregar la primera.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


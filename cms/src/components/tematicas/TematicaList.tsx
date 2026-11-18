'use client';
import { useTematicasStore } from '@/stores/tematicasStore';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function TematicaList() {
  const { tematicas, deleteTematica } = useTematicasStore();
  const router = useRouter();

  return (
    <div className="space-y-2">
      {tematicas
        .sort((a, b) => a.ordenAparicion - b.ordenAparicion)
        .map(t => (
          <div
            key={t.id}
            className="flex items-center justify-between p-4 rounded-lg border"
            style={{ background: '#141414', borderColor: '#1e1e1e' }}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-mono text-sm w-6">
                {String(t.ordenAparicion).padStart(2, '0')}
              </span>
              <span className="text-white text-sm font-medium">{t.nombre}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/dashboard/tematicas/${t.id}/editar`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-gray-300 border hover:bg-gray-800"
                style={{ borderColor: '#2a2a2a' }}
              >
                <Pencil size={12} /> Editar
              </button>
              <button
                onClick={() => confirm('¿Eliminar?') && deleteTematica(t.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs hover:bg-red-900/20"
                style={{ color: '#C41E3A', border: '1px solid #C41E3A33' }}
              >
                <Trash2 size={12} /> Eliminar
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}


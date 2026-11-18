'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useTematicasStore } from '@/stores/tematicasStore';
import BackLink from '@/components/layout/BackLink';

export default function TematicasPage() {
  const router = useRouter();
  const { tematicas, deleteTematica } = useTematicasStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta temática?')) {
      setDeletingId(id);
      setTimeout(() => {
        deleteTematica(id);
        setDeletingId(null);
      }, 300);
    }
  };

  return (
    <div>
      <BackLink href="/dashboard" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#C41E3A' }}>
            Gestión de Contenido
          </p>
          <h1 className="text-3xl font-bold text-white">Temáticas</h1>
        </div>
        <button
          onClick={() => router.push('/dashboard/tematicas/nueva')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white border transition-colors hover:bg-white hover:text-black"
          style={{ borderColor: '#C41E3A' }}
        >
          <Plus size={16} />
          Nueva Temática
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {tematicas
          .sort((a, b) => a.ordenAparicion - b.ordenAparicion)
          .map(tematica => (
            <div
              key={tematica.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                deletingId === tematica.id ? 'opacity-30 scale-95' : 'opacity-100'
              }`}
              style={{ background: '#141414', borderColor: '#1e1e1e' }}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm font-mono w-6">
                  {String(tematica.ordenAparicion).padStart(2, '0')}
                </span>
                <span className="text-white font-medium text-sm tracking-wide">{tematica.nombre}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/dashboard/tematicas/${tematica.id}/editar`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-gray-300 border transition-colors hover:bg-gray-800"
                  style={{ borderColor: '#2a2a2a' }}
                >
                  <Pencil size={12} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(tematica.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors hover:bg-red-900/20"
                  style={{ color: '#C41E3A', border: '1px solid #C41E3A33' }}
                >
                  <Trash2 size={12} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}

        {tematicas.length === 0 && (
          <div className="text-center py-16 text-gray-600">No hay temáticas registradas aún.</div>
        )}
      </div>
    </div>
  );
}


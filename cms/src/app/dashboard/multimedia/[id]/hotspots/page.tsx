'use client';
import { useParams } from 'next/navigation';
import { useHotspotsStore } from '@/stores/hotspotsStore';
import BackLink from '@/components/layout/BackLink';
import HotspotEditor from '@/components/multimedia/HotspotEditor';

export default function HotspotsPage() {
  const params = useParams();
  const id = params.id as string;
  const { radiografias } = useHotspotsStore();
  const radiografia = radiografias.find(r => r.id === id);

  return (
    <div className="space-y-6">
      <BackLink href="/dashboard/multimedia" label="Volver a Multimedia" />
      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: '#C41E3A' }}
        >
          Editor de Hotspots
        </p>
        <h1 className="text-2xl font-bold text-white">
          {radiografia?.titulo ?? 'Radiografía'}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Agrega, mueve y edita los hotspots anatómicos interactivos.
        </p>
      </div>
      <HotspotEditor radiografiaId={id} />
    </div>
  );
}


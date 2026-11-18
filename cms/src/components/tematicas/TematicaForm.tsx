'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTematicasStore } from '@/stores/tematicasStore';
import { useRouter } from 'next/navigation';
import type { Tematica } from '@/types';

const schema = z.object({
  nombre: z.string().min(3),
  descripcionBreve: z.string().optional(),
  ordenAparicion: z.coerce.number().int().min(1),
  tituloBloque: z.string().min(3),
  contenidoEducativo: z.string().min(10),
});
type FormData = z.infer<typeof schema>;

interface TematicaFormProps {
  tematica?: Tematica;
}

export default function TematicaForm({ tematica }: TematicaFormProps) {
  const router = useRouter();
  const { addTematica, updateTematica } = useTematicasStore();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: tematica
      ? {
          nombre: tematica.nombre,
          descripcionBreve: tematica.descripcionBreve,
          ordenAparicion: tematica.ordenAparicion,
          tituloBloque: tematica.informacion?.tituloBloque ?? '',
          contenidoEducativo: tematica.informacion?.contenidoEducativo ?? '',
        }
      : { ordenAparicion: 1 },
  });

  const onSubmit = async (data: FormData) => {
    if (tematica) {
      updateTematica(tematica.id, {
        nombre: data.nombre,
        descripcionBreve: data.descripcionBreve,
        ordenAparicion: data.ordenAparicion,
        informacion: { tituloBloque: data.tituloBloque, contenidoEducativo: data.contenidoEducativo },
      });
    } else {
      addTematica({
        nombre: data.nombre,
        descripcionBreve: data.descripcionBreve,
        ordenAparicion: data.ordenAparicion,
        informacion: { tituloBloque: data.tituloBloque, contenidoEducativo: data.contenidoEducativo },
      });
    }
    router.push('/dashboard/tematicas');
  };

  const iClass = 'w-full px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-700';
  const iStyle = { background: '#1e1e1e', border: '1px solid #2a2a2a' };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('nombre')} placeholder="Nombre" className={iClass} style={iStyle} />
      <textarea {...register('descripcionBreve')} rows={3} className={`${iClass} resize-none`} style={iStyle} />
      <input {...register('ordenAparicion')} type="number" className={iClass} style={iStyle} />
      <input {...register('tituloBloque')} placeholder="Título del bloque" className={iClass} style={iStyle} />
      <textarea {...register('contenidoEducativo')} rows={4} className={`${iClass} resize-none`} style={iStyle} />
      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm text-gray-400 border" style={{ borderColor: '#2a2a2a' }}>
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#fff', color: '#000' }}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}


'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTematicasStore } from '@/stores/tematicasStore';
import BackLink from '@/components/layout/BackLink';

const schema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcionBreve: z.string().optional(),
  ordenAparicion: z.coerce.number().int().min(1),
  tituloBloque: z.string().min(3, 'Requerido'),
  contenidoEducativo: z.string().min(10, 'Debe tener al menos 10 caracteres'),
});
type FormData = z.infer<typeof schema>;

export default function EditarTematicaPage() {
  const router = useRouter();
  const params = useParams();
  const { getTematica, updateTematica } = useTematicasStore();
  const tematica = getTematica(params.id as string);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (tematica) {
      reset({
        nombre: tematica.nombre,
        descripcionBreve: tematica.descripcionBreve,
        ordenAparicion: tematica.ordenAparicion,
        tituloBloque: tematica.informacion?.tituloBloque ?? '',
        contenidoEducativo: tematica.informacion?.contenidoEducativo ?? '',
      });
    }
  }, [tematica, reset]);

  if (!tematica) {
    return (
      <div className="text-center py-16 text-gray-500">
        Temática no encontrada.
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 400));
    updateTematica(params.id as string, {
      nombre: data.nombre,
      descripcionBreve: data.descripcionBreve,
      ordenAparicion: data.ordenAparicion,
      informacion: {
        tituloBloque: data.tituloBloque,
        contenidoEducativo: data.contenidoEducativo,
      },
    });
    router.push('/dashboard/tematicas');
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all';
  const inputStyle = { background: '#1e1e1e', border: '1px solid #2a2a2a' };
  const labelClass = 'block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5';

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink href="/dashboard/tematicas" />
      <h1 className="text-3xl font-bold text-white mb-8">Editar Temática</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <h2 className="text-white font-semibold text-sm">Atributos de Temática</h2>
          <div>
            <label className={labelClass}>Nombre *</label>
            <input {...register('nombre')} className={inputClass} style={inputStyle} />
            {errors.nombre && <p className="text-xs mt-1 text-red-500">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Descripción Breve</label>
            <textarea
              {...register('descripcionBreve')}
              rows={3}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass}>Orden de Aparición *</label>
            <input
              {...register('ordenAparicion')}
              type="number"
              min="1"
              className={inputClass}
              style={inputStyle}
            />
            {errors.ordenAparicion && (
              <p className="text-xs mt-1 text-red-500">{errors.ordenAparicion.message}</p>
            )}
          </div>
        </div>
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <h2 className="text-white font-semibold text-sm">Sección de Información</h2>
          <div>
            <label className={labelClass}>Título del Bloque Formativo*</label>
            <input {...register('tituloBloque')} className={inputClass} style={inputStyle} />
            {errors.tituloBloque && (
              <p className="text-xs mt-1 text-red-500">{errors.tituloBloque.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Contenido Educativo *</label>
            <textarea
              {...register('contenidoEducativo')}
              rows={6}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
            {errors.contenidoEducativo && (
              <p className="text-xs mt-1 text-red-500">{errors.contenidoEducativo.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm text-gray-400 border hover:text-white transition-colors"
            style={{ borderColor: '#2a2a2a' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-70 transition-all"
            style={{ background: '#ffffff', color: '#000000' }}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}


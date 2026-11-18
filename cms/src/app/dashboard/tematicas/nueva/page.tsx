'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTematicasStore } from '@/stores/tematicasStore';
import BackLink from '@/components/layout/BackLink';

const schema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  descripcionBreve: z.string().optional(),
  ordenAparicion: z.coerce.number().int().min(1, 'El orden debe ser al menos 1'),
  tituloBloque: z.string().min(3, 'Requerido (mínimo 3 caracteres)'),
  contenidoEducativo: z.string().min(10, 'Debe tener al menos 10 caracteres'),
});

type FormData = z.infer<typeof schema>;

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
      {children} {required && <span style={{ color: '#C41E3A' }}>*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs mt-1" style={{ color: '#C41E3A' }}>
      {message}
    </p>
  );
}

export default function NuevaTematicaPage() {
  const router = useRouter();
  const { addTematica } = useTematicasStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ordenAparicion: 1 },
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 500));
    addTematica({
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

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink href="/dashboard/tematicas" />
      <h1 className="text-3xl font-bold text-white mb-8">Nueva Temática</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Atributos de Temática */}
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <h2 className="text-white font-semibold text-sm">
            Atributos de Temática{' '}
            <span className="text-gray-500 font-normal">(Entidad &apos;tematica&apos;)</span>
          </h2>

          <div>
            <FieldLabel required>Nombre de la Temática</FieldLabel>
            <input
              {...register('nombre')}
              placeholder="Ej. ANATOMÍA GENERAL DE CABEZA Y CUELLO"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
            />
            <p className="text-xs text-gray-600 mt-1">
              Restricción: tematica.nombre debe ser único (CU-CMS-01.E1).
            </p>
            <FieldError message={errors.nombre?.message} />
          </div>

          <div>
            <FieldLabel>Descripción Breve</FieldLabel>
            <textarea
              {...register('descripcionBreve')}
              placeholder="Descripción general del contenido y objetivos de aprendizaje de esta unidad..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all resize-none"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
            />
          </div>

          <div>
            <FieldLabel required>Orden de Aparición</FieldLabel>
            <input
              {...register('ordenAparicion')}
              type="number"
              min="1"
              className="w-full px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
            />
            <p className="text-xs text-gray-600 mt-1">
              Define la secuencia de despliegue en el menú de la app móvil.
            </p>
            <FieldError message={errors.ordenAparicion?.message} />
          </div>
        </div>

        {/* Sección de Información */}
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <h2 className="text-white font-semibold text-sm">
            Sección de Información{' '}
            <span className="text-gray-500 font-normal">(&apos;informacion_tematica&apos;)</span>
          </h2>

          <div>
            <FieldLabel required>Título del Bloque Formativo</FieldLabel>
            <input
              {...register('tituloBloque')}
              placeholder="Ej. Estructuras Óseas Principales"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
            />
            <FieldError message={errors.tituloBloque?.message} />
          </div>

          <div>
            <FieldLabel required>Contenido Educativo</FieldLabel>
            <textarea
              {...register('contenidoEducativo')}
              placeholder="Texto explicativo con detalle anatómico de la temática..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all resize-none"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
            />
            <FieldError message={errors.contenidoEducativo?.message} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm text-gray-400 border transition-colors hover:text-white"
            style={{ borderColor: '#2a2a2a' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-70"
            style={{ background: '#ffffff', color: '#000000' }}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Atributos'}
          </button>
        </div>
      </form>
    </div>
  );
}


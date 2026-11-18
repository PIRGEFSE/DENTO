'use client';
// Página: /dashboard/multimedia/nueva
// Permite al administrador subir una nueva imagen radiográfica.
// El archivo se envía a /api/multimedia, que lo persiste en el
// volumen Docker /app/uploads manteniendo su resolución original.
// Tras guardar, redirige al editor de hotspots de la imagen creada.

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useHotspotsStore } from '@/stores/hotspotsStore';
import BackLink from '@/components/layout/BackLink';
import { ImageIcon, UploadCloud, X, AlertCircle } from 'lucide-react';
import type { Radiografia } from '@/types';

// ── Esquema de validación ────────────────────────────────────────────────────
const schema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(120),
  tipo: z.enum(['periapical', 'panoramica', 'telerradiografia', 'oclusal'], {
    required_error: 'Selecciona el tipo de radiografía',
  }),
  tematicaId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ── Helpers de UI ─────────────────────────────────────────────────────────────
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
    <p className="flex items-center gap-1 text-xs mt-1" style={{ color: '#C41E3A' }}>
      <AlertCircle size={11} /> {message}
    </p>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function NuevaMultimediaPage() {
  const router = useRouter();
  const { addRadiografia } = useHotspotsStore();

  // Estado del archivo seleccionado por el usuario
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'periapical' },
  });

  // Tipos MIME aceptados por el input de archivo (igual que en la API)
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
  const MAX_MB = 20;

  // Manejo de selección de archivo (desde el input o drag-and-drop)
  const handleFileChange = useCallback((file: File | null) => {
    setFileError(null);
    setSelectedFile(null);
    setPreviewUrl(null);

    if (!file) return;

    // Validar tipo MIME en el cliente (segunda capa; la API también valida)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError(`Tipo no permitido. Use JPG, PNG, WEBP o TIFF.`);
      return;
    }

    // Validar tamaño en el cliente
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`El archivo supera los ${MAX_MB} MB permitidos.`);
      return;
    }

    setSelectedFile(file);

    // Generar preview local (URL temporal, no afecta resolución del archivo)
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // Drag-and-drop handlers
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0] ?? null;
      handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Envío del formulario: sube el archivo a /api/multimedia
  const onSubmit = async (data: FormData) => {
    if (!selectedFile) {
      setFileError('Debes seleccionar una imagen.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Construir FormData para enviar el archivo junto con los metadatos
      const body = new FormData();
      body.append('file', selectedFile);           // archivo original, sin modificar
      body.append('titulo', data.titulo);
      body.append('tipo', data.tipo);
      if (data.tematicaId) body.append('tematicaId', data.tematicaId);

      const res = await fetch('/api/multimedia', {
        method: 'POST',
        body,
        // No se establece Content-Type manualmente: el browser lo hace con el boundary correcto
      });

      const json = await res.json();

      if (!res.ok) {
        setUploadError(json.error ?? 'Error al subir la imagen.');
        return;
      }

      // Agregar la nueva radiografía al store global (disponible en toda la app)
      const nueva: Radiografia = json.radiografia;
      addRadiografia(nueva);

      // Redirigir al editor de hotspots de la imagen recién creada
      router.push(`/dashboard/multimedia/${nueva.id}/hotspots`);
    } catch {
      setUploadError('No se pudo conectar con el servidor. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const iClass =
    'w-full px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all';
  const iStyle = { background: '#1e1e1e', border: '1px solid #2a2a2a' };

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink href="/dashboard/multimedia" label="Volver a Multimedia" />

      {/* Encabezado */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#C41E3A' }}>
          Gestión de Contenido
        </p>
        <h1 className="text-3xl font-bold text-white">Nueva Multimedia</h1>
        <p className="text-gray-400 text-sm mt-2">
          Carga una imagen radiográfica. El archivo se guardará en el servidor manteniendo su
          resolución original para su uso en la app móvil.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Zona de carga de imagen ───────────────────────────────────── */}
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <h2 className="text-white font-semibold text-sm">Imagen Radiográfica</h2>

          {/* Área de drag-and-drop */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:border-gray-500"
            style={{
              borderColor: fileError ? '#C41E3A' : '#2a2a2a',
              minHeight: 180,
              background: '#0d0d0d',
            }}
          >
            {previewUrl ? (
              <>
                {/* Preview de la imagen seleccionada (no modifica el archivo original) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="max-h-48 max-w-full object-contain rounded"
                />
                <p className="text-xs text-gray-500">
                  {selectedFile?.name} · {((selectedFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                </p>
                {/* Botón para quitar la imagen seleccionada */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setFileError(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-white transition-colors"
                  style={{ background: '#1e1e1e' }}
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#1e1e1e' }}
                >
                  {isUploading ? (
                    <UploadCloud size={22} className="text-gray-400 animate-pulse" />
                  ) : (
                    <ImageIcon size={22} className="text-gray-500" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-300">
                    Arrastra una imagen aquí o{' '}
                    <span style={{ color: '#C41E3A' }}>selecciona un archivo</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    JPG, PNG, WEBP o TIFF · Máx. {MAX_MB} MB · Resolución original conservada
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Input oculto: acepta solo formatos soportados */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          {fileError && <FieldError message={fileError} />}
        </div>

        {/* ── Metadatos de la imagen ────────────────────────────────────── */}
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ background: '#141414', borderColor: '#1e1e1e' }}
        >
          <h2 className="text-white font-semibold text-sm">Atributos</h2>

          {/* Título */}
          <div>
            <FieldLabel required>Título</FieldLabel>
            <input
              {...register('titulo')}
              placeholder="Ej. Radiografía Periapical Molar Superior"
              className={iClass}
              style={iStyle}
            />
            <FieldError message={errors.titulo?.message} />
          </div>

          {/* Tipo de radiografía */}
          <div>
            <FieldLabel required>Tipo de Radiografía</FieldLabel>
            <select {...register('tipo')} className={iClass} style={iStyle}>
              <option value="periapical">Periapical</option>
              <option value="panoramica">Panorámica</option>
              <option value="telerradiografia">Telerradiografía</option>
              <option value="oclusal">Oclusal</option>
            </select>
            <FieldError message={errors.tipo?.message} />
          </div>

          {/* Temática asociada (opcional) */}
          <div>
            <FieldLabel>ID de Temática (opcional)</FieldLabel>
            <input
              {...register('tematicaId')}
              placeholder="Ej. 1"
              className={iClass}
              style={iStyle}
            />
            <p className="text-xs text-gray-600 mt-1">
              Vincula esta imagen a una temática existente.
            </p>
          </div>
        </div>

        {/* Error global de upload */}
        {uploadError && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
            style={{ background: '#2a0a0a', border: '1px solid #C41E3A33', color: '#ff6b6b' }}
          >
            <AlertCircle size={16} />
            {uploadError}
          </div>
        )}

        {/* Botones */}
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
            disabled={isSubmitting || isUploading || !selectedFile}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#ffffff', color: '#000000' }}
          >
            {isUploading ? 'Subiendo imagen…' : 'Guardar y Editar Hotspots'}
          </button>
        </div>
      </form>
    </div>
  );
}


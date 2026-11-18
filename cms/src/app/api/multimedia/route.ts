// API Route: POST /api/multimedia
// Recibe un archivo de imagen via multipart/form-data,
// lo guarda en /app/uploads (volumen Docker persistente)
// manteniendo la resolución original, y devuelve los metadatos.

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Directorio de uploads montado como volumen en docker-compose.yml
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? '/app/uploads';

// Tipos MIME permitidos para imágenes médicas (radiografías)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff', // común en imágenes médicas de alta resolución
];

// Tamaño máximo permitido: 20 MB (imágenes radiográficas suelen ser grandes)
const MAX_SIZE_BYTES = 20 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // Parsear el FormData que viene del cliente
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const titulo = formData.get('titulo') as string | null;
    const tipo = formData.get('tipo') as string | null;
    const tematicaId = formData.get('tematicaId') as string | null;

    // Validar que se recibió el archivo
    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    // Validar tipo MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido. Use: ${ALLOWED_MIME_TYPES.join(', ')}` },
        { status: 415 }
      );
    }

    // Validar tamaño
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `El archivo supera el límite de ${MAX_SIZE_BYTES / 1024 / 1024} MB.` },
        { status: 413 }
      );
    }

    // Crear el directorio de uploads si no existe (primera vez)
    await mkdir(UPLOADS_DIR, { recursive: true });

    // Generar nombre único para el archivo usando timestamp + nombre original saneado
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const filePath = join(UPLOADS_DIR, filename);

    // Leer los bytes del archivo y escribirlos SIN modificar la resolución
    // (no se reescala ni recomprime, se guarda exactamente como llegó)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // La URL pública que usará la app móvil y el CMS para acceder a la imagen
    // Se sirve mediante la ruta estática /uploads/<filename>
    const publicUrl = `/uploads/${filename}`;

    // Construir objeto Radiografia compatible con el tipo definido en types/index.ts
    const nueva = {
      id: timestamp.toString(),
      tematicaId: tematicaId ?? '',
      titulo: titulo ?? file.name,
      url: publicUrl,
      tipo: tipo ?? 'periapical',
      hotspots: [],
      // Metadatos adicionales para la app móvil
      metadata: {
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json({ success: true, radiografia: nueva }, { status: 201 });
  } catch (err) {
    console.error('[API /multimedia] Error al guardar imagen:', err);
    return NextResponse.json({ error: 'Error interno al guardar la imagen.' }, { status: 500 });
  }
}


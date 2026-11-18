// API Route: GET /uploads/[filename]
// Sirve archivos estáticos desde el volumen Docker /app/uploads
// manteniendo el Content-Type correcto para que la app móvil los reciba bien.

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? '/app/uploads';

// Mapa de extensiones a tipos MIME
const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // Sanitizar: evitar path traversal (ej. ../../etc/passwd)
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Nombre de archivo inválido.' }, { status: 400 });
    }

    const filePath = join(UPLOADS_DIR, filename);
    const buffer = await readFile(filePath);

    // Detectar Content-Type según extensión para que la app móvil interprete correctamente
    const ext = extname(filename).toLowerCase();
    const contentType = MIME_MAP[ext] ?? 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache público: la app móvil puede cachear la imagen hasta 1 año
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado.' }, { status: 404 });
  }
}


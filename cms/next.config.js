/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Sin optimización automática: las imágenes radiográficas deben
    // conservar su resolución original tal como fueron subidas.
    unoptimized: true,
  },
  // Permitir que el servidor acceda al sistema de archivos del volumen Docker
  // para las rutas de API que leen/escriben en /app/uploads
  serverExternalPackages: [],
}

module.exports = nextConfig


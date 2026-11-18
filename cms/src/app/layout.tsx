import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DentoMax XR — CMS',
  description: 'Panel de Administración y Docencia — Anatomía Radiográfica Maxilofacial',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-dm-bg text-dm-text antialiased`}>
        {children}
      </body>
    </html>
  );
}


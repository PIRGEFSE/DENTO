'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackLink({ href, label = 'Volver al menú' }: { href?: string; label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => (href ? router.push(href) : router.back())}
      className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-6"
    >
      <ArrowLeft size={14} />
      {label}
    </button>
  );
}


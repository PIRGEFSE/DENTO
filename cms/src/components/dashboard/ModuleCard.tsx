'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  available: boolean;
  badge?: string;
}

export default function ModuleCard({ icon: Icon, title, description, href, available, badge }: ModuleCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => available && router.push(href)}
      className={`relative rounded-xl p-6 border transition-all space-y-4 ${
        available ? 'cursor-pointer hover:border-gray-600' : 'opacity-50 cursor-not-allowed'
      }`}
      style={{ background: '#141414', borderColor: '#1e1e1e' }}
    >
      {badge && (
        <div className="absolute top-4 right-4">
          <span
            className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ color: '#C41E3A', border: '1px solid #C41E3A' }}
          >
            {badge}
          </span>
        </div>
      )}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#1e1e1e' }}>
        <Icon size={20} className="text-gray-300" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="pt-2">
        {available ? (
          <span className="flex items-center gap-1.5 text-sm text-gray-300 font-medium">
            Ingresar <ArrowRight size={14} />
          </span>
        ) : (
          <span className="text-sm text-gray-600">No disponible</span>
        )}
      </div>
    </div>
  );
}


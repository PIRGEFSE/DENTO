'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: '#111111', borderColor: '#1e1e1e' }}>
      <div className="container mx-auto px-6 max-w-6xl h-14 flex items-center justify-between">
        {/* Left */}
        <div
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 relative overflow-hidden rounded">
            <Image src="/logo-utalca.png" alt="UTalca" fill className="object-contain" />
          </div>
          <span className="font-bold text-white text-sm">RX DentoMax</span>
          <span className="text-gray-600 text-sm">|</span>
          <span className="text-gray-400 text-xs tracking-widest uppercase font-medium">
            Panel de Administración
          </span>
        </div>
        {/* Right */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: '#C41E3A' }}
          >
            {user?.nombre?.charAt(0) ?? 'A'}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white text-xs font-medium">{user?.nombre}</p>
            <p className="text-gray-500 text-xs">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors border"
            style={{ borderColor: '#2a2a2a' }}
          >
            <LogOut size={12} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}


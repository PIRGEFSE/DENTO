'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(s => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* Left Panel */}
      <div
        className="relative flex-[3] flex flex-col items-center justify-center px-12"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0508 50%, #0a0a0a 100%)' }}
      >
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <div className="mb-2">
            <Image
              src="/logo-utalca.png"
              alt="Universidad de Talca"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white tracking-tight">RX DentoMax</h1>
            <p className="text-gray-400 text-base font-light">Anatomía Radiográfica Maxilofacial</p>
            <div className="w-16 h-px bg-gray-600 mx-auto my-4" />
            <p className="text-xs text-gray-500 tracking-[0.25em] uppercase font-medium">
              Panel de Administración y Docencia
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-800" />

      {/* Right Panel */}
      <div
        className="flex-[2] flex items-center justify-center px-12"
        style={{ background: '#111111' }}
      >
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#C41E3A' }}>
              Acceso Restringido
            </p>
            <h2 className="text-3xl font-bold text-white">Iniciar Sesión</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ingresa tus credenciales institucionales para administrar el contenido del sistema.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                Usuario
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@utalca.cl"
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all"
                style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-red-700 transition-all"
                  style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/40 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: '#ffffff', color: '#000000' }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Forgot password */}
          <div className="text-center">
            <button className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


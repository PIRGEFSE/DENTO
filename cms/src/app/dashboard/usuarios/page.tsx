'use client';
import BackLink from '@/components/layout/BackLink';
import { Plus, Shield, BookOpen, User } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', nombre: 'Administrador', email: 'admin@utalca.cl', rol: 'administrador' },
  { id: '2', nombre: 'Docente Demo', email: 'docente@utalca.cl', rol: 'docente' },
  { id: '3', nombre: 'Alumno Demo', email: 'alumno@utalca.cl', rol: 'alumno' },
];

const ROL_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  administrador: { label: 'Administrador', color: '#C41E3A', Icon: Shield },
  docente: { label: 'Docente', color: '#3B82F6', Icon: BookOpen },
  alumno: { label: 'Alumno', color: '#10B981', Icon: User },
};

export default function UsuariosPage() {
  return (
    <div>
      <BackLink href="/dashboard" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: '#C41E3A' }}
          >
            Gestión de Usuarios
          </p>
          <h1 className="text-3xl font-bold text-white">Usuarios</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona cuentas, roles y permisos del sistema.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white border transition-colors hover:bg-white hover:text-black"
          style={{ borderColor: '#C41E3A' }}
        >
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </div>

      <div className="space-y-2">
        {MOCK_USERS.map(user => {
          const cfg = ROL_CONFIG[user.rol];
          const Icon = cfg.Icon;
          return (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ background: '#141414', borderColor: '#1e1e1e' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: cfg.color }}
                >
                  {user.nombre.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.nombre}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}33` }}
                >
                  <Icon size={11} />
                  {cfg.label}
                </span>
                <button
                  className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-md border"
                  style={{ borderColor: '#2a2a2a' }}
                >
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


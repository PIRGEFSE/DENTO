'use client';
import { useRouter } from 'next/navigation';
import { Layers, Image as ImageIcon, ClipboardList, Users, GraduationCap, ArrowRight, BarChart3 } from 'lucide-react';

const MODULES = [
  {
    icon: Layers,
    title: 'Temáticas',
    description: 'Crea, edita y organiza las unidades de estudio y su información asociada.',
    href: '/dashboard/tematicas',
    available: true,
  },
  {
    icon: ImageIcon,
    title: 'Multimedia',
    description: 'Administra videos introductorios y radiografías con sus hotspots anatómicos.',
    href: '/dashboard/multimedia',
    available: true,
  },
  {
    icon: ClipboardList,
    title: 'Evaluaciones',
    description: 'Crea y administra los cuestionarios de autoevaluación por temática.',
    href: '/dashboard/evaluaciones',
    available: true,
  },
  {
    icon: BarChart3,
    title: 'Tablero Analítico',
    description: 'Métricas de aprendizaje XR, tasa de precisión de hotspots y rendimiento de estudiantes.',
    href: '/dashboard/analiticas',
    available: true,
  },
  {
    icon: GraduationCap,
    title: 'Cursos',
    description: 'Organiza cursos institucionales y matrícula alumnos.',
    href: '#',
    available: false,
    badge: 'PRÓXIMAMENTE',
  },
  {
    icon: Users,
    title: 'Usuarios',
    description: 'Gestiona cuentas, roles y permisos de Administradores, Docentes y Alumnos.',
    href: '/dashboard/usuarios',
    available: true,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#C41E3A' }}>
          Menú Principal
        </p>
        <h1 className="text-3xl font-bold text-white">¿Qué deseas gestionar hoy?</h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Selecciona un módulo para administrar el contenido de la aplicación de Anatomía Radiográfica
          Maxilofacial.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map(mod => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.title}
              onClick={() => mod.available && router.push(mod.href)}
              className={`relative rounded-xl p-6 border transition-all space-y-4 ${
                mod.available
                  ? 'cursor-pointer hover:border-gray-600'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ background: '#141414', borderColor: '#1e1e1e' }}
            >
              {mod.badge && (
                <div className="absolute top-4 right-4">
                  <span
                    className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                    style={{ color: '#C41E3A', border: '1px solid #C41E3A' }}
                  >
                    {mod.badge}
                  </span>
                </div>
              )}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#1e1e1e' }}
              >
                <Icon size={20} className="text-gray-300" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-white">{mod.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{mod.description}</p>
              </div>
              <div className="pt-2">
                {mod.available ? (
                  <span className="flex items-center gap-1.5 text-sm text-gray-300 font-medium hover:text-white transition-colors">
                    Ingresar <ArrowRight size={14} />
                  </span>
                ) : (
                  <span className="text-sm text-gray-600">No disponible</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


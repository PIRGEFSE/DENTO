'use client';
import BackLink from '@/components/layout/BackLink';
import { ClipboardList, Plus, CheckCircle, XCircle } from 'lucide-react';

const MOCK_EVALUACIONES = [
  {
    id: '1',
    tematicaId: '1',
    pregunta: '¿Cuál es la estructura ósea que forma la base del cráneo?',
    opciones: ['Hueso frontal', 'Hueso occipital', 'Hueso esfenoides', 'Hueso temporal'],
    respuestaCorrecta: 2,
  },
  {
    id: '2',
    tematicaId: '1',
    pregunta: '¿Qué tejido recubre la corona del diente?',
    opciones: ['Dentina', 'Cemento', 'Esmalte', 'Pulpa'],
    respuestaCorrecta: 2,
  },
];

export default function EvaluacionesPage() {
  return (
    <div>
      <BackLink href="/dashboard" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: '#C41E3A' }}
          >
            Gestión de Contenido
          </p>
          <h1 className="text-3xl font-bold text-white">Evaluaciones</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona los cuestionarios de autoevaluación por temática.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white border transition-colors hover:bg-white hover:text-black"
          style={{ borderColor: '#C41E3A' }}
        >
          <Plus size={16} />
          Nueva Pregunta
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_EVALUACIONES.map((ev, idx) => (
          <div
            key={ev.id}
            className="p-5 rounded-xl border space-y-3"
            style={{ background: '#141414', borderColor: '#1e1e1e' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-gray-600 text-sm font-mono shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <p className="text-white text-sm font-medium leading-relaxed">{ev.pregunta}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pl-7">
              {ev.opciones.map((op, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{
                    background: i === ev.respuestaCorrecta ? 'rgba(16,185,129,0.1)' : '#1e1e1e',
                    border: `1px solid ${i === ev.respuestaCorrecta ? '#10B98133' : '#2a2a2a'}`,
                  }}
                >
                  {i === ev.respuestaCorrecta ? (
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle size={12} className="text-gray-600 shrink-0" />
                  )}
                  <span className={i === ev.respuestaCorrecta ? 'text-emerald-400' : 'text-gray-400'}>
                    {op}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


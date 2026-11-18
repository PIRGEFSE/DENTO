'use client';
import { useRef, useCallback, useState, useEffect } from 'react';
import { useHotspotsStore } from '@/stores/hotspotsStore';
import type { Hotspot } from '@/types';
import { Plus, Trash2, X, Move, Save, Check } from 'lucide-react';

interface HotspotEditorProps {
  radiografiaId: string;
}

export default function HotspotEditor({ radiografiaId }: HotspotEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ hotspotId: string; startX: number; startY: number } | null>(null);

  const {
    radiografias,
    isAddingMode,
    selectedHotspotId,
    toggleAddingMode,
    addHotspot,
    updateHotspot,
    deleteHotspot,
    moveHotspot,
    setSelectedHotspot,
    setActiveRadiografia,
  } = useHotspotsStore();

  useEffect(() => {
    setActiveRadiografia(radiografiaId);
  }, [radiografiaId, setActiveRadiografia]);

  const radiografia = radiografias.find(r => r.id === radiografiaId);
  const selectedHotspot = radiografia?.hotspots.find(h => h.id === selectedHotspotId);

  const getRelativeCoords = useCallback(
    (e: React.MouseEvent): { x: number; y: number } | null => {
      if (!containerRef.current) return null;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    },
    []
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isAddingMode) return;
      const coords = getRelativeCoords(e);
      if (!coords) return;
      addHotspot(radiografiaId, coords.x, coords.y);
    },
    [isAddingMode, getRelativeCoords, addHotspot, radiografiaId]
  );

  const handleHotspotMouseDown = useCallback(
    (e: React.MouseEvent, hotspotId: string) => {
      e.stopPropagation();
      setSelectedHotspot(hotspotId);
      dragRef.current = { hotspotId, startX: e.clientX, startY: e.clientY };
    },
    [setSelectedHotspot]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragRef.current || !containerRef.current) return;
      const coords = getRelativeCoords(e);
      if (!coords) return;
      moveHotspot(radiografiaId, dragRef.current.hotspotId, coords.x, coords.y);
    },
    [getRelativeCoords, moveHotspot, radiografiaId]
  );

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  if (!radiografia) return <div className="text-gray-500">Radiografía no encontrada.</div>;

  return (
    <div className="flex gap-4 h-full">
      {/* Canvas area */}
      <div className="flex-1 space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAddingMode}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
              isAddingMode
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            style={
              isAddingMode
                ? { background: '#C41E3A', borderColor: '#C41E3A' }
                : { borderColor: '#2a2a2a' }
            }
          >
            <Plus size={14} />
            {isAddingMode ? 'Haz clic en la imagen' : '+ Agregar Hotspot'}
          </button>
          {isAddingMode && (
            <button
              onClick={toggleAddingMode}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-gray-400 border transition-colors hover:text-white"
              style={{ borderColor: '#2a2a2a' }}
            >
              <X size={12} />
              Cancelar
            </button>
          )}
          <span className="text-xs text-gray-600 ml-2">
            <Move size={12} className="inline mr-1" />
            Arrastra los pins para moverlos
          </span>
        </div>

        {/* Image canvas */}
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative w-full rounded-xl overflow-hidden select-none"
          style={{
            background: '#1a1a1a',
            border: `2px solid ${isAddingMode ? '#C41E3A' : '#2a2a2a'}`,
            cursor: isAddingMode ? 'crosshair' : 'default',
            aspectRatio: '16/9',
          }}
        >
          {/* Radiograph background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${radiografia.url || '/placeholder-xray.svg'})`,
            }}
          />

          {/* Hotspot pins */}
          {radiografia.hotspots.map(hotspot => (
            <HotspotPin
              key={hotspot.id}
              hotspot={hotspot}
              isSelected={hotspot.id === selectedHotspotId}
              onMouseDown={e => handleHotspotMouseDown(e, hotspot.id)}
            />
          ))}
        </div>

        <p className="text-xs text-gray-600">
          {radiografia.hotspots.length} hotspot(s) · Haz clic en un pin para seleccionarlo y editarlo
        </p>
      </div>

      {/* Sidebar: selected hotspot editor */}
      <div className="w-72 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">
            {selectedHotspot ? 'Editar Hotspot' : 'Hotspots'}
          </h3>
          {selectedHotspot && (
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-gray-400 hover:text-white p-1 rounded-md text-xs transition-colors"
              title="Cerrar edición"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {selectedHotspot ? (
          <HotspotForm
            hotspot={selectedHotspot}
            radiografiaId={radiografiaId}
            onUpdate={(data) => updateHotspot(radiografiaId, selectedHotspot.id, data)}
            onDelete={() => deleteHotspot(radiografiaId, selectedHotspot.id)}
            onClose={() => setSelectedHotspot(null)}
          />
        ) : (
          <div className="space-y-2">
            {radiografia.hotspots.length === 0 ? (
              <p className="text-gray-600 text-xs">
                No hay hotspots. Usa el botón &quot;+ Agregar Hotspot&quot; y haz clic en la imagen.
              </p>
            ) : (
              radiografia.hotspots.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotspot(h.id)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs text-gray-300 transition-colors hover:bg-gray-800"
                  style={{ border: '1px solid #1e1e1e' }}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: h.color ?? '#EF4444' }}
                  />
                  {h.etiqueta}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HotspotPin({
  hotspot,
  isSelected,
  onMouseDown,
}: {
  hotspot: Hotspot;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute hotspot-pin"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 20 : 10,
      }}
    >
      {/* Outer ring */}
      <div
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all"
        style={{
          background: hotspot.color ?? '#EF4444',
          boxShadow: isSelected
            ? `0 0 0 3px ${hotspot.color ?? '#EF4444'}44, 0 0 12px ${hotspot.color ?? '#EF4444'}88`
            : '0 2px 8px rgba(0,0,0,0.5)',
          transform: isSelected ? 'scale(1.3)' : 'scale(1)',
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
      {/* Label */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 rounded text-xs font-medium text-white pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {hotspot.etiqueta}
      </div>
    </div>
  );
}

function HotspotForm({
  hotspot,
  radiografiaId,
  onUpdate,
  onDelete,
  onClose,
}: {
  hotspot: Hotspot;
  radiografiaId: string;
  onUpdate: (data: Partial<Hotspot>) => void;
  onDelete: () => void;
  onClose?: () => void;
}) {
  const [etiqueta, setEtiqueta] = useState(hotspot.etiqueta);
  const [descripcion, setDescripcion] = useState(hotspot.descripcion ?? '');
  const [color, setColor] = useState(hotspot.color ?? '#EF4444');
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    setEtiqueta(hotspot.etiqueta);
    setDescripcion(hotspot.descripcion ?? '');
    setColor(hotspot.color ?? '#EF4444');
    setGuardado(false);
  }, [hotspot.id, hotspot.etiqueta, hotspot.descripcion, hotspot.color]);

  // Guarda los cambios del hotspot y, tras mostrar la confirmación visual en el botón, cierra la ventana de edición
  const handleGuardar = () => {
    onUpdate({ etiqueta, descripcion, color });
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
      onClose?.(); // Cierra la ventana Editar Hotspot (deselecciona el hotspot activo)
    }, 1200);
  };

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  const inputClass =
    'w-full px-3 py-2 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-red-700 transition-all';
  const inputStyle = { background: '#1e1e1e', border: '1px solid #2a2a2a' };
  const labelClass = 'block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1';

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: '#141414', border: '1px solid #1e1e1e' }}
    >
      <div>
        <label className={labelClass}>Etiqueta</label>
        <input
          value={etiqueta}
          onChange={e => setEtiqueta(e.target.value)}
          onBlur={() => onUpdate({ etiqueta })}
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          onBlur={() => onUpdate({ descripcion })}
          rows={3}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>
      <div>
        <label className={labelClass}>Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                onUpdate({ color: c });
              }}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110"
              style={{
                background: c,
                boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined,
              }}
            />
          ))}
        </div>
      </div>
      <div className="text-xs text-gray-600">
        Posición: ({hotspot.x.toFixed(1)}%, {hotspot.y.toFixed(1)}%)
      </div>

      {/* Botones de acción: Guardar y Eliminar */}
      <div className="space-y-2 pt-1">
        {/* Botón Guardar Hotspot tras crearlo o editarlo */}
        <button
          type="button"
          onClick={handleGuardar}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
          style={{
            background: guardado ? '#10B981' : '#ffffff',
            color: guardado ? '#ffffff' : '#000000',
          }}
        >
          {guardado ? (
            <>
              <Check size={14} />
              Hotspot Guardado
            </>
          ) : (
            <>
              <Save size={14} />
              Guardar Hotspot
            </>
          )}
        </button>

        {/* Botón para eliminar el hotspot */}
        <button
          type="button"
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-colors hover:bg-red-900/20"
          style={{ color: '#C41E3A', border: '1px solid #C41E3A33' }}
        >
          <Trash2 size={12} />
          Eliminar Hotspot
        </button>
      </div>
    </div>
  );
}


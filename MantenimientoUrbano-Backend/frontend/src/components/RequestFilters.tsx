import { useState, useEffect } from 'react';

export interface FilterState {
  zona: string;
  tipo: string;
  fecha: string;
}

interface RequestFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  showApplyButton?: boolean;
}

/**
 * Componente reutilizable de filtros para solicitudes
 * Maneja filtros por zona, tipo y fecha
 * 
 * @param onFilterChange - Callback que se ejecuta cuando cambian los filtros
 * @param showApplyButton - Si debe mostrar botón de aplicar o aplicar automáticamente
 * 
 * @example
 * <RequestFilters 
 *   onFilterChange={(filters) => console.log(filters)}
 *   showApplyButton={true}
 * />
 */
export default function RequestFilters({ 
  onFilterChange,
  showApplyButton = false 
}: RequestFiltersProps) {
  const [zona, setZona] = useState('');
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');

  // Aplicar filtros automáticamente si no hay botón
  useEffect(() => {
    if (!showApplyButton && onFilterChange) {
      onFilterChange({ zona, tipo, fecha });
    }
  }, [zona, tipo, fecha, showApplyButton, onFilterChange]);

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({ zona, tipo, fecha });
    }
  };

  const handleClearFilters = () => {
    setZona('');
    setTipo('');
    setFecha('');
    if (onFilterChange) {
      onFilterChange({ zona: '', tipo: '', fecha: '' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Filtro de Zona */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zona
        </label>
        <select
          value={zona}
          onChange={(e) => setZona(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">Todas las zonas</option>
          <option value="1">Zona 1</option>
          <option value="7">Zona 7</option>
          <option value="10">Zona 10</option>
          <option value="12">Zona 12</option>
          <option value="15">Zona 15</option>
        </select>
      </div>

      {/* Filtro de Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">Todos los tipos</option>
          <option value="Baches">Baches</option>
          <option value="Alcantarillas">Alcantarillas</option>
          <option value="Alumbrado">Alumbrado público</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Señalización">Señalización</option>
        </select>
      </div>

      {/* Filtro de Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha
        </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Botones */}
      <div className="flex items-end gap-2">
        {showApplyButton && (
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Filtrar
          </button>
        )}
        <button
          onClick={handleClearFilters}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
          title="Limpiar filtros"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

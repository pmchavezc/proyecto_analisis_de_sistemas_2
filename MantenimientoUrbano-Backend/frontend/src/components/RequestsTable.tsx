
import type { Request } from '../types';

import {
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
  getFinancialStatusColor,
  getFinancialStatusText,
} from '../utils/statusHelpers';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Eye } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import ModalRequestDetails from './ModalRequestDetails';

interface RequestsTableProps {
  requests: Request[];
  
  // Configuración de columnas
  showFinancialStatus?: boolean;
  showActions?: boolean;
  showFinancingButton?: boolean;
  
  // Callbacks
  onProgramRequest?: (id: string | number) => void;
  onRequestFinancing?: (id: number) => void;
  
  // Variantes de UI
  variant?: 'compact' | 'full';
  maxHeight?: string;
}

/**
 * Componente de tabla reutilizable para mostrar solicitudes
 * 
 * @param requests - Array de solicitudes a mostrar
 * @param showFinancialStatus - Mostrar columna de estado financiero
 * @param showActions - Mostrar columna de acciones (Programar)
 * @param showFinancingButton - Mostrar columna de botón de financiamiento
 * @param onProgramRequest - Callback cuando se hace clic en Programar
 * @param onRequestFinancing - Callback personalizado para financiamiento (opcional)
 * @param variant - 'compact' para dashboard, 'full' para lista completa
 * @param maxHeight - Altura máxima para scroll
 */
export default function RequestsTable({ 
  requests, 
  showFinancialStatus = true,
  showActions = false,
  showFinancingButton = false,
  onProgramRequest,
  variant = 'full',
  maxHeight,
}: RequestsTableProps) {
  const navigate = useNavigate();

  const handleNavigateToFinancing = (id: number) => {
    navigate(`/financiamiento/${id}`);
  };

  // Clases según variante
  const containerClasses = variant === 'compact' 
    ? 'bg-white rounded-xl shadow-sm overflow-hidden'
    : 'bg-white rounded-xl shadow-sm overflow-hidden';
  
  const tableContainerClasses = maxHeight 
    ? `overflow-x-auto overflow-y-auto`
    : 'overflow-x-auto';
  
  const tableContainerStyle = maxHeight ? { maxHeight } : undefined;

  // Menú de acciones por fila
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  interface ActionMenuProps {
    item: Request;
    onProgramRequest?: (id: string | number) => void;
    handleNavigateToFinancing: (id: number) => void;
  }

  const ActionMenu = ({ item, onProgramRequest, handleNavigateToFinancing }: ActionMenuProps) => {
    // Financiamiento: solo si el estado financiero es PENDIENTE
    const isFinanciamientoEnabled = showFinancingButton && item.financialStatus === 'PENDIENTE';
    
    // Programar: solo si está PENDIENTE y el estado financiero es FINANCIADA
    const isProgramarEnabled = showActions && item.status === 'PENDIENTE' && item.financialStatus === 'FINANCIADA';
    
    // Si no hay acciones disponibles, no mostrar el menú
    if (!showActions && !showFinancingButton) return null;
    
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
        {openMenuId === item.id && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <ul className="py-1">
              {/* Ver Detalles - siempre disponible */}
              <li>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setOpenMenuId(null);
                    setSelectedRequest(item);
                    setShowDetailsModal(true);
                  }}
                >
                  <Eye className="w-4 h-4 text-gray-500" /> Ver Detalles
                </button>
              </li>
              
              {/* Divisor */}
              {(showActions || showFinancingButton) && (
                <li className="border-t border-gray-200 my-1"></li>
              )}

              {showActions && (
                <li>
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-blue-50 ${isProgramarEnabled ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed'}`}
                    disabled={!isProgramarEnabled}
                    onClick={() => {
                      setOpenMenuId(null);
                      if (isProgramarEnabled && onProgramRequest) onProgramRequest(item.id);
                    }}
                  >
                    <Calendar className="w-4 h-4 text-blue-500" /> Programar
                  </button>
                </li>
              )}
              {showFinancingButton && (
                <li>
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-green-50 ${isFinanciamientoEnabled ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed'}`}
                    disabled={!isFinanciamientoEnabled}
                    onClick={() => {
                      setOpenMenuId(null);
                      if (isFinanciamientoEnabled) handleNavigateToFinancing(item.id);
                    }}
                  >
                    <DollarSign className="w-4 h-4 text-green-500" /> Financiamiento
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      <div className={tableContainerClasses} style={tableContainerStyle}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ubicación</th>
              {variant === 'full' && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Descripción</th>
              )}
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Prioridad</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
              {showFinancialStatus && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado Financiero</th>
              )}
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
              {(showActions || showFinancingButton) && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 text-center">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.tipo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                {variant === 'full' && (
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{item.description}</td>
                )}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {getPriorityText(item.priority)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </td>
                {showFinancialStatus && (
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFinancialStatusColor(item.financialStatus)}`}>
                      {getFinancialStatusText(item.financialStatus)}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-center">
                  <ActionMenu
                    item={item}
                    onProgramRequest={onProgramRequest}
                    handleNavigateToFinancing={handleNavigateToFinancing}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {selectedRequest && (
        <ModalRequestDetails
          request={selectedRequest}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}

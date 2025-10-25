import type { ReactNode } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

/**
 * Modal base reutilizable para todo el sistema
 * Aplica fondo translúcido claro, desenfoque, sombra y centrado
 * El contenido se pasa como children
 */
export default function BaseModal({ isOpen, onClose, children, maxWidth = 'max-w-2xl' }: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-fade-in relative`}>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 hover:bg-gray-200 rounded-full transition"
          aria-label="Cerrar"
        >
          <span className="text-2xl font-bold text-gray-600">×</span>
        </button>
        {children}
      </div>
    </div>
  );
}

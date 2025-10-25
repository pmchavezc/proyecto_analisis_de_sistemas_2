import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Download, DollarSign } from 'lucide-react';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principal con Sidebar persistente y colapsable
 * Incluye botón de toggle siempre visible para ocultar/mostrar
 */
export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/solicitudes', label: 'Solicitudes', icon: FileText },
    { path: '/solicitudes-externas', label: 'Solicitudes Recibidas', icon: Download },
    { path: '/financiamiento/todas', label: 'Finanzas', icon: DollarSign },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fijo (sticky) */}
      <aside
        className={`${
          isCollapsed ? 'w-0' : 'w-64'
        } bg-white shadow-sm transition-all duration-300 ease-in-out relative flex-shrink-0 sticky top-0 h-screen`}
      >
        <div className={`${isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-all duration-300 p-4 h-full overflow-y-auto`}>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-green-50 text-green-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-green-600' : 'text-gray-500'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Botón Toggle - Fijo en la pantalla */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white rounded-r-full p-2 shadow-lg transition-all duration-200 z-50"
          style={{ marginLeft: isCollapsed ? '0' : '16rem' }}
          aria-label={isCollapsed ? 'Mostrar menú' : 'Ocultar menú'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

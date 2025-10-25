import { Search, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

interface HeaderProps {
  title: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  username?: string;
}

export default function Header({ 
  title, 
  searchTerm = '', 
  onSearchChange, 
  showSearch = true,
  username = 'Usuario'
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Sesión cerrada correctamente');
    // Forzar recarga de la página para actualizar el estado de autenticación
    window.location.href = '/login';
  };

  // Obtener el nombre de usuario del authService si está disponible
  const currentUser = authService.getUser();
  const displayUsername = currentUser?.username || username;

  return (
    <header className="bg-green-300 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center gap-4">
          {showSearch && onSearchChange && (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          )}
          
          {/* Menú de usuario con dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-green-400 rounded-lg transition p-2 cursor-pointer"
              title="Click para abrir menú de usuario"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-semibold">{displayUsername.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-gray-700 font-medium">{displayUsername}</span>
              <ChevronDown 
                size={20} 
                className={`text-gray-700 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm text-gray-500">Sesión activa</p>
                  <p className="text-sm font-medium text-gray-800">{displayUsername}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition font-medium"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

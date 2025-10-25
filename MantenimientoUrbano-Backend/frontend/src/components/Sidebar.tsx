import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/solicitudes', label: 'Solicitudes' },
    { path: '/solicitudes-externas', label: 'Solicitudes Recibidas' },
    { path: '/financiamiento/todas', label: 'Finanzas' },
  ];

  return (
    <aside className="w-64 bg-white min-h-screen shadow-sm p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

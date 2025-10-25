import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Por favor, ingrese usuario y contraseña');
      return;
    }

    setLoading(true);

    try {
      // Llamar al servicio de autenticación
      const response = await authService.login({ username, password });
      
      toast.success(`¡Bienvenido, ${response.user.username}!`);
      
      // Llamar a la función onLogin del componente padre
      onLogin();
      
      // Navegar al dashboard
      navigate('/dashboard');
    } catch (error) {
      // Mostrar mensaje de error apropiado
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        toast.error('Usuario o contraseña incorrectos');
      } else if (axiosError.response?.status === 404) {
        toast.error('Servicio no disponible');
      } else {
        toast.error('Error al iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mantenimiento Urbano</h1>
          <p className="text-gray-600">Gestión Municipal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Ingrese su usuario"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Ingrese su contraseña"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        {/* Recuperación de contraseña - comentado hasta implementación futura */}
        {/* <div className="mt-6 text-center">
          <a href="#" className="text-sm text-green-600 hover:text-green-700">
            ¿Olvidaste tu contraseña?
          </a>
        </div> */}
      </div>
    </div>
  );
}

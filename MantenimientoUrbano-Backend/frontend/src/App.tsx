import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestsList from './pages/RequestsList';
import ExternalRequestsList from './pages/ExternalRequestsList';
import ProgramarSolicitud from './pages/ProgramarSolicitud';
import SolicitarFinanciamiento from './pages/SolicitarFinanciamiento';
import FinanciamientoRequestsList from './pages/FinanciamientoRequestsList';
import { authService } from './api/authService';
import './App.css';

function App() {
  // Verificar si hay sesión guardada usando el authService
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return authService.isAuthenticated();
  });

  const handleLogin = () => {
    console.log('Login successful');
    setIsLoggedIn(true);
  };

  // Verificar autenticación al cargar la app y escuchar cambios en el storage
  useEffect(() => {
    // Verificar estado inicial
    setIsLoggedIn(authService.isAuthenticated());

    // Escuchar cambios en localStorage (para sincronizar logout entre tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        setIsLoggedIn(authService.isAuthenticated());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="App">
      {/* Toast Container Global */}
      <Toaster position="top-right" />
      
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/solicitudes" 
          element={isLoggedIn ? <RequestsList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/solicitudes-externas" 
          element={isLoggedIn ? <ExternalRequestsList /> : <Navigate to="/login" />} 
        />
        <Route
          path="/financiamiento/todas"
          element={isLoggedIn ? <FinanciamientoRequestsList /> : <Navigate to="/login" />}
        />
        <Route
        path="/programar/:id"
        element={isLoggedIn ? <ProgramarSolicitud /> : <Navigate to="/login" />}
        />
        <Route
        path="/financiamiento/:id"
        element={isLoggedIn ? <SolicitarFinanciamiento /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;

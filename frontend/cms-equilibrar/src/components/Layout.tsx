import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isClientView = user?.role === 'Cliente';

  useEffect(() => {
    // Si la página se recarga (el componente Layout se monta por primera vez en la sesión actual de navegación)
    // Redireccionamos forzosamente a Resumen o panel principal
    if (isClientView && location.pathname !== '/mi-cuenta') {
      navigate('/mi-cuenta', { replace: true });
    } else if (!isClientView && location.pathname !== '/resumen') {
      navigate('/resumen', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta solo "al actualizar/cargar la página" (montaje del Layout)

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {!isClientView && <Sidebar />}
      <main className="flex-1 overflow-y-auto relative">
        <div className={`min-h-full animate-fade-in ${isClientView ? 'p-0' : 'p-4 md:p-8'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

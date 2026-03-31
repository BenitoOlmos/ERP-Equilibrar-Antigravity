import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();
  
  const isClientView = user?.role === 'Cliente';

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

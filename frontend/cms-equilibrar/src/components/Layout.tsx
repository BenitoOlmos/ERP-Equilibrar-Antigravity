import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-4 md:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

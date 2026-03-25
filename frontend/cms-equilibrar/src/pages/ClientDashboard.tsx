import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Calendar, Activity, GraduationCap } from 'lucide-react';

export function ClientDashboard() {
   const { user } = useAuth();
   const [loading, setLoading] = useState(true);
   const [purchases, setPurchases] = useState<any[]>([]);

   useEffect(() => {
      // Future endpoint: /api/users/me/purchases
      // For now, mockup or simple fetch logic handled in subsequent phases
      setTimeout(() => setLoading(false), 500);
   }, []);

   if (loading) return <div className="flex h-full items-center justify-center"><div className="w-12 h-12 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>;

   return (
      <div className="max-w-6xl mx-auto animate-fade-in p-6">
         <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 flex items-center">
               Mi Portal de Paciente
            </h1>
            <p className="text-slate-500 mt-2">Bienvenido, {user?.name}. Aquí encontrarás todos tus productos adquiridos.</p>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Citas Clínicas</h3>
               <p className="text-xs text-slate-400 mt-1">Próximas Sesiones Agendadas</p>
               <button className="mt-4 text-[#00A89C] bg-[#00A89C]/10 hover:bg-[#00A89C]/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full">Ver Agenda</button>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
               <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Programas Vivos</h3>
               <p className="text-xs text-slate-400 mt-1">Suscripciones RFAI Activas</p>
               <button className="mt-4 text-[#00A89C] bg-[#00A89C]/10 hover:bg-[#00A89C]/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full">Ir al Programa</button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
               <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Academia</h3>
               <p className="text-xs text-slate-400 mt-1">Cursos Teóricos Adquiridos</p>
               <button className="mt-4 text-[#00A89C] bg-[#00A89C]/10 hover:bg-[#00A89C]/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full">Ir al Aula</button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
               <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Tienda Clínica</h3>
               <p className="text-xs text-slate-400 mt-1">Explora Nuevos Servicios</p>
               <button className="mt-4 bg-[#00A89C] hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full shadow-lg shadow-[#00A89C]/20">Ver Catálogo</button>
            </div>
         </div>

         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
               <h2 className="text-lg font-black text-slate-800 tracking-tight">Historial de Productos Comprados</h2>
            </div>
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 text-center">
               <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
               <p className="font-bold">No tienes compras registradas aún.</p>
               <p className="text-sm mt-1">Tus programas y facturas aparecerán aquí.</p>
            </div>
         </div>
      </div>
   );
}

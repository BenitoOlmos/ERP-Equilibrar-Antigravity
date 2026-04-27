import React, { useEffect, useState } from 'react';
import axios from '../api';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Activity, DollarSign, Calendar, Target, Shield, Stethoscope, 
  UserCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Stats {
  users: {
    total: number;
    clients: number;
    specialists: number;
    coordinators: number;
    admins: number;
  };
  appointments: number;
  revenue: number | {
    total: number;
    month: number;
    week: number;
    day: number;
  };
  diagnostics: number;
}

export function Resumen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueFilter, setRevenueFilter] = useState<'month' | 'week' | 'day' | 'total'>('month');
  const [showHistory, setShowHistory] = useState(false);

  if (user?.role === 'CLIENT' || user?.role === 'USER') {
     return <Navigate to="/mi-cuenta" replace />;
  }

  useEffect(() => {
    axios.get('/api/master/resumen')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in" id="dashboard-administrador">
      {/* ========================================================= */}
      {/* SECCIÓN 1: ENCABEZADO PRINCIPAL DEL DASHBOARD             */}
      {/* ========================================================= */}
      <header className="mb-8" id="seccion-encabezado" data-seccion="1: CABECERA Y TITULO">
        <h1 className="text-4xl font-black tracking-tight text-slate-800">Panel de Control</h1>
        <p className="text-slate-500 mt-2">Visión consolidada de operaciones, finanzas y tipos de usuarios activos.</p>
      </header>

      {/* ========================================================= */}
      {/* SECCIÓN 2: FILA DE TARJETAS DE INDICADORES (KPIs)         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="seccion-kpis" data-seccion="2: TODA LA FILA DE TARJETAS (KPIs)">
        
        {/* TARJETA 2.1: INGRESOS TOTALES (Destacada) */}
        <div id="tarjeta-ingresos" data-seccion="2.1: TARJETA DE INGRESOS" className="lg:col-span-4 bg-gradient-to-br from-[#00A89C] to-emerald-600 rounded-3xl p-8 text-white shadow-xl relative flex flex-col justify-between z-20">
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <DollarSign className="w-48 h-48 absolute -right-8 -bottom-16 text-white opacity-10 transform -rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="text-emerald-100 font-bold uppercase tracking-wider text-xs mb-2">
                {typeof stats.revenue === 'number' ? 'Ingresos Consolidados' : revenueFilter === 'month' ? 'Ingresos del Mes' : revenueFilter === 'week' ? 'Ingresos de la Semana' : revenueFilter === 'day' ? 'Ingresos de Hoy' : 'Ingresos Históricos'}
              </h3>
              <div className="text-5xl lg:text-6xl font-black tracking-tighter">
                ${(typeof stats.revenue === 'number' ? stats.revenue : stats.revenue[revenueFilter] || 0).toLocaleString()}
              </div>
            </div>
            {typeof stats.revenue !== 'number' && (
              <div className="relative z-50">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm transition-all group outline-none ring-2 ring-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 transition-colors text-white/70 group-hover:text-white" />
                    <span className="text-sm font-bold text-white capitalize">Histórico Completo</span>
                  </div>
                </button>
                
                {showHistory && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col sm:flex-row overflow-hidden min-w-[320px] sm:min-w-[480px]">
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-4 w-full sm:w-40 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 mb-2">Atajos</span>
                        <button onClick={() => {setRevenueFilter('day'); setShowHistory(false);}} className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Hoy</button>
                        <button onClick={() => {setRevenueFilter('week'); setShowHistory(false);}} className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Esta Semana</button>
                        <button onClick={() => {setRevenueFilter('month'); setShowHistory(false);}} className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Este Mes</button>
                        <button onClick={() => {setRevenueFilter('total'); setShowHistory(false);}} className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Todo el Histórico</button>
                    </div>
                    <div className="p-4 flex-1 select-none">
                        <div className="flex items-center justify-between mb-4">
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <ChevronLeft className="w-4 h-4 text-slate-500" />
                            </button>
                            <div className="font-bold text-sm text-slate-700 dark:text-slate-200 capitalize">abril 2026</div>
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mb-2">
                            <div className="text-center text-[10px] font-black text-slate-400 uppercase">Lu</div>
                            <div className="text-center text-[10px] font-black text-slate-400 uppercase">Ma</div>
                            <div className="text-center text-[10px] font-black text-slate-400 uppercase">Mi</div>
                            <div className="text-center text-[10px] font-black text-slate-400 uppercase">Ju</div>
                            <div className="text-center text-[10px] font-black text-slate-400 uppercase">Vi</div>
                            <div className="text-center text-[10px] font-black text-slate-400 uppercase">Sá</div>
                            <div className="text-center text-[10px] font-black text-slate-400 uppercase">Do</div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-1">
                            <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">30</button>
                            <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">31</button>
                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(day => (
                                <button key={day} className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">{day}</button>
                            ))}
                            <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">1</button>
                            <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">2</button>
                            <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">3</button>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">Selecciona inicio</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-bold bg-white/20 w-max px-4 py-2 rounded-full">
            <DollarSign className="w-4 h-4" /> {revenueFilter === 'total' ? 'Flujo Total' : 'Flujo Filtrado'}
          </div>
        </div>

        {/* TARJETA 2.2: VOLUMEN GLOBAL DE USUARIOS */}
        <div id="tarjeta-usuarios" data-seccion="2.2: TARJETA VOLUMEN DE USUARIOS" className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Users className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Volumen de Usuarios</h3>
            <div className="text-4xl font-black text-slate-800">{stats.users.total}</div>
          </div>
        </div>

        {/* TARJETA 2.3: CANTIDAD MÁXIMA DE CONSULTAS GLOBALES */}
        <div id="tarjeta-consultas" data-seccion="2.3: TARJETA DE CONSULTAS GLOBALES" className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
            <Calendar className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Consultas Globales</h3>
            <div className="text-4xl font-black text-slate-800">{stats.appointments}</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 3: PANELES DETALLADOS INFERIORES                  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="seccion-paneles-inferiores" data-seccion="3: FILA INFERIOR DE PANELES GRANDES">
        
        {/* PANEL 3.1: COMPOSICIÓN DEL DIRECTORIO (Métricas por Rol) */}
        <div id="panel-directorio-usuarios" data-seccion="3.1: PANEL DISTRIBUCION DE ROLES" className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <UserCircle className="w-5 h-5 mr-2 text-[#00A89C]" />
              Composición del Directorio
            </h2>
          </div>
          <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
              <Activity className="w-6 h-6 text-[#00A89C] mb-2" />
              <div className="text-2xl font-black text-slate-800">{stats.users.clients}</div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Pacientes / Alumnos</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 shrink-0 border border-purple-100 flex flex-col items-center justify-center text-center">
              <Stethoscope className="w-6 h-6 text-purple-500 mb-2" />
              <div className="text-2xl font-black text-slate-800">{stats.users.specialists}</div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-purple-600/70">Especialistas</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-center">
              <Target className="w-6 h-6 text-blue-500 mb-2" />
              <div className="text-2xl font-black text-slate-800">{stats.users.coordinators}</div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-blue-600/70">Coordinadores</div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center justify-center text-center">
              <Shield className="w-6 h-6 text-red-500 mb-2" />
              <div className="text-2xl font-black text-slate-800">{stats.users.admins}</div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-red-600/70">Administradores</div>
            </div>

          </div>
        </div>

        {/* PANEL 3.2: MÉTRICAS DEL TEST RFAI (Destacado Oscuro) */}
        <div id="panel-metricas-rfai" data-seccion="3.2: PANEL OSCURO TEST RFAI" className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-6 border border-indigo-500/30">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Diagnósticos Test RFAI</h3>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
              {stats.diagnostics}
            </div>
            <p className="mt-4 text-xs text-slate-400 font-medium">Diagnósticos recopilados por el portal de evaluaciones libres.</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2" />
        </div>

      </div>

    </div>
  );
}

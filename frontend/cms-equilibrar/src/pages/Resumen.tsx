import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Activity, DollarSign, Calendar, Target, Shield, Stethoscope, 
  UserCircle 
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
  revenue: number;
  diagnostics: number;
}

export function Resumen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div id="tarjeta-ingresos" data-seccion="2.1: TARJETA DE INGRESOS" className="lg:col-span-2 bg-gradient-to-br from-[#00A89C] to-emerald-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-emerald-100 font-bold uppercase tracking-wider text-xs mb-2">Ingresos Consolidados</h3>
            <div className="text-5xl lg:text-6xl font-black tracking-tighter">
              ${stats.revenue.toLocaleString()}
            </div>
          </div>
          <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-bold bg-white/20 w-max px-4 py-2 rounded-full">
            <DollarSign className="w-4 h-4" /> Flujo Total
          </div>
          <DollarSign className="w-48 h-48 absolute -right-8 -bottom-16 text-white opacity-10 transform -rotate-12" />
        </div>

        {/* TARJETA 2.2: VOLUMEN GLOBAL DE USUARIOS */}
        <div id="tarjeta-usuarios" data-seccion="2.2: TARJETA VOLUMEN DE USUARIOS" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Volumen de Usuarios</h3>
            <div className="text-4xl font-black text-slate-800">{stats.users.total}</div>
          </div>
        </div>

        {/* TARJETA 2.3: CANTIDAD MÁXIMA DE CONSULTAS GLOBALES */}
        <div id="tarjeta-consultas" data-seccion="2.3: TARJETA DE CONSULTAS GLOBALES" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-rose-500" />
            </div>
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

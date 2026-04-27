import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Filter, User as UserIcon } from 'lucide-react';
import api from '../api';

export function Auditoria() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [uniqueUsers, setUniqueUsers] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoadingLogs(true);
      try {
        const params = new URLSearchParams();
        if (selectedUser) params.append('userId', selectedUser);
        
        const response = await api.get(`/api/master/audit?${params.toString()}`);
        setLogs(response.data);
        
        // Extract unique users for the filter if it's the initial load
        if (!selectedUser && response.data.length > 0) {
           const usersMap = new Map();
           response.data.forEach((log: any) => {
              if (log.user && !usersMap.has(log.user.id)) {
                 usersMap.set(log.user.id, log.user);
              }
           });
           setUniqueUsers(Array.from(usersMap.values()));
        }
      } catch (error) {
        console.error('Error fetching audit logs', error);
      } finally {
        setIsLoadingLogs(false);
      }
    };

    fetchLogs();
  }, [selectedUser]);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col pt-8">
      <header className="mb-8 shrink-0">
        <h1 className="text-3xl font-black text-slate-800 flex items-center">
        <Activity className="w-8 h-8 mr-3 text-blue-500" />
          Historial de Auditoría
        </h1>
        <p className="text-slate-500 mt-2">Monitorea los cambios realizados en la base de datos por los usuarios del sistema.</p>
      </header>

      <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex-1">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
               <h2 className="text-xl font-bold text-slate-800">
                  Registro de Acciones
               </h2>
               <p className="text-slate-500 text-sm mt-1">Consulta los registros de creación, edición y eliminación (CRUD).</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select 
                     className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                     value={selectedUser}
                     onChange={(e) => setSelectedUser(e.target.value)}
                  >
                     <option value="">Todos los Usuarios</option>
                     {uniqueUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                     ))}
                  </select>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                     <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                     <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500">Acción</th>
                     <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500">Módulo</th>
                     <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500">Registro</th>
                     <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Detalles</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {isLoadingLogs ? (
                     <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                           <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                           Cargando historial...
                        </td>
                     </tr>
                  ) : logs.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                           No hay registros de auditoría disponibles para los filtros seleccionados.
                        </td>
                     </tr>
                  ) : (
                     logs.map((log) => (
                        <React.Fragment key={log.id}>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="py-4 px-5">
                              <div className="flex items-center text-sm text-slate-600 font-medium">
                                 <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                 {new Date(log.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                              </div>
                           </td>
                           <td className="py-4 px-5">
                              <div className="flex items-center">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 shrink-0">
                                    <UserIcon className="w-4 h-4 text-slate-500" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-slate-800">{log.user?.name || 'Sistema'}</p>
                                    <p className="text-xs text-slate-500">{log.user?.role || 'Autómata'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4 px-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                 log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700' :
                                 log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                 'bg-rose-100 text-rose-700'
                              }`}>
                                 {log.action === 'CREATE' ? 'CREACIÓN' : log.action === 'UPDATE' ? 'EDICIÓN' : 'ELIMINACIÓN'}
                              </span>
                           </td>
                           <td className="py-4 px-5 text-sm font-bold text-slate-700">
                              {log.model}
                           </td>
                           <td className="py-4 px-5 text-sm font-mono text-slate-500 max-w-[150px] truncate">
                              {log.recordId}
                           </td>
                           <td className="py-4 px-5 text-center">
                              <button 
                                 onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                                 className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                 {expandedRow === log.id ? 'Ocultar' : 'Ver Detalles'}
                              </button>
                           </td>
                        </tr>
                        {expandedRow === log.id && log.details && (
                           <tr className="bg-slate-50/50 border-b border-slate-100">
                              <td colSpan={6} className="p-0">
                                 <div className="px-8 py-4 bg-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
                                    <div className="text-slate-400 mb-2 font-sans font-bold uppercase tracking-widest text-[10px]">Carga de Datos Modificada:</div>
                                    <pre>{JSON.stringify(log.details, null, 2)}</pre>
                                 </div>
                              </td>
                           </tr>
                        )}
                     </React.Fragment>
                  ))
                  )}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}

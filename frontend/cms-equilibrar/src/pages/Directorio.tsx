import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Activity, BookOpen, MessageCircle, UserCircle, Phone, Mail } from 'lucide-react';

export default function Directorio() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);

  const fetchPatients = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/data/users'),
      axios.get('/api/data/appointments')
    ])
      .then(([resUsers, resAppts]) => {
        const appointments = resAppts.data || [];
        setAllAppointments(appointments);
        const usersWithAppointments = new Set(appointments.map((a: any) => a.clientId).filter(Boolean));

        const clientUsers = resUsers.data.filter((u: any) => 
          ['CLIENT', 'Cliente', 'USER', 'CLIENTE'].includes(u.role) && 
          usersWithAppointments.has(u.id)
        );
        
        setPatients(clientUsers);
        if (clientUsers.length > 0) {
          setSelectedPatient(clientUsers[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.profile?.firstName || ''} ${p.profile?.lastName || ''} ${p.name || ''}`.toLowerCase();
    const emailStr = (p.email || '').toLowerCase();
    const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.every(t => fullName.includes(t) || emailStr.includes(t));
  });

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00A89C] to-emerald-600 shadow-lg shadow-emerald-200 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </span>
            Directorio Médico
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1 ml-13">Historial de consultas y atenciones.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* PANEL IZQUIERDO: LISTA MAESTRA */}
        <div className="w-1/3 min-w-[300px] flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar paciente..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A89C] focus:border-transparent outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-sm">Cargando pacientes...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">No hay pacientes activos.</div>
            ) : (
              filteredPatients.map(patient => (
                <button 
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border ${
                    selectedPatient?.id === patient.id 
                    ? 'bg-rose-50 border-rose-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50'
                  } flex items-center gap-3`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    <UserCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className={`text-sm font-bold truncate ${selectedPatient?.id === patient.id ? 'text-rose-700' : 'text-slate-700'}`}>
                      {patient.profile?.firstName} {patient.profile?.lastName}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{patient.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO: DETALLE DEL PACIENTE (Pestañas) */}
        {selectedPatient ? (
          <div className="flex-1 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
            
            {/* Cabecera del Paciente */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {selectedPatient.profile?.firstName} {selectedPatient.profile?.lastName}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedPatient.email}
                    </span>
                    {selectedPatient.phone && (
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {selectedPatient.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   {allAppointments.filter(app => app.clientId === selectedPatient.id).length === 0 ? (
                      <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">Sin Consultas Registradas</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">Este paciente no posee un historial de consultas médicas agendadas en el sistema.</p>
                      </div>
                   ) : (
                      <div className="space-y-4 max-w-4xl mx-auto">
                         {allAppointments
                           .filter(app => app.clientId === selectedPatient.id)
                           .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                           .map((app, index) => {
                             const apptDate = new Date(app.date);
                             const statusColors: any = { SCHEDULED: 'bg-emerald-100 text-emerald-700 border-emerald-200', COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200', CANCELLED: 'bg-red-100 text-red-700 border-red-200', NO_SHOW: 'bg-amber-100 text-amber-700 border-amber-200' };
                             const statusLabels: any = { SCHEDULED: 'Agendada', COMPLETED: 'Completada', CANCELLED: 'Cancelada', NO_SHOW: 'Inasistencia' };
                             
                             return (
                               <div key={app.id || index} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                                  <div className="flex items-center gap-5">
                                     <div className="w-20 shrink-0 text-center flex flex-col justify-center border-r border-slate-100 pr-5">
                                        <div className="text-[10px] uppercase font-black tracking-widest text-[#00A89C] bg-[#00A89C]/10 py-1 px-2 rounded-lg mb-1">{apptDate.toLocaleDateString('es-ES', { month: 'short', day: '2-digit' })}</div>
                                        <div className="text-xl font-black text-slate-700 leading-none">{apptDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' })}<span className="text-xs ml-0.5">hs</span></div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-1">{apptDate.getFullYear()}</div>
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-lg text-slate-800 tracking-tight leading-tight">{app.service?.name || app.rfaiType || 'Reserva Estándar'}</h4>
                                        <div className="flex items-center gap-3 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                           <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                              <UserCircle className="w-3.5 h-3.5 text-slate-400" /> Atendió: {app.specialist?.profile?.firstName || 'Especialista'} {app.specialist?.profile?.lastName || ''}
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${statusColors[app.status] || 'bg-slate-100 text-slate-500'}`}>
                                     {statusLabels[app.status] || app.status}
                                  </div>
                               </div>
                             );
                           })}
                      </div>
                   )}
                </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-3xl border border-slate-200/60 flex items-center justify-center text-slate-400">
            {loading ? 'Cargando datos...' : 'Selecciona a un paciente de la lista para ver sus detalles.'}
          </div>
        )}
        
      </div>
    </div>
  );
}

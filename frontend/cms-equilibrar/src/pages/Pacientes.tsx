import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Activity, BookOpen, MessageCircle, UserCircle, Phone, Mail } from 'lucide-react';

export default function Pacientes() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'progreso' | 'bitacora' | 'chat'>('progreso');

  const fetchPatients = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/data/users'),
      axios.get('/api/data/finance'),
      axios.get('/api/data/finance/catalog')
    ])
      .then(([resUsers, resFinance, resCatalog]) => {
        const payments = resFinance.data || [];
        const catalog = resCatalog.data || { programs: [], treatments: [], courses: [] };
        
        // Valid concepts correspond strictly to Programs, Treatments, and Courses
        const validConcepts = [
          ...(catalog.programs || []).map((p: any) => p.title),
          ...(catalog.treatments || []).map((p: any) => p.name),
          ...(catalog.courses || []).map((c: any) => c.title)
        ];

        // Ensure users only qualify if their payment concept matches a premium package
        const validPaymentUserIds = new Set(
          payments
            .filter((p: any) => p.status === 'COMPLETED' && p.concept && validConcepts.includes(p.concept))
            .map((p: any) => p.userId)
        );

        const clientUsers = resUsers.data.filter((u: any) => 
          ['CLIENT', 'Cliente', 'USER', 'CLIENTE'].includes(u.role) && 
          validPaymentUserIds.has(u.id)
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
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || emailStr.includes(term);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-200 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </span>
            Pacientes Activos
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1 ml-13">Supervisa y apoya a la comunidad clínica.</p>
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

            {/* TABULADOR */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 shrink-0">
              <button 
                onClick={() => setActiveTab('progreso')}
                className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'progreso' ? 'border-[#0097B2] text-[#0097B2]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Activity className="w-4 h-4" /> Progreso
              </button>
              <button 
                onClick={() => setActiveTab('bitacora')}
                className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'bitacora' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Bitácora de esta semana
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'chat' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" /> Chat con Cliente
              </button>
            </div>

            {/* CONTENIDO VARIABLE */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              
              {activeTab === 'progreso' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Panel de Progreso Clínico</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                      Aquí aparecerán las estadísticas de avance, gráficas RFAI y evaluación longitudinal del paciente.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'bitacora' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Revisión de Bitácoras Semanales</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                      Área designada para visualizar los test y diarios llenados por el cliente durante sus semanas en los programas.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center h-full flex flex-col justify-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Central de Mensajería</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                      Pronto los clientes podrán intercambiar mensajes directos a través de esta ventana estilo WhatsApp.
                    </p>
                  </div>
                </div>
              )}

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

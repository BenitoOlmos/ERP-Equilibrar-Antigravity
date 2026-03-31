import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User as UserIcon, Calendar, CheckCircle, Search, ChevronRight, PenLine, Send, Info } from 'lucide-react';

export default function Bitacoras() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [bitacoras, setBitacoras] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ref para input de respuestas
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [savingReplay, setSavingReplay] = useState<string | null>(null); // Guardando ID

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/data/users'),
      axios.get('/api/data/payments'),
      axios.get('/api/data/payments/catalog')
    ])
      .then(([resUsers, resFinance, resCatalog]) => {
        const payments = resFinance.data || [];
        const catalog = resCatalog.data || { programs: [], treatments: [], courses: [] };
        
        // Exact names of concepts mapping to our premium services
        const validConcepts = [
          ...(catalog.programs || []).map((p: any) => p.title),
          ...(catalog.treatments || []).map((p: any) => p.name),
          ...(catalog.courses || []).map((c: any) => c.title)
        ];

        // Filter User IDs who bought a valid concept
        const validPaymentUserIds = new Set(
          payments
            .filter((p: any) => p.status === 'COMPLETED' && p.concept && validConcepts.includes(p.concept))
            .map((p: any) => p.userId)
        );

        // Filter valid users
        const activeUsers = resUsers.data.filter((u: any) => validPaymentUserIds.has(u.id));
        setPatients(activeUsers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const loadBitacoras = async (patientId: string) => {
    try {
       const res = await axios.get(`/api/data/users/${patientId}/bitacoras`);
       setBitacoras(res.data || []);
    } catch (e) {
       console.error("Error al cargar bitácoras del paciente:", e);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setBitacoras([]);
    loadBitacoras(patient.id);
  };

  const handleReplyChange = (logId: string, value: string) => {
      setReplyTexts(prev => ({ ...prev, [logId]: value }));
  };

  const submitReply = async (logId: string) => {
      const resp = replyTexts[logId];
      if (!resp || !resp.trim()) return;
      
      setSavingReplay(logId);
      try {
          await axios.put(`/api/data/users/${selectedPatient.id}/bitacoras/${logId}/reply`, {
              response: resp,
              specialistId: user?.id
          });
          // Update visual sin recargar db
          setBitacoras(prev => prev.map(lt => lt.id === logId ? {
              ...lt,
              response: resp,
              specialistId: user?.id,
              specialist: { name: user?.name, id: user?.id },
              respondedAt: new Date().toISOString()
          } : lt));
          
          setReplyTexts(prev => {
              const clone = { ...prev };
              delete clone[logId];
              return clone;
          });
      } catch (e) {
          console.error("Error enviando respuesta", e);
      } finally {
          setSavingReplay(null);
      }
  };

  const filteredPatients = patients.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Grupos por semana
  const groupedBitacoras = bitacoras.reduce((acc, log) => {
      if (!acc[log.weekNumber]) acc[log.weekNumber] = [];
      acc[log.weekNumber].push(log);
      return acc;
  }, {} as Record<number, any[]>);
  
  const sortedWeeks = Object.keys(groupedBitacoras).map(Number).sort((a, b) => b - a); // Descendente

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      
      {/* Columna Izquierda: Pacientes */}
      <div className="w-full md:w-1/3 xl:w-1/4 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden shrink-0">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
               <BookOpen className="w-6 h-6 text-[#00A89C]" /> Bitácoras
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar paciente..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A89C]/20 focus:border-[#00A89C] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {loading ? (
                <div className="flex justify-center p-8">
                   <div className="w-8 h-8 border-4 border-[#00A89C] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredPatients.length === 0 ? (
                <div className="text-center p-8 text-slate-500 text-sm font-medium">No se encontraron pacientes activos.</div>
            ) : (
                filteredPatients.map(p => (
                   <button 
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all group ${selectedPatient?.id === p.id ? 'bg-[#00A89C] text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}`}
                   >
                      <div className="flex items-center gap-3 w-[85%]">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${selectedPatient?.id === p.id ? 'border-white/20 bg-white/10' : 'border-slate-100 bg-white shadow-sm'}`}>
                             <UserIcon className="w-5 h-5" />
                         </div>
                         <div className="truncate">
                            <h3 className="font-bold text-sm truncate">{p.name || p.email}</h3>
                            <p className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${selectedPatient?.id === p.id ? 'text-white/80' : 'text-slate-400'}`}>Paciente Activo</p>
                         </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedPatient?.id === p.id ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100 -translate-x-2'}`} />
                   </button>
                ))
            )}
         </div>
      </div>

      {/* Columna Derecha: Bitácoras del Paciente */}
      <div className="w-full md:w-2/3 xl:w-3/4 flex flex-col h-full animate-fade-in relative z-10">
         {!selectedPatient ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed m-1">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-6 shadow-inner">
                   <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Selecciona un Paciente</h3>
                <p className="text-slate-400">Escoge un perfil a la izquierda para revisar la bitácora.</p>
             </div>
         ) : (
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                {/* Cabecera del Paciente */}
                <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00A89C] border border-[#00A89C]/10 shadow-sm shrink-0">
                         <UserIcon className="w-8 h-8" />
                      </div>
                      <div>
                         <span className="text-xs font-black tracking-widest text-[#00A89C] uppercase bg-cyan-50 px-2 py-1 rounded-md mb-2 inline-block">Revisión Cínica</span>
                         <h2 className="text-2xl font-black text-slate-800 leading-tight">{selectedPatient.name}</h2>
                         <p className="text-sm font-medium text-slate-500 mt-1">{selectedPatient.email}</p>
                      </div>
                   </div>
                </div>

                {/* Historial de Bitácoras */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/30">
                   {bitacoras.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                          <Info className="w-8 h-8 mb-3 opacity-50" />
                          <p className="font-medium text-sm">Este paciente no ha registrado entradas en su bitácora todavía.</p>
                       </div>
                   ) : (
                       <div className="space-y-8 max-w-4xl mx-auto pb-10">
                          {sortedWeeks.map(week => (
                              <div key={week} className="relative">
                                 {/* Línea conectora */}
                                 <div className="absolute top-8 left-8 bottom-[-2rem] w-px bg-slate-200 z-0 hidden md:block"></div>
                                 
                                 <div className="flex items-center gap-4 mb-6 relative z-10">
                                     <div className="bg-slate-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md uppercase tracking-widest flex items-center gap-2">
                                         <Calendar className="w-4 h-4 opacity-50" /> Semana {week}
                                     </div>
                                 </div>
                                 
                                 <div className="space-y-6 md:pl-16 relative z-10">
                                     {groupedBitacoras[week].map((log: any) => (
                                         <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative transition-all hover:shadow-md group">
                                            {/* Etiqueta lateral */}
                                            {log.response ? (
                                                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400"></div>
                                            ) : (
                                                <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
                                            )}
                                            
                                            <div className="p-6">
                                                {/* Encabezado del log */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                       <BookOpen className="w-4 h-4" /> 
                                                       <span className="text-xs font-bold uppercase tracking-wider">{new Date(log.timestamp).toLocaleString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    {!log.response && (
                                                        <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded shadow-sm border border-amber-100 animate-pulse">
                                                            Pendiente
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Contenido del paciente */}
                                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed mb-6 font-medium">
                                                    {log.content}
                                                </div>

                                                {/* Respuesta u Opción a Responder */}
                                                {log.response ? (
                                                    <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 ml-4 md:ml-8 relative">
                                                        <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-2 border-indigo-200 rounded-full"></div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                            </div>
                                                            <h5 className="font-bold text-indigo-900 text-sm">{log.specialist?.name || 'Tú'} <span className="text-indigo-400 font-normal mt-0.5 inline-block">respondió el {new Date(log.respondedAt).toLocaleDateString('es-CL')}</span></h5>
                                                        </div>
                                                        <p className="text-sm text-indigo-800 whitespace-pre-wrap pl-8 opacity-90">{log.response}</p>
                                                    </div>
                                                ) : (
                                                    <div className="ml-4 md:ml-8 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden focus-within:border-[#00A89C] focus-within:ring-2 focus-within:ring-[#00A89C]/20 transition-all flex flex-col">
                                                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2">
                                                            <PenLine className="w-3.5 h-3.5 text-slate-400" />
                                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Enviar Respuesta Profesional</span>
                                                        </div>
                                                        <textarea 
                                                            className="w-full min-h-[100px] p-4 text-sm focus:outline-none resize-y"
                                                            placeholder="Escribe tu feedback u observación para el paciente..."
                                                            value={replyTexts[log.id] || ''}
                                                            onChange={(e) => handleReplyChange(log.id, e.target.value)}
                                                        ></textarea>
                                                        <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                                            <button 
                                                                onClick={() => submitReply(log.id)}
                                                                disabled={!replyTexts[log.id]?.trim() || savingReplay === log.id}
                                                                className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${(!replyTexts[log.id]?.trim() || savingReplay === log.id) ? 'bg-slate-200 text-slate-400' : 'bg-[#00A89C] hover:bg-cyan-600 text-white hover:scale-105'}`}
                                                            >
                                                                {savingReplay === log.id ? (
                                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <Send className="w-4 h-4" />
                                                                )}
                                                                Enviar Observación
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                         </div>
                                     ))}
                                 </div>
                              </div>
                          ))}
                       </div>
                   )}
                </div>
             </div>
         )}
      </div>
    </div>
  );
}

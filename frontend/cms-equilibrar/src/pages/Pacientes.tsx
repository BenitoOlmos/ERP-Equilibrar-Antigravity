import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Users, Search, Activity, BookOpen, MessageCircle, UserCircle, Phone, Mail, Headphones, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Pacientes() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'progreso' | 'registro'>('progreso');
  const [patientPrograms, setPatientPrograms] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [weekMetrics, setWeekMetrics] = useState<any>(null);

  useEffect(() => {
     if (selectedPatient) {
         axios.get(`/api/data/users/${selectedPatient.id}/programs`).then(res => {
             const programs = res.data.programs || [];
             setPatientPrograms(programs);
             if (programs.length > 0) {
                 setSelectedServiceId(programs[0].id);
                 setSelectedWeek(1);
             } else {
                 setSelectedServiceId(null);
                 setSelectedWeek(null);
             }
         }).catch(console.error);
     } else {
         setPatientPrograms([]);
         setSelectedServiceId(null);
         setSelectedWeek(null);
     }
  }, [selectedPatient]);

  useEffect(() => {
     if (selectedPatient && selectedServiceId && selectedWeek) {
         setWeekMetrics(null);
         axios.get(`/api/data/stats/metrics/${selectedPatient.id}/${selectedWeek}/${selectedServiceId}`)
              .then(res => setWeekMetrics(res.data))
              .catch(() => setWeekMetrics(null));
     } else {
         setWeekMetrics(null);
     }
  }, [selectedPatient, selectedServiceId, selectedWeek]);

  const parseQuestionnaireHtml = (html: string) => {
      const results: { question: string, score: number }[] = [];
      const regex = /<li><strong>(.*?)<\/strong>.*?<span[^>]*>(\d+)\/10<\/span><\/li>/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
          results.push({ 
              question: match[1].replace(':', '').trim(), 
              score: parseInt(match[2]) 
          });
      }
      return results;
  };

  const { user } = useAuth();

  const fetchPatients = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/data/users'),
      axios.get('/api/data/payments'),
      axios.get('/api/data/appointments'),
      axios.get('/api/data/payments/catalog-all')
    ])
      .then(([resUsers, resFinance, resAppts, resCatalogAll]) => {
        const payments = resFinance.data || [];
        const appointments = resAppts.data || [];
        const catalogAll = resCatalogAll.data || { programs: [], treatments: [], courses: [] };

        // Valid concepts include ALL historical Programs, Treatments, and Courses
        const validConcepts = [
          ...(catalogAll.programs || []).map((p: any) => p.title),
          ...(catalogAll.treatments || []).map((p: any) => p.name),
          ...(catalogAll.courses || []).map((c: any) => c.title)
        ];

        // Users who have at least one successfully completed payment FOR A VALID PROGRAM/TREATMENT
        const validPaymentUserIds = new Set(
          payments
            .filter((p: any) => p.status === 'COMPLETED' && p.concept && validConcepts.includes(p.concept))
            .map((p: any) => p.userId)
        );

        // Map Specialist's assigned clients if role is Specialist
        const specialistClientIds = new Set(
          appointments
            .filter((a: any) => a.specialistId === user?.id)
            .map((a: any) => a.clientId)
        );
        
        const isRestrictedRole = user?.role === 'ESPECIALISTA' || user?.role === 'Especialista';

        const clientUsers = resUsers.data.filter((u: any) => {
           const isClient = ['CLIENT', 'Cliente', 'USER', 'CLIENTE'].includes(u.role);
           const hasPayment = validPaymentUserIds.has(u.id);
           const isAssigned = isRestrictedRole ? specialistClientIds.has(u.id) : true;
           return isClient && hasPayment && isAssigned;
        }).map((u: any) => {
           const userPayments = payments.filter((p: any) => p.userId === u.id && p.status === 'COMPLETED' && p.concept && validConcepts.includes(p.concept));
           userPayments.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
           return { ...u, programStartDate: userPayments.length > 0 ? userPayments[0].createdAt : u.createdAt };
        });
        
        setPatients(clientUsers);
        if (clientUsers.length > 0) {
          setSelectedPatient(clientUsers[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, [user]);

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.profile?.firstName || ''} ${p.profile?.lastName || ''} ${p.name || ''}`.toLowerCase();
    const emailStr = (p.email || '').toLowerCase();
    const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.every(t => fullName.includes(t) || emailStr.includes(t));
  });

  const handleUpdateWeek = async (weekNum: number) => {
     if (!selectedPatient) return;
     try {
         const newWeek = Math.max(0, weekNum); // 0 is Auto Mode
         await axios.put(`/api/data/users/${selectedPatient.id}/week`, { currentWeek: newWeek });
         
         const updated = { ...selectedPatient, currentWeek: newWeek };
         setSelectedPatient(updated);
         setPatients(patients.map(p => p.id === selectedPatient.id ? updated : p));
     } catch (err) {
         console.error('Error updating week', err);
         alert('No se pudo actualizar el progreso del paciente.');
     }
  };

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
            
            {/* SERVICIOS Y SEMANAS */}
            {patientPrograms.length > 0 && (
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col gap-4 shrink-0">
                 <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                     {patientPrograms.map((p) => {
                         const maxWeek = Math.max(...(p.modules || []).map((m: any) => m.weekNumber || 1), 4);
                         return (
                           <button
                              key={p.id}
                              onClick={() => { setSelectedServiceId(p.id); setSelectedWeek(1); }}
                              className={`px-4 py-2 rounded-xl text-sm font-bold shrink-0 transition-colors ${selectedServiceId === p.id ? 'bg-[#0097B2] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                           >
                              {p.title}
                           </button>
                         )
                     })}
                 </div>
                 
                 {selectedServiceId && (
                   <div className="flex flex-col gap-3">
                     <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].slice(0, Math.max(...(patientPrograms.find(p => p.id === selectedServiceId)?.modules || []).map((m: any) => m.weekNumber || 1), 4)).map(wNum => (
                           <button
                              key={wNum}
                              onClick={() => setSelectedWeek(wNum)}
                              className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${selectedWeek === wNum ? 'bg-indigo-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                           >
                              Semana {wNum}
                           </button>
                        ))}
                     </div>
                     
                     {selectedWeek && (
                       <div className="flex flex-col gap-2">
                         <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 mt-2">
                            <div className="flex items-center gap-2">
                               {(() => {
                                  // Compute dynamic actual week if Auto Mode (0)
                                  let actualCurrent = selectedPatient.currentWeek;
                                  if (actualCurrent === 0) {
                                      const start = new Date(selectedPatient.programStartDate);
                                      const diffDays = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                      actualCurrent = Math.max(1, Math.floor(diffDays / 7) + 1);
                                  }
                                  
                                  if (selectedWeek > (actualCurrent || 1)) {
                                      return <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Bloqueada para el paciente {selectedPatient.currentWeek === 0 ? '(Auto Mode)' : ''}</span>;
                                  } else {
                                      return <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Habilitada (Actualmente en Sem {(actualCurrent || 1)})</span>;
                                  }
                               })()}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {selectedPatient.currentWeek !== 0 ? (
                                    <button onClick={() => handleUpdateWeek(0)} className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200 flex items-center gap-1">
                                       Activar Auto Pase Semanal
                                    </button>
                                ) : (
                                    <button onClick={() => {
                                        const start = new Date(selectedPatient.programStartDate);
                                        const diffDays = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                        handleUpdateWeek(Math.max(1, Math.floor(diffDays / 7) + 1));
                                    }} className="text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 flex items-center gap-1">
                                       Desactivar Auto Pase
                                    </button>
                                )}
                                
                                {(() => {
                                    let actualCurrent = selectedPatient.currentWeek;
                                    if (actualCurrent === 0) {
                                        const start = new Date(selectedPatient.programStartDate);
                                        const diffDays = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                        actualCurrent = Math.max(1, Math.floor(diffDays / 7) + 1);
                                    }
                                    
                                    if (selectedWeek > (actualCurrent || 1)) {
                                       return (
                                          <button onClick={() => handleUpdateWeek(selectedWeek)} className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200 flex items-center gap-1">
                                             Habilitar Semana
                                          </button>
                                       );
                                    } else {
                                       return (
                                          <button onClick={() => handleUpdateWeek(selectedWeek - 1)} className="text-[10px] font-black uppercase tracking-wider bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg transition-colors border border-rose-200 flex items-center gap-1">
                                             Bloquear Semana
                                          </button>
                                       );
                                    }
                                })()}
                            </div>
                         </div>
                         
                         <div className="px-4 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg py-2 border border-slate-200 inline-block w-fit">
                            {(() => {
                                const startDate = new Date(selectedPatient.programStartDate);
                                const weekStart = new Date(startDate.getTime() + (selectedWeek - 1) * 7 * 24 * 60 * 60 * 1000);
                                const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000); // 7 days inclusive duration (e.g. Mon-Sun)
                                return (
                                    <>
                                        <span className="font-bold text-slate-700">Rango de fechas de esta semana:</span> {weekStart.toLocaleDateString()} — {weekEnd.toLocaleDateString()}
                                    </>
                                );
                            })()}
                         </div>
                       </div>
                     )}
                   </div>
                 )}
              </div>
            )}

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
                onClick={() => setActiveTab('registro')}
                className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'registro' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" /> Registro Emocional
              </button>
            </div>

            {/* CONTENIDO VARIABLE */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              
              {activeTab === 'progreso' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {weekMetrics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
                           <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0">
                               <Headphones className="w-6 h-6" />
                           </div>
                           <div>
                               <h4 className="text-sm font-bold text-slate-500">Reprogramación Auditiva</h4>
                               <div className="text-2xl font-black text-slate-800">{weekMetrics.totalAudioMinutes} <span className="text-sm font-bold text-slate-400">min. escuchados</span></div>
                           </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
                           <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                               <Video className="w-6 h-6" />
                           </div>
                           <div>
                               <h4 className="text-sm font-bold text-slate-500">Cápsulas Audiovisuales</h4>
                               <div className="text-2xl font-black text-slate-800">{weekMetrics.totalVideoMinutes} <span className="text-sm font-bold text-slate-400">min. visualizados</span></div>
                           </div>
                        </div>
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Activity className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Cargando Métricas de Seguimiento...</h3>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'registro' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   {weekMetrics ? (
                       <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
                           <h4 className="font-black text-slate-800 mb-6 flex items-center gap-3 text-xl">
                               <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                  <MessageCircle className="w-5 h-5" /> 
                               </div>
                               Registro Emocional Detallado
                           </h4>
                           {weekMetrics.questionnaireHtml ? (
                              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mt-6">
                                 <div className="space-y-6">
                                    {parseQuestionnaireHtml(weekMetrics.questionnaireHtml).map((item, idx) => (
                                       <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-[#0097B2]/30 transition-colors">
                                          <div className="flex justify-between items-start mb-3 gap-4">
                                            <h5 className="font-bold text-slate-700 text-sm md:text-base leading-snug flex-1">{item.question}</h5>
                                            <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1 shrink-0">
                                              <span className="font-black text-[#0097B2] text-lg">{item.score}</span>
                                              <span className="text-slate-400 font-bold text-xs mt-1">/10</span>
                                            </div>
                                          </div>
                                          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                             <div 
                                               className={`h-full rounded-full transition-all duration-1000 ${
                                                 item.score <= 3 ? 'bg-rose-500' : 
                                                 item.score <= 7 ? 'bg-amber-400' : 
                                                 'bg-[#0097B2]'
                                               }`} 
                                               style={{ width: `${(item.score / 10) * 100}%` }}
                                             ></div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                                 {parseQuestionnaireHtml(weekMetrics.questionnaireHtml).length === 0 && (
                                     <div className="quill-content text-base bg-emerald-50/30 p-8 rounded-2xl border border-emerald-100 shadow-inner" dangerouslySetInnerHTML={{ __html: (weekMetrics.questionnaireHtml || '').replace(/&nbsp;/g, ' ') }}></div>
                                 )}
                              </div>
                           ) : (
                              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-6">
                                 <p className="text-slate-400 font-medium italic">El cliente aún no ha llenado o enviado su registro de esta semana.</p>
                              </div>
                           )}
                        </div>
                   ) : (
                     <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <MessageCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Cargando Resultados...</h3>
                     </div>
                   )}
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

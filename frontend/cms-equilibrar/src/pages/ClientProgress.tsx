import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Calendar, ChevronUp, ChevronDown, CheckCircle, FileText, Headphones, Lock, Video, ArrowRight, ArrowUpRight, AlignLeft, CheckSquare, Image as ImageIcon, BookOpen, Download } from 'lucide-react';

const getModuleStyle = (type: string) => {
    const t = type?.toUpperCase() || 'UNKNOWN';
    if (t === 'VIDEO') return { icon: Video, color: 'text-rose-500', bg: 'bg-rose-50', ring: 'ring-rose-100', subtext: 'Cápsula Audiovisual', isAction: false };
    if (t === 'AUDIO') return { icon: Headphones, color: 'text-indigo-500', bg: 'bg-indigo-50', ring: 'ring-indigo-100', subtext: 'Reprogramación Auditiva', isAction: false };
    if (t === 'PDF') return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-100', subtext: 'Documento Descargable', isAction: true };
    if (t === 'TEXT' || t === 'REFLEXION') return { icon: AlignLeft, color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-100', subtext: 'Lectura de Reflexión', isAction: false };
    if (t === 'QUESTIONNAIRE' || t === 'CUESTIONARIO') return { icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-100', subtext: 'Evaluación Activa', isAction: true };
    if (t === 'IMAGE') return { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-100', subtext: 'Material Visual', isAction: false };
    if (t === 'BITACORA') return { icon: BookOpen, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50', ring: 'ring-fuchsia-100', subtext: 'Bitácora de Avance', isAction: true };
    
    // Default
    return { icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50', ring: 'ring-slate-100', subtext: 'Recurso Clínico', isAction: false };
};

export default function ClientProgress() {
   const { id } = useParams(); // Program ID
   const navigate = useNavigate();
   const { user } = useAuth();
   
   const [program, setProgram] = useState<any>(null);
   const [currentWeek, setCurrentWeek] = useState(1);
   const [openWeek, setOpenWeek] = useState(1);
   const [expandedMod, setExpandedMod] = useState<string | null>(null);
   const [nextAppointment, setNextAppointment] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!user) {
         navigate('/login');
         return;
      }
      fetchProgramData();
      // eslint-disable-next-line
   }, [user, id]);

   const fetchProgramData = async () => {
      try {
         const pRes = await axios.get(`/api/data/users/${user?.id}/programs`);
         if (pRes.data && pRes.data.programs?.length > 0) {
            // Find the program that matches the ID in URL
            const matched = pRes.data.programs.find((p: any) => p.id === id);
            if (matched) {
               setProgram(matched);
               setCurrentWeek(pRes.data.currentWeek || 1);
               setOpenWeek(pRes.data.currentWeek || 1);
               
               // Next Appointment related to user
               if (pRes.data.nextAppointments?.length > 0) {
                   setNextAppointment(pRes.data.nextAppointments[0]);
               }
            } else {
               // Fallback if ID doesn't match
               navigate('/mi-cuenta');
            }
         } else {
             navigate('/mi-cuenta');
         }
      } catch (ex) {
         console.error(ex);
         navigate('/mi-cuenta');
      } finally {
         setLoading(false);
      }
   };

   if (loading || !program) {
       return (
           <div className="min-h-screen bg-[#F4F9F9] flex items-center justify-center">
               <div className="w-12 h-12 border-4 border-[#00A89C] border-t-transparent rounded-full animate-spin"></div>
           </div>
       );
   }

   return (
      <div className="min-h-screen bg-[#F4F9F9] font-sans text-slate-800 pb-24">
         {/* Simple Header */}
         <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-20">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
               <button onClick={() => navigate('/mi-cuenta')} className="flex items-center text-slate-500 hover:text-[#00A89C] font-semibold transition-colors">
                  <ChevronLeft className="w-5 h-5 mr-1" /> Volver a Mi Cuenta
               </button>
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F4F9F9] flex items-center justify-center p-1">
                     <img alt="Logo" className="w-full h-full object-contain" src="/assets/logo-CYF-QZPl.png" onError={(e: any) => e.target.style.display='none'}/>
                  </div>
                  <span className="text-sm font-bold text-[#0097B2] tracking-wide">EQUILIBRAR</span>
               </div>
            </div>
         </header>

         {/* MAIN PROGRESS CONTENT */}
         <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <div className="w-full">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4 pt-10 border-t border-slate-200">
                 <div>
                   <h2 className="text-4xl font-black text-slate-900 mb-2 leading-none tracking-tight">Mi <span className="text-[#00A89C]">Progreso</span></h2>
                   <div className="flex items-center gap-2 text-slate-600 font-medium mt-3">
                     <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-[#00A89C]">
                       <Calendar className="w-3.5 h-3.5"/>
                     </div>
                     <span className="font-bold text-slate-700">Programa: {program.title}</span>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded-full border border-slate-200 px-6 py-4 flex items-center gap-5 shadow-sm w-full md:w-auto md:min-w-[280px]">
                   <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[#00A89C] rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((currentWeek / 4) * 100, 100)}%` }}></div>
                   </div>
                   <div className="flex flex-col items-end shrink-0">
                     <span className="text-[#00A89C] font-black text-lg leading-none">{Math.round((currentWeek / 4) * 100)}%</span>
                     <span className="text-[#00A89C] text-xs font-bold uppercase tracking-widest mt-1">Completado</span>
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                   {[1, 2, 3, 4].map(wNum => {
                       const isLocked = wNum > currentWeek;
                       const isOpen = openWeek === wNum;
                       
                       if (isLocked) {
                           return (
                               <div key={wNum} className="bg-slate-50/70 rounded-3xl border border-slate-100 p-6 flex items-center justify-between opacity-80 backdrop-blur-sm">
                                   <div className="flex items-center gap-5">
                                       <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 shadow-sm">
                                          <Lock className="w-6 h-6" />
                                       </div>
                                       <div>
                                           <h3 className="text-xl font-bold text-slate-400">Semana {wNum}</h3>
                                           <p className="text-sm text-slate-400 font-medium">Próximamente disponible en plataforma</p>
                                       </div>
                                   </div>
                                   <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-4 py-2 rounded-full tracking-widest">BLOQUEADO</span>
                               </div>
                           );
                       }
                       
                       return (
                           <div key={wNum} className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 mb-4 overflow-hidden relative transition-all duration-300">
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00A89C]"></div>
                              <div className="p-6 lg:p-8">
                                 <div className="flex justify-between items-start cursor-pointer select-none" onClick={() => setOpenWeek(isOpen ? 0 : wNum)}>
                                     <div className="pr-8">
                                         <div className="flex items-center gap-3 mb-4">
                                             <span className={`text-[10px] font-black px-3 py-1.5 rounded-md tracking-widest uppercase ${wNum === currentWeek ? 'bg-cyan-50 text-[#00A89C] border border-[#00A89C]/20' : 'bg-slate-100 text-slate-500'}`}>
                                                 {wNum === currentWeek ? 'Semana En Curso' : 'Completada y Lista'}
                                             </span>
                                         </div>
                                         <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Rutina Semanal {wNum}</h3>
                                         <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-3xl">Despliega el contenido para consumir los protocolos de reestructuración obligatorios y acceder a tus bitácoras de avance.</p>
                                         
                                         {/* Meet Link if Next Appointment exists and applies to this week */}
                                         {wNum === currentWeek && nextAppointment && (
                                             <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-3xl relative overflow-hidden group">
                                                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                                                 <div className="relative z-10">
                                                     <h4 className="font-black text-indigo-900 text-base mb-1">Videoconferencia Clínica</h4>
                                                     <p className="text-sm font-semibold text-indigo-600/80">
                                                         {new Date(nextAppointment.date).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                     </p>
                                                 </div>
                                                 <a href={nextAppointment.meetLink || "https://meet.google.com/rgv-deae-fmf"} target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all hover:scale-105 shadow-[0_8px_20px_rgba(79,70,229,0.25)] flex items-center gap-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                     Conectar a Google Meet <ArrowUpRight className="w-4 h-4 ml-1" />
                                                 </a>
                                             </div>
                                         )}
                                     </div>
                                     <button className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-shrink-0">
                                         {isOpen ? <ChevronUp className="w-6 h-6"/> : <ChevronDown className="w-6 h-6"/>}
                                     </button>
                                 </div>
                                 
                                 {isOpen && (
                                     <div className="space-y-4 animate-fade-in mt-8 pt-8 border-t border-slate-100">
                                         {program.modules?.filter((m: any) => m.weekNumber === wNum).length > 0 ? (
                                             program.modules.filter((m: any) => m.weekNumber === wNum).map((mod: any) => {
                                                 const conf = getModuleStyle(mod.type);
                                                 const IconComponent = conf.icon;
                                                 const isExpanded = expandedMod === mod.id;
                                                 
                                                 return (
                                                     <div key={mod.id} className={`bg-white rounded-2xl border ${isExpanded ? 'border-[#00A89C] shadow-md' : 'border-slate-200 shadow-sm'} overflow-hidden group relative transition-all duration-300`}>
                                                         {conf.isAction && <div className={`absolute top-0 left-0 w-1.5 h-full bg-current ${conf.color.replace('text-', 'bg-')}`}></div>}
                                                         
                                                         <div onClick={() => setExpandedMod(isExpanded ? null : mod.id)} className={`p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors ${conf.isAction ? 'pl-6' : ''}`}>
                                                             <div className="flex items-center gap-5">
                                                                 <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ring-1 ${conf.bg} ${conf.color} ${conf.ring}`}>
                                                                     <IconComponent className="w-6 h-6" />
                                                                 </div>
                                                                 <div>
                                                                     <h4 className={`font-bold text-slate-800 text-lg transition-colors group-hover:${conf.color}`}>{mod.title}</h4>
                                                                     
                                                                     {conf.isAction ? (
                                                                         <span className={`text-[10px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-md inline-block ${conf.color} ${conf.bg}`}>
                                                                             {conf.subtext}
                                                                         </span>
                                                                     ) : (
                                                                         <span className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest flex items-center gap-1">
                                                                             {mod.duration ? `${Math.round(mod.duration)} min • ` : ''}{conf.subtext}
                                                                         </span>
                                                                     )}
                                                                 </div>
                                                             </div>
                                                             {isExpanded ? (
                                                                 <ChevronUp className="w-5 h-5 text-slate-400" />
                                                             ) : (
                                                                 <ChevronDown className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                                             )}
                                                         </div>
                                                         
                                                         {/* EXPANDED CONTENT AREA */}
                                                         {isExpanded && (
                                                             <div className="bg-slate-50 border-t border-slate-100 p-6 animate-fade-in space-y-6">
                                                                 {/* Descripción / Instrucciones */}
                                                                 {mod.description && (
                                                                     <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                                                         <h5 className="text-[10px] font-black uppercase tracking-widest text-[#00A89C] mb-2 flex items-center"><FileText className="w-3.5 h-3.5 mr-1" /> Instrucciones Clínicas</h5>
                                                                         <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{mod.description}</p>
                                                                     </div>
                                                                 )}
                                                                 
                                                                 {/* Embeds Reales */}
                                                                 {mod.type === 'VIDEO' && mod.contentUrl && (
                                                                     <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-black">
                                                                         <iframe 
                                                                            src={mod.contentUrl.includes('watch?v=') ? mod.contentUrl.replace('watch?v=', 'embed/').split('&')[0] : mod.contentUrl} 
                                                                            className="w-full h-full" 
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                                            allowFullScreen 
                                                                            title={mod.title}
                                                                         ></iframe>
                                                                     </div>
                                                                 )}
                                                                 
                                                                 {mod.type === 'AUDIO' && mod.contentUrl && (
                                                                     <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                                                                         <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
                                                                             <Headphones className="w-6 h-6" />
                                                                         </div>
                                                                         <audio controls className="w-full h-12 outline-none">
                                                                            <source src={mod.contentUrl} />
                                                                            Tu navegador no soporta el elemento de audio.
                                                                         </audio>
                                                                     </div>
                                                                 )}
                                                                 
                                                                 {mod.type === 'PDF' && mod.contentUrl && (
                                                                     <div className="flex justify-center">
                                                                         <a href={mod.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-all hover:scale-105 shadow-[0_8px_20px_rgba(37,99,235,0.25)]">
                                                                            <Download className="w-5 h-5 mr-2" /> Descargar Guía Práctica en PDF
                                                                         </a>
                                                                     </div>
                                                                 )}
                                                                 
                                                                 {(mod.type === 'BITACORA' || mod.type === 'QUESTIONNAIRE') && (
                                                                     <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center space-y-4">
                                                                         <div className={`w-16 h-16 rounded-full flex items-center justify-center ${conf.bg} ${conf.color}`}>
                                                                             <IconComponent className="w-8 h-8" />
                                                                         </div>
                                                                         <div>
                                                                             <h4 className="font-black text-slate-800 text-lg">Sección Interactiva Activa</h4>
                                                                             <p className="text-sm text-slate-500 font-medium mt-1 max-w-sm mx-auto">La integración de respuestas de esta {mod.type === 'BITACORA' ? 'bitácora' : 'evaluación'} se guardará directamente en tu progreso clínico para ser revisado por tu especialista.</p>
                                                                         </div>
                                                                         <button className={`px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black rounded-xl transition-transform active:scale-95 shadow-lg flex items-center`}>
                                                                             Comenzar Ejercicio <ArrowRight className="w-4 h-4 ml-2" />
                                                                         </button>
                                                                     </div>
                                                                 )}
                                                             </div>
                                                         )}
                                                     </div>
                                                 );
                                             })
                                         ) : (
                                             <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                                                 <p className="text-slate-400 font-medium">Contenidos en preparación por el equipo clínico.</p>
                                             </div>
                                         )}
                                     </div>
                                 )}
                              </div>
                           </div>
                       );
                   })}
               </div>
            </div>
         </main>
      </div>
   );
}

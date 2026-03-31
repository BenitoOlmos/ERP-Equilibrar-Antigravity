import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Calendar, ChevronUp, ChevronDown, CheckCircle, FileText, Headphones, Lock, Video, ArrowRight, ArrowUpRight, AlignLeft, CheckSquare, Image as ImageIcon, BookOpen, Download, PenLine, MessageCircle, Send, CircleCheck, Play, Pause, Repeat } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

const CustomAudioPlayer = ({ src, title }: { src: string, title?: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }
    
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const setAudioEnd = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    // Many browsers fire loadedmetadata before loadeddata for audio duration
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', setAudioEnd);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', setAudioEnd);
    }
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return '00:00';
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#F4F9F9] rounded-2xl p-5 border border-cyan-100 shadow-sm transition-all hover:shadow-md w-full">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" loop={isLooping}></audio>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors bg-cyan-100 text-[#0097B2]">
            <Headphones className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h4 className="font-bold text-slate-800 text-base">{title || "Audio Guía Semanal"}</h4>
            <p className="text-xs font-medium text-slate-500">RFAI Equilibrar</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <button onClick={(e) => { e.stopPropagation(); toggleLoop(); }} className={`p-2 rounded-full transition-colors hover:bg-slate-200 ${isLooping ? 'text-[#0097B2] bg-cyan-50' : 'text-slate-400'}`} title={isLooping ? "Repetir activado" : "Repetir desactivado"}>
                <Repeat className="w-5 h-5" />
             </button>
             <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-12 h-12 rounded-full bg-[#0097B2] text-white flex items-center justify-center shadow-md hover:bg-cyan-600 transition-colors hover:scale-105 active:scale-95">
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
             </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#0097B2] w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <div className="relative flex-grow h-3">
             <input min="0" max={duration || 100} step="0.1" value={currentTime} onChange={handleProgressChange} onMouseDown={(e) => e.stopPropagation()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="range" />
             <div className="absolute inset-0 top-1/2 -mt-1 h-2 bg-slate-200 rounded-full overflow-hidden pointer-events-none">
                <div className="h-full bg-[#0097B2] transition-all ease-out" style={{ width: `${progressPercentage}%` }}></div>
             </div>
          </div>
          <span className="text-xs font-medium text-slate-400 w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
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

   const [bitacoraLogs, setBitacoraLogs] = useState<any[]>([]);
   const [newLogText, setNewLogText] = useState("");
   const [isSavingLog, setIsSavingLog] = useState(false);
   const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, number>>({});

   useEffect(() => {
      if (!user) {
         navigate('/login');
         return;
      }
      fetchProgramData();
      // eslint-disable-next-line
   }, [user, id]);

   const loadBitacoraLogs = async (weekNum: number) => {
      if (!user?.id) return;
      try {
         const res = await axios.get(`/api/data/users/${user.id}/bitacora/${weekNum}`);
         setBitacoraLogs(res.data);
      } catch (e) {
         console.error("Error loading logs", e);
      }
   };

   useEffect(() => {
      if (user?.id && openWeek) {
         loadBitacoraLogs(openWeek);
      }
   }, [user, openWeek]);

   const handleSendBitacora = async (customContent?: string) => {
      const contentToSave = typeof customContent === 'string' ? customContent : newLogText;
      if (!contentToSave.trim() || contentToSave === '<p><br></p>' || !user?.id) return;
      setIsSavingLog(true);
      try {
          await axios.post(`/api/data/users/${user.id}/bitacora/${openWeek}`, { content: contentToSave });
          if (!customContent) setNewLogText("");
          loadBitacoraLogs(openWeek);
      } catch (e) {
          console.error("Failed to save log", e);
      } finally {
          setIsSavingLog(false);
      }
   };

   const handleSendQuestionnaire = async (mod: any) => {
      if (!user?.id) return;
      
      let htmlContent = `<h3><strong>Cuestionario de Autoevaluación</strong></h3><ul>`;
      (mod.questions || []).forEach((q: any, i: number) => {
          const val = questionnaireAnswers[`${mod.id}-${i}`] ?? 5;
          htmlContent += `<li><strong>${q.text}:</strong> <span style="color: #0097B2">${val}/10</span></li>`;
      });
      htmlContent += `</ul>`;
      
      await handleSendBitacora(htmlContent);
   };

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
                   <ChevronLeft className="w-5 h-5 mr-1" /> <span className="hidden sm:inline">Volver a Mi Cuenta</span><span className="sm:hidden">Volver</span>
                </button>
                <div className="relative">
                   <div className="flex items-center space-x-3 focus:outline-none transition-opacity">
                      <div className="hidden sm:flex flex-col text-right">
                         <span className="text-sm font-bold text-slate-700">{user?.name || 'Invitado'}</span>
                         <span className="text-[10px] font-black uppercase text-[#00A89C]">{(user?.role === 'patient' || user?.role === 'CLIENT') ? 'Paciente' : 'Usuario'}</span>
                      </div>
                      <img alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm bg-white object-cover" src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'Usuario'}&backgroundColor=bbf7d0`} />
                   </div>
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
                                                         
                                                         <div onClick={() => setExpandedMod(isExpanded ? null : mod.id)} className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${(mod.type === 'BITACORA' || mod.type === 'JOURNAL') ? 'bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-900/20' : mod.type === 'QUESTIONNAIRE' ? 'bg-purple-50/50 hover:bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-slate-50'} ${conf.isAction && mod.type !== 'BITACORA' && mod.type !== 'JOURNAL' && mod.type !== 'QUESTIONNAIRE' ? 'pl-6' : ''}`}>
                                                             {(mod.type === 'BITACORA' || mod.type === 'JOURNAL') ? (
                                                                <div className="flex items-center gap-4">
                                                                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-emerald-100 text-emerald-600">
                                                                    <FileText className="w-6 h-6" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="font-bold text-slate-800 text-lg">Bitácora Personal del Proceso</h4>
                                                                    <span className="text-xs font-medium flex items-center gap-1 mt-1 text-emerald-600">
                                                                      <CircleCheck className="w-3.5 h-3.5" /> Bitácora Activa
                                                                    </span>
                                                                  </div>
                                                                </div>
                                                             ) : mod.type === 'QUESTIONNAIRE' ? (
                                                                <div className="flex items-center gap-4">
                                                                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-purple-100 text-purple-600">
                                                                    <PenLine className="w-6 h-6" />
                                                                  </div>
                                                                  <div>
                                                                    <h4 className="font-bold text-slate-800 text-lg">Registro Emocional</h4>
                                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">Cuestionario Semanal</span>
                                                                  </div>
                                                                </div>
                                                             ) : (
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
                                                             )}
                                                             
                                                             {isExpanded ? (
                                                                 <ChevronUp className="w-5 h-5 text-slate-400" />
                                                             ) : (
                                                                 <ChevronDown className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                                             )}
                                                         </div>
                                                         
                                                         {/* EXPANDED CONTENT AREA */}
                                                         {isExpanded && (
                                                             <div className="bg-slate-50 border-t border-slate-100 p-6 animate-fade-in space-y-6">
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
                                                                     <CustomAudioPlayer 
                                                                         src={mod.contentUrl.startsWith('http') ? mod.contentUrl : `/audios/${mod.contentUrl}`} 
                                                                         title={mod.title} 
                                                                     />
                                                                 )}
                                                                 
                                                                 {mod.type === 'PDF' && mod.contentUrl && (
                                                                     <div className="flex justify-center">
                                                                         <a href={mod.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-all hover:scale-105 shadow-[0_8px_20px_rgba(37,99,235,0.25)]">
                                                                            <Download className="w-5 h-5 mr-2" /> Descargar Guía Práctica en PDF
                                                                         </a>
                                                                     </div>
                                                                 )}
                                                                 
                                                                 {(mod.type === 'BITACORA' || mod.type === 'JOURNAL') && (
                                                                     <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative dark:bg-slate-800 dark:border-slate-700">
                                                                       <div className="bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-900/10 dark:to-slate-800">
                                                                         <div className="p-6 md:p-8">
                                                                           <div className="mb-0 border-b border-slate-100 pb-6 dark:border-slate-700">
                                                                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                                               <MessageCircle className="w-5 h-5 text-[#0097B2]" /> Transcribe tus Registros Personales
                                                                             </h4>
                                                                             
                                                                             {/* Real History */}
                                                                             <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto px-2 custom-scrollbar">
                                                                               {bitacoraLogs.length === 0 ? (
                                                                                  <div className="text-center py-4 text-xs font-bold text-slate-400">Sin registros en esta semana. Escribe tu primera reflexión.</div>
                                                                               ) : (
                                                                                 bitacoraLogs.map((log: any, idx: number) => (
                                                                                    <div key={idx} className="flex flex-col gap-3">
                                                                                      {/* Mensaje del Paciente */}
                                                                                      <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-100 dark:border-slate-700 ml-4 md:ml-8 relative">
                                                                                        <div className="absolute top-4 -left-4 w-3 h-3 bg-slate-200 rounded-full dark:bg-slate-600"></div>
                                                                                        <div className="text-sm text-slate-700 dark:text-slate-300 quill-content" dangerouslySetInnerHTML={{ __html: log.content }}></div>
                                                                                        <div className="text-[10px] text-slate-400 mt-2 text-right">
                                                                                          Tú • {new Date(log.timestamp).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                                        </div>
                                                                                      </div>
                                                                                      
                                                                                      {/* Respuesta del Especialista */}
                                                                                      {log.response && (
                                                                                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 mr-4 md:mr-8 relative">
                                                                                          <div className="absolute top-4 -right-4 w-3 h-3 bg-indigo-200 rounded-full dark:bg-indigo-700"></div>
                                                                                          <div className="text-sm text-indigo-900 dark:text-indigo-200 quill-content pl-8 opacity-90" dangerouslySetInnerHTML={{ __html: log.response }}></div>
                                                                                          <div className="text-[10px] text-indigo-400 mt-2 flex items-center gap-1">
                                                                                            <span className="font-bold">{log.specialist?.name || 'Especialista Clínico'}</span> • {new Date(log.respondedAt).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                                                    </div>
                                                                                 ))
                                                                               )}
                                                                             </div>
                                                                             
                                                                             <div className="flex flex-col gap-3">
                                                                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#0097B2] focus-within:ring-2 focus-within:ring-[#0097B2]/20 transition-all">
                                                                                  <ReactQuill 
                                                                                     theme="snow"
                                                                                     placeholder="Escribe tu reflexión o registro personal aquí..." 
                                                                                     value={newLogText}
                                                                                     onChange={setNewLogText}
                                                                                     readOnly={isSavingLog}
                                                                                     modules={{
                                                                                        toolbar: [
                                                                                          ['bold', 'italic'],
                                                                                          [{ list: 'bullet' }],
                                                                                          [{ color: [] }]
                                                                                        ]
                                                                                     }}
                                                                                  />
                                                                                </div>
                                                                                <div className="flex justify-end">
                                                                                  <button 
                                                                                     disabled={!newLogText.trim() || newLogText === '<p><br></p>' || isSavingLog}
                                                                                     onClick={() => handleSendBitacora()} 
                                                                                     className={`px-6 py-2 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${!newLogText.trim() || newLogText === '<p><br></p>' || isSavingLog ? 'bg-slate-200 text-slate-400' : 'bg-[#0097B2] hover:bg-cyan-600 text-white cursor-pointer'}`}
                                                                                  >
                                                                                    <Send className="w-4 h-4 mr-2" /> Enviar Registro
                                                                                  </button>
                                                                                </div>
                                                                              </div>
                                                                           </div>
                                                                         </div>
                                                                       </div>
                                                                     </div>
                                                                 )}

                                                                 {mod.type === 'QUESTIONNAIRE' && (
                                                                     <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative dark:bg-slate-800 dark:border-slate-700">
                                                                       <div className="bg-gradient-to-br from-purple-50/30 to-white">
                                                                         <div className="p-6 md:p-8">
                                                                           <div className="text-center mb-8">
                                                                             <span className="bg-cyan-50 text-[#0097B2] text-xs font-bold px-3 py-1 rounded-full tracking-wide inline-block mb-4">SEMANA {wNum}</span>
                                                                             <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Autoevaluación</h3>
                                                                             <p className="text-slate-500 dark:text-slate-400 text-sm">Evalúa tu estado actual del 0 al 10.</p>
                                                                           </div>
                                                                           <div className="space-y-8 max-w-2xl mx-auto">
                                                                             
                                                                             {(mod.questions && mod.questions.length > 0) ? mod.questions.map((q: any, i: number) => (
                                                                               <div key={i} className="space-y-4">
                                                                                 <div className="flex justify-between items-start gap-4">
                                                                                   <label className="text-sm font-medium text-slate-700 leading-snug">{i + 1}. {q.text}</label>
                                                                                   <span className="text-xl font-bold text-[#0097B2] w-8 text-right flex-shrink-0">{questionnaireAnswers[`${mod.id}-${i}`] ?? 5}</span>
                                                                                 </div>
                                                                                 <div className="relative pt-2 pb-2">
                                                                                   <input 
                                                                                      min="0" max="10" step="1" 
                                                                                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0097B2]" 
                                                                                      type="range" 
                                                                                      value={questionnaireAnswers[`${mod.id}-${i}`] ?? 5}
                                                                                      onChange={(e) => setQuestionnaireAnswers({...questionnaireAnswers, [`${mod.id}-${i}`]: parseInt(e.target.value)})}
                                                                                   />
                                                                                   <div className="flex justify-between text-xs text-slate-400 mt-3 font-medium px-1">
                                                                                     <span>Bajo (0)</span>
                                                                                     <span>Alto (10)</span>
                                                                                   </div>
                                                                                 </div>
                                                                               </div>
                                                                             )) : (
                                                                               <div className="text-center text-slate-400 text-sm font-medium py-4">
                                                                                  No hay preguntas configuradas para este módulo.
                                                                               </div>
                                                                             )}
                                                                             
                                                                             {mod.questions && mod.questions.length > 0 && (
                                                                               <div className="pt-8 flex justify-center">
                                                                                 <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm w-full md:w-auto bg-[#0097B2] text-white hover:bg-cyan-600 shadow-cyan-200">
                                                                                   <Send className="w-5 h-5" /> Enviar Registro Semanal
                                                                                 </button>
                                                                               </div>
                                                                             )}
                                                                           </div>
                                                                         </div>
                                                                       </div>
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
          
          {/* Chat Widget Flotante */}
          <ChatWidget />
       </div>
    );
}

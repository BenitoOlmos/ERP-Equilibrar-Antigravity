import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, ShieldCheck, ArrowRight, ArrowUpRight, Activity, BookOpen, Headphones, User, Settings, LogOut, X, CheckCircle, Calendar, ChevronRight, FileText, PenLine, Video, Lock } from 'lucide-react';

const getRFAIVideo = (profileStr: string): string | null => {
    if (!profileStr) return null;
    const s = profileStr.toLowerCase();
    if (s.includes("desregulado") || s.includes("desbordado")) return "https://www.youtube.com/embed/SU_K-Qt4tf8";
    if (s.includes("reactivo") && s.includes("hiper")) return "https://www.youtube.com/embed/Ke5JnAlBe7Y";
    if (s.includes("reactivo")) return "https://www.youtube.com/embed/Ke5JnAlBe7Y"; // Fallback Reactivo
    if (s.includes("regulado") && s.includes("hiper")) return "https://www.youtube.com/embed/X7v43d7U4io";
    if (s.includes("regulado")) return "https://www.youtube.com/embed/X7v43d7U4io"; // Fallback Regulado
    if (s.includes("inhibido")) return "https://www.youtube.com/embed/liHSg0FOT9g";
    if (s.includes("adaptado") || s.includes("sobre adaptado") || s.includes("sobreadaptado")) return "https://www.youtube.com/embed/8rIIp-15huw";
    return "https://www.youtube.com/embed/Ke5JnAlBe7Y"; // Default
};

const defaultAvatars = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=e2e8f0', // Man
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=bbf7d0', // Woman
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=fecaca', // Man
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily&backgroundColor=bfdbfe', // Woman 
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver&backgroundColor=e9d5ff', // Boy
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia&backgroundColor=fde047' // Girl
];

export default function ClientDashboard() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [userTest, setUserTest] = useState<any>(null);
   const [catalog, setCatalog] = useState<any[]>([]);

   // Topbar states
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   
   // Form states
   const [currentAvatar, setCurrentAvatar] = useState(defaultAvatars[0]);
   const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
   const [saving, setSaving] = useState(false);
   
   // Program records
   const [activePrograms, setActivePrograms] = useState<any[]>([]);
   const [currentWeek, setCurrentWeek] = useState(1);
   const [openWeek, setOpenWeek] = useState(1);
   const [nextAppointment, setNextAppointment] = useState<any>(null);

   useEffect(() => {
      // Initialize avatar
      if (user?.id) {
         const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
         if (savedAvatar) setCurrentAvatar(savedAvatar);
      }

      // Initialize form from real user profile if available, otherwise fallback to `user.name` which is stored in context.
      const fetchRealProfile = async () => {
         try {
            if (user?.id) {
               // Load Diagnostics
               const diagRes = await axios.get(`/api/crm/diagnostics/user/${user.id}`);
               if (diagRes.data && diagRes.data.length > 0) {
                  setUserTest(diagRes.data[0]);
               }

               // Load Real Full Name and Email from API to sync editing Modal correctly
               const profileRes = await axios.get(`/api/data/users/${user.id}`);
               const uName = profileRes.data.profile?.firstName || user.name?.split(' ')[0] || '';
               const uLastName = profileRes.data.profile?.lastName || user.name?.split(' ').slice(1).join(' ') || '';
               setFormData({
                  firstName: uName,
                  lastName: uLastName,
                  email: profileRes.data.email || user.email || '',
                  phone: profileRes.data.phone || '',
                  password: ''
               });
               
               // Load Active Programs via Sales
               try {
                   const pRes = await axios.get(`/api/data/users/${user.id}/programs`);
                   if (pRes.data && pRes.data.programs?.length > 0) {
                       setActivePrograms(pRes.data.programs);
                       setCurrentWeek(pRes.data.currentWeek);
                       setOpenWeek(pRes.data.currentWeek);
                       if (pRes.data.nextAppointments?.length > 0) {
                           setNextAppointment(pRes.data.nextAppointments[0]);
                       }
                   }
               } catch (ex) {
                   console.error('Programs fetching failed quietly', ex);
               }
            }
               
            const srvRes = await axios.get('/api/data/services');
            if (srvRes.data) setCatalog(srvRes.data.filter((s:any) => s.isActive).slice(0, 3));
         } catch (e) {
            console.error('Error fetching dashboard data:', e);
         } finally {
            setLoading(false);
         }
      };
      
      fetchRealProfile();
   }, [user]);

   const handleLogout = () => {
      logout();
      window.location.href = '/login';
   };

   const selectAvatar = (url: string) => {
      setCurrentAvatar(url);
      if (user?.id) localStorage.setItem(`avatar_${user.id}`, url);
   };

   const handleSaveSettings = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
         await axios.put(`/api/data/users/${user?.id}`, {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            password: formData.password
         });
         alert('Tus datos han sido actualizados en la base de datos permanentemente. Reiniciaremos tu sesión para aplicar.');
         window.location.reload();
      } catch (e: any) {
         alert('Error guardando ajustes: ' + (e.response?.data?.error || e.message));
      } finally {
         setSaving(false);
      }
   };

   const wpNumber = "56930179724";

   if (loading) return <div className="flex h-full min-h-[400px] items-center justify-center"><div className="w-12 h-12 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>;

   return (
      <div className="w-full relative bg-slate-50 min-h-screen pb-24">
         {/* CLIENT NAVIGATION BAR */}
         <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-40 h-20 px-6 lg:px-12 flex items-center justify-between shadow-sm animate-slide-up">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00A89C] rounded-xl shadow-lg shadow-[#00A89C]/30 flex items-center justify-center text-white font-black text-xl">
                   E
                </div>
                <div className="hidden sm:block">
                   <h1 className="text-lg font-black tracking-tight text-slate-800 leading-none">ERP <span className="text-[#00A89C]">Equilibrar</span></h1>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Terapéutico</p>
                </div>
             </div>
             
             <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3 focus:outline-none hover:opacity-80 transition-opacity">
                   <div className="hidden sm:flex flex-col text-right">
                      <span className="text-sm font-bold text-slate-700">{formData.firstName}</span>
                      <span className="text-[10px] font-black uppercase text-[#00A89C]">Paciente</span>
                   </div>
                   <img src={currentAvatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-slate-100 shadow-md bg-white object-cover" />
                </button>

                {/* DROPDOWN AVATAR MENU */}
                {isMenuOpen && (
                   <div className="absolute top-[120%] right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-fade-in z-50">
                      <div className="px-5 py-3 border-b border-slate-50 flex items-center space-x-3 bg-slate-50/50">
                         <img src={currentAvatar} className="w-10 h-10 rounded-full bg-slate-200" alt="Avatar"/>
                         <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate">{formData.firstName} {formData.lastName?.charAt(0)}.</span>
                            <span className="text-[10px] text-slate-400 truncate">{formData.email}</span>
                         </div>
                      </div>
                      <div className="p-2 space-y-1">
                         <button onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#00A89C] rounded-xl transition-colors">
                            <Settings className="w-4 h-4 mr-3" /> Configuración de Perfil
                         </button>
                         <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut className="w-4 h-4 mr-3" /> Cerrar Sesión Segura
                         </button>
                      </div>
                   </div>
                )}
             </div>
         </nav>

         {/* MAIN CONTENT OF DASHBOARD */}
         <div className="max-w-5xl mx-auto pt-28 px-4 lg:px-8 space-y-12 animate-fade-in">
            {/* WELCOME HERO */}
            <header className="text-center max-w-2xl mx-auto mt-6">
               <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Espacio Privado y Seguro</span>
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                  Bienvenido, <span className="text-[#00A89C]">{formData.firstName}</span>.
               </h1>
               <p className="text-slate-500 mt-4 font-medium text-lg leading-relaxed">
                  Este es tu refugio de transformación. Todo lo que necesitas para regular tu sistema nervioso y avanzar en tu tratamiento está aquí.
               </p>
            </header>

            {/* STATE 1: NO TEST RFAI */}
            {activePrograms.length === 0 && !userTest && (
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden border border-slate-700 group hover:shadow-black/20 transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A89C] opacity-20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500 transition-colors duration-1000"></div>
                  <div className="relative z-10 max-w-xl">
                     <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl mb-6 shadow-inner ring-1 ring-red-500/30">
                        <Activity className="w-8 h-8 animate-pulse" />
                     </div>
                     <h2 className="text-3xl font-black text-white leading-tight mb-4">
                        Estás volando a ciegas. <br/>Descubre la causa raíz de tu estrés.
                     </h2>
                     <p className="text-slate-300 text-lg mb-8">
                        Para poder recomendarte los tratamientos o servicios correctos, necesitamos leer tu sistema nervioso. El Test RFAI revelará por qué sientes lo que sientes en <strong>menos de 3 minutos</strong>.
                     </p>
                     <a href="https://clinicaequilibrar.cl/#/test-rfai" target="_blank" rel="noreferrer" className="inline-flex items-center px-8 py-4 bg-[#00A89C] hover:bg-emerald-500 text-white rounded-xl font-black text-lg transition-transform hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,168,156,0.3)]">
                        Realizar Mi Test de Conducta <ArrowRight className="ml-2 w-6 h-6 animate-bounce-x" />
                     </a>
                  </div>
               </div>
            )}

            {/* STATE 2: HAS TEST RFAI BUT NOT PURCHASED YET */}
            {activePrograms.length === 0 && userTest && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="bg-white rounded-[2rem] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative group">
                     <div className="aspect-video bg-slate-900 rounded-[1.5rem] w-full overflow-hidden relative z-10">
                        {userTest.profile && getRFAIVideo(userTest.profile) ? (
                           <iframe 
                              className="w-full h-full absolute inset-0"
                              src={getRFAIVideo(userTest.profile) as string} 
                              title="Explicación Perfil RFAI" 
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                           ></iframe>
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800">
                              <PlayCircle className="w-16 h-16 opacity-30 mb-2" />
                              <p className="font-bold text-sm">Video Analítico en Preparación</p>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex flex-col justify-center lg:px-6">
                     <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-md font-black text-[10px] tracking-widest uppercase mb-4 border border-amber-200 w-max shadow-sm">
                        Tu Perfil Neurológico Calculado
                     </div>
                     <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-4 leading-none">
                        {userTest.profile}
                     </h2>
                     <p className="text-slate-500 text-lg mb-6">
                        Con base a tu test en la base de datos de Equilibrar, confirmamos que tu sistema nervioso ha entrado en un bucle perjudicial. En el video de la izquierda entenderás cómo frenar esto orgánicamente.
                     </p>
                     
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 relative overflow-hidden group hover:bg-slate-100 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00A89C] to-emerald-400"></div>
                        <p className="font-bold text-slate-700 italic relative z-10">
                           "Adquiere el programa de sanación específico y re-entrena biológicamente la corteza prefrontal de tu cerebro."
                        </p>
                     </div>

                     <a href={`https://wa.me/${wpNumber}?text=Hola,%20soy%20${encodeURIComponent(formData.firstName)},%20acabo%20de%20ingresar%20a%20mi%20cuenta,%20revisé%20mi%20resultado%20del%20test%20(${encodeURIComponent(userTest.profile)})%20y%20quiero%20comprar%20el%20programa%20recomendado.`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-[#00A89C] to-[#009287] text-white rounded-xl font-black text-lg shadow-[0_8px_20px_rgba(0,168,156,0.3)] hover:scale-[1.02] transition-transform">
                        Comprar Tratamiento Ideal <ArrowUpRight className="w-5 h-5 ml-2" />
                     </a>
                  </div>
               </div>
            )}

            {/* STATE 3: PROGRAM PURCHASED (MI PROGRESO) - LOBBY MENU */}
            {activePrograms.length > 0 && (
                <div className="w-full mt-10">
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mis Servicios <span className="text-[#00A89C]">Activos</span></h2>
                      <p className="text-slate-500 font-medium text-lg mt-1">Cursos y Programas de tratamiento Clínico que has adquirido.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activePrograms.map(prog => (
                          <div 
                              key={prog.id} 
                              onClick={() => navigate(`/mi-cuenta/programa/${prog.id}`)}
                              className="bg-white border hover:border-[#00A89C]/50 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,168,156,0.1)] transition-all duration-300 group cursor-pointer flex flex-col relative overflow-hidden"
                          >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00A89C]/5 rounded-bl-full group-hover:scale-150 transition-transform"></div>
                              <div className="w-14 h-14 rounded-2xl bg-[#00A89C]/10 text-[#00A89C] flex items-center justify-center mb-6 ring-1 ring-[#00A89C]/20 group-hover:bg-[#00A89C] group-hover:text-white transition-colors">
                                  <Activity className="w-7 h-7" />
                              </div>
                              <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-[#00A89C] transition-colors pr-4">{prog.title}</h3>
                              <p className="text-slate-500 font-medium mb-8 leading-relaxed flex-1">Programa clínico con bitácoras de avance y ejercicios de reestructuración neurológica.</p>
                              
                              <div className="flex items-center justify-between mt-auto">
                                  <div className="flex items-center text-xs font-bold uppercase tracking-widest text-[#00A89C] bg-[#00A89C]/10 px-3 py-1.5 rounded-lg">
                                      {currentWeek}ª Semana
                                  </div>
                                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#00A89C] group-hover:text-white transition-all shadow-sm">
                                      <ChevronRight className="w-5 h-5 ml-0.5" />
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                </div>
            )}
            
            {(activePrograms.length > 0) && (
                <hr className="border-slate-100 my-16" />
            )}

            {/* DIRECT SPOTIFY PODCAST EMBED SECTION */}
            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
               <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-5/12 bg-slate-900 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden group">
                     <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#1DB954]/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                     <Headphones className="w-12 h-12 text-[#1DB954] mb-6 relative z-10" />
                     <h3 className="text-3xl font-black text-white mb-4 relative z-10">Podcast <br />Arquitectura Evolutiva</h3>
                     <p className="text-slate-300 text-sm mb-8 relative z-10 leading-relaxed">
                        Acompaña a Claudio Reyes Vera en nuestra estación oficial. Escucha el Capítulo 12 y entiende por qué la comprensión intelectual no es suficiente para tu recuperación neuro-conductual.
                     </p>
                  </div>
                  <div className="md:w-7/12 bg-slate-50 p-6 flex flex-col items-center justify-center border-l border-slate-200 relative">
                     <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#1DB954]/5 to-transparent pointer-events-none rounded-r-[2rem]"></div>
                     
                     {/* IFRAME SPOTIFY REAL */}
                     <div className="w-full h-full max-h-[352px] rounded-[14px] overflow-hidden shadow-2xl bg-black relative z-10">
                         <iframe 
                            src="https://open.spotify.com/embed/episode/0k4MQJK6z1YsGpZXyJAA3C?utm_source=generator&theme=0" 
                            width="100%" 
                            height="352" 
                            frameBorder="0" 
                            allowFullScreen 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            title="Spotify Podcast Equilibrar"
                         ></iframe>
                     </div>
                  </div>
               </div>
            </div>

            {/* CATALOG UPSELL / FAST ACTIONS */}
            <div>
               <div className="flex items-end justify-between mb-8 mt-12">
                  <div>
                     <h3 className="text-2xl font-black text-slate-800">Servicios Sugeridos para tu Perfil</h3>
                     <p className="text-slate-500 mt-1">Cursos Teóricos y Tratamientos diseñados para complementar tu avance.</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {catalog.map(service => (
                     <div key={service.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-[#00a89c]/40 transition-all duration-300 group flex flex-col cursor-pointer relative overflow-hidden">
                        
                        {userTest && (
                           <div className="absolute top-0 right-0 bg-[#00A89C]/10 text-[#00A89C] px-3 py-1 font-black text-[9px] uppercase tracking-widest rounded-bl-xl border-b border-l border-[#00A89C]/20">
                              Ideal para {userTest.profile}
                           </div>
                        )}

                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#00A89C] group-hover:bg-[#00A89C]/10 transition-colors mb-4 ring-1 ring-slate-100 group-hover:ring-[#00A89C]/20 mt-1">
                           <BookOpen className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-slate-800 text-lg leading-tight mb-2 group-hover:text-[#00A89C] transition-colors pr-8">{service.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 flex-1 leading-relaxed">{service.description || 'Consulta clínica especializada con profesionales del modelo Equilibrar.'}</p>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                           <span className="font-black text-slate-800">${parseInt(service.price).toLocaleString('es-CL')}</span>
                           <a href={`https://wa.me/${wpNumber}?text=Hola,%20me%20interesa%20adquirir el curso/tratamiento:%20${encodeURIComponent(service.name)},%20soy%20${encodeURIComponent(formData.firstName)}.`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white flex items-center bg-slate-100 px-3 py-1.5 rounded-lg group-hover:bg-[#00A89C] transition-all">
                              Saber Más <ArrowRight className="w-3 h-3 ml-1" />
                           </a>
                        </div>
                     </div>
                  ))}
                  {!catalog.length && [1,2,3].map(i => (
                     <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse flex flex-col">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4"></div>
                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-50 rounded w-full mb-1"></div>
                        <div className="h-3 bg-slate-50 rounded w-2/3"></div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* PROFILE SETTINGS MODAL */}
         {isSettingsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
               <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
                  <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                     <h3 className="text-xl font-black text-slate-800 flex items-center">
                        <User className="w-5 h-5 mr-2 text-[#00A89C]" /> Ajustes de Cuenta B2C
                     </h3>
                     <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <form onSubmit={handleSaveSettings} className="p-8 space-y-8">
                     {/* Seccion Avatares */}
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recomendaciones Temporales de Avatar (Hombres y Mujeres)</label>
                        <div className="flex items-center space-x-4 overflow-x-auto hide-scrollbar py-2">
                           {defaultAvatars.map((url, i) => (
                              <button type="button" key={i} onClick={() => selectAvatar(url)} className={`relative flex-shrink-0 w-16 h-16 rounded-full border-4 transition-all duration-300 ${currentAvatar === url ? 'border-[#00A89C] scale-110 shadow-lg shadow-[#00A89C]/30' : 'border-slate-100 opacity-60 hover:opacity-100 bg-white'}`}>
                                 <img src={url} className="w-full h-full rounded-full object-cover" alt={`Avatar ${i}`}/>
                                 {currentAvatar === url && <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-[#00A89C] bg-white rounded-full border border-white" />}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombres</label>
                           <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow text-slate-700" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Apellidos</label>
                           <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow text-slate-700" />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
                           <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow text-slate-700" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Teléfono Móvil</label>
                           <input type="tel" placeholder="+56..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow placeholder:text-slate-300 text-slate-700" />
                        </div>
                     </div>

                     <div className="pb-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nueva Contraseña Segura</label>
                        <input type="password" placeholder="Sólo escribe aquí si deseas cambiarla..." value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow placeholder:text-slate-300 text-slate-700" />
                     </div>

                     <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setIsSettingsOpen(false)} className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors">Cancelar</button>
                        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-[#00A89C] hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-[#00A89C]/20 disabled:opacity-50">
                           {saving ? 'Conectando DB...' : 'Modificar Base de Datos'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}

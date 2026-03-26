import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, ShieldCheck, ArrowRight, ArrowUpRight, Activity, CalendarCheck, BookOpen, Star, Headphones, ExternalLink } from 'lucide-react';

const RFAIData: Record<string, string> = {
    "Desbordado": "https://www.youtube.com/embed/SU_K-Qt4tf8",
    "Hiper Regulado": "https://www.youtube.com/embed/X7v43d7U4io",
    "Hiper Reactivo": "https://www.youtube.com/embed/Ke5JnAlBe7Y",
    "Inhibido": "https://www.youtube.com/embed/liHSg0FOT9g",
    "Sobre Adaptado": "https://www.youtube.com/embed/8rIIp-15huw",
    "Indeterminado": "https://www.youtube.com/embed/Ke5JnAlBe7Y"
};

export function ClientDashboard() {
   const { user } = useAuth();
   const [loading, setLoading] = useState(true);
   const [userTest, setUserTest] = useState<any>(null);
   const [catalog, setCatalog] = useState<any[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch Diagnostics for this specific User
            if (user?.id) {
               const diagRes = await axios.get(`/api/crm/diagnostics/user/${user.id}`);
               if (diagRes.data && diagRes.data.length > 0) {
                  setUserTest(diagRes.data[0]);
               }
            }
            // Fetch some Services/Programs for Upsell
            const srvRes = await axios.get('/api/data/services');
            if (srvRes.data) {
               setCatalog(srvRes.data.filter((s:any) => s.isActive).slice(0, 3));
            }
         } catch (e) {
            console.error('Error fetching dashboard data:', e);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [user]);

   const wpNumber = "56930179724";

   if (loading) return <div className="flex h-full min-h-[400px] items-center justify-center"><div className="w-12 h-12 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>;

   return (
      <div className="max-w-5xl mx-auto animate-fade-in p-4 lg:p-8 space-y-12 pb-24">
         {/* WELCOME HERO */}
         <header className="text-center max-w-2xl mx-auto mt-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-emerald-100">
               <ShieldCheck className="w-4 h-4" />
               <span>Portal Clínico Privado</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">
               Bienvenido, <span className="text-[#00A89C]">{user?.name?.split(' ')[0]}</span>.
            </h1>
            <p className="text-slate-500 mt-4 font-medium text-lg leading-relaxed">
               Este es tu refugio de transformación. Todo lo que necesitas para regular tu sistema nervioso y avanzar en tu tratamiento está aquí.
            </p>
         </header>

         {/* STATE 1: NO TEST RFAI */}
         {!userTest && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden border border-slate-700">
               <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A89C] opacity-20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
               <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl mb-6">
                     <Activity className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-black text-white leading-tight mb-4">
                     Estás volando a ciegas. <br/>Descubre la causa raíz de tu estrés.
                  </h2>
                  <p className="text-slate-300 text-lg mb-8">
                     Para poder recomendarte el tratamiento adecuado o los programas correctos, necesitamos leer tu sistema nervioso. Nuestro modelo RFAI revelará por qué sientes lo que sientes en <strong>menos de 3 minutos</strong>.
                  </p>
                  <a href="https://www.clinicaequilibrar.cl/#/test-rfai" target="_blank" rel="noreferrer" className="inline-flex items-center px-8 py-4 bg-[#00A89C] hover:bg-emerald-500 text-white rounded-xl font-black text-lg transition-transform hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,168,156,0.3)]">
                     Realizar Mi Diagnóstico Gratis <ArrowRight className="ml-2 w-6 h-6" />
                  </a>
               </div>
            </div>
         )}

         {/* STATE 2: HAS TEST RFAI (THE UPSELL FUNNEL) */}
         {userTest && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
               {/* Video & Results Side */}
               <div className="bg-white rounded-[2rem] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                  <div className="aspect-video bg-slate-900 rounded-[1.5rem] w-full overflow-hidden relative group">
                     {RFAIData[userTest.profile] ? (
                        <iframe 
                           className="w-full h-full absolute inset-0"
                           src={RFAIData[userTest.profile]} 
                           title="Explicación Perfil RFAI" 
                           frameBorder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                        ></iframe>
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                           <PlayCircle className="w-16 h-16 opacity-30 mb-2" />
                           <p className="font-bold text-sm">Video en Preparación</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Pitch Side */}
               <div className="flex flex-col justify-center lg:px-6">
                  <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 rounded-md font-black text-[10px] tracking-widest uppercase mb-4 border border-amber-200">
                     Tu Perfil Neurológico
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-4 leading-none">
                     {userTest.profile}
                  </h2>
                  <p className="text-slate-500 text-lg mb-6">
                     Tu sistema nervioso actual ha entrado en un bucle que agota tus recursos. En el video de la izquierda detallamos exactamente cómo se instaló este patrón y por qué el control consciente no es suficiente para salir de ahí.
                  </p>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A89C]"></div>
                     <p className="font-bold text-slate-700 italic">
                        "La solución no es intentar pensar en positivo; debes re-entrenar la ruta biológica de tu cerebro."
                     </p>
                  </div>

                  <a href={`https://wa.me/${wpNumber}?text=Hola,%20acabo%20de%20ver%20mi%20resultado%20RFAI%20(${userTest.profile})%20en%20la%20plataforma,%20y%20quiero%20comenzar%20el%20tratamiento%20recomendado.`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center p-4 bg-[#00A89C] text-white rounded-xl font-black text-lg shadow-[0_8px_20px_rgba(0,168,156,0.3)] hover:-translate-y-1 transition-all hover:bg-[#00968b]">
                     Comenzar a Sanar Mi Perfil <ArrowUpRight className="w-5 h-5 ml-2" />
                  </a>
                  <p className="text-center text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
                     Asignación con profesional experto vía WhatsApp Seguro
                  </p>
               </div>
            </div>
         )}

         <hr className="border-slate-100" />

         {/* PODCAST / AUTHORITY SECTION */}
         <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm flex flex-col md:flex-row relative">
            <div className="md:w-5/12 bg-slate-900 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#00A89C]/20 blur-[60px] rounded-full"></div>
               <Headphones className="w-12 h-12 text-[#00A89C] mb-6 relative z-10" />
               <h3 className="text-2xl font-black text-white mb-4 relative z-10">Conoce el Trasfondo</h3>
               <p className="text-slate-300 text-sm mb-8 relative z-10">
                  Acompaña a Claudio Reyes en el podcast oficial de Clínica Equilibrar. Profundiza en neurociencia y psicología clínica en tu trayecto al trabajo.
               </p>
               <a href="https://spotify.com" target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-black text-[#00A89C] hover:text-white transition-colors uppercase tracking-widest relative z-10 w-max">
                  Ir al Podcast <ExternalLink className="w-4 h-4 ml-2" />
               </a>
            </div>
            <div className="md:w-7/12 bg-slate-50 p-8 flex items-center justify-center border-l border-slate-200">
               {/* Placeholder Embedded Spotify / YouTube Frame layout */}
               <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                  <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-6 text-center">
                     <span className="text-xl font-black text-white">Equilibrar<span className="text-[#00A89C]">Podcast</span></span>
                  </div>
                  <div className="p-4 flex justify-between items-center bg-white">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Episodio Destacado</p>
                          <p className="font-bold text-slate-800">El origen de la Desregulación</p>
                       </div>
                       <button className="w-10 h-10 rounded-full bg-[#00A89C] text-white flex items-center justify-center hover:scale-110 transition-transform">
                          <PlayCircle className="w-5 h-5 ml-0.5" />
                       </button>
                  </div>
               </div>
            </div>
         </div>

         {/* CATALOG UPSELL / FAST ACTIONS */}
         <div>
            <div className="flex items-end justify-between mb-8">
               <div>
                  <h3 className="text-2xl font-black text-slate-800">Explora nuestro Catálogo</h3>
                  <p className="text-slate-500 mt-1">Servicios clínicos adicionales y agenda express.</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {catalog.map(service => (
                  <div key={service.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                     <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#00A89C] group-hover:bg-[#00A89C]/10 transition-colors mb-4">
                        <BookOpen className="w-6 h-6" />
                     </div>
                     <h4 className="font-black text-slate-800 text-lg leading-tight mb-2">{service.name}</h4>
                     <p className="text-xs text-slate-500 line-clamp-2 flex-1">{service.description || 'Consulta clínica especializada con profesionales del modelo Equilibrar.'}</p>
                     
                     <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-black text-slate-800">${parseInt(service.price).toLocaleString('es-CL')}</span>
                        <a href={`https://wa.me/${wpNumber}?text=Hola,%20me%20interesa%20adquirir:%20${encodeURIComponent(service.name)}.`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#00A89C] hover:text-emerald-600 flex items-center">
                           Ver Precio <ArrowRight className="w-3 h-3 ml-1" />
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
   );
}

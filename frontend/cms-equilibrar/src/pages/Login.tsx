import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api';
import { LogIn, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   
   const navigate = useNavigate();
   const location = useLocation();
   const { login } = useAuth();
   
   const phrases = [
      "Domina tu equilibrio. Libera tu grandeza.",
      "Trasciende tus límites. Elévate en Equilibrar.",
      "Forja tu destino. Entra al origen."
   ];
   const [phraseIndex, setPhraseIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 3000);
      return () => clearInterval(interval);
   }, []);

   // Where to go after login (or default to respective dashboards)
   const from = location.state?.from?.pathname || null;

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsSubmitting(true);

      try {
         const res = await axios.post('/api/auth/login', { email, password });
         const { token, user } = res.data;
         
         // Set global context
         login(token, user);

         // Dynamic routing based on role if no explicit 'from' state was cached
         if (from && from !== '/login') {
            navigate(from, { replace: true });
         } else {
            if (user.role === 'Super Admin' || user.role === 'Administrador' || user.role === 'Coordinador') navigate('/resumen', { replace: true });
            else if (user.role === 'Coordinador') navigate('/agenda', { replace: true });
            else if (user.role === 'Especialista') navigate('/agenda', { replace: true });
            else if (user.role === 'Cliente') navigate('/mi-cuenta', { replace: true });
            else navigate('/', { replace: true });
         }
      } catch (err: any) {
         setError(err.response?.data?.message || 'Error de conexión con el servidor maestro');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden relative selection:bg-[#00A89C]/20">
         {/* Background Decorators */}
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#00A89C]/10 rounded-full blur-[100px] pointer-events-none" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-slate-300/30 rounded-full blur-[120px] pointer-events-none" />

         <div className="w-full max-w-md p-6 relative z-10 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 backdrop-blur-xl">
               <div className="flex items-center justify-center mb-8">
                  <img src="/favicon.png" alt="Logo Equilibrar" className="h-48 w-auto drop-shadow-md" />
               </div>
               
               <h1 className="text-3xl font-light text-slate-700 text-center mb-2 tracking-wide">Entrar a Equilibrar</h1>
               
               <div className="relative h-6 mb-10 overflow-visible">
                  {phrases.map((phrase, idx) => (
                     <p 
                        key={idx} 
                        className={`absolute inset-0 w-full text-slate-500 text-center font-medium tracking-wide transition-all duration-1000 ease-in-out ${idx === phraseIndex ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-2 blur-[2px] pointer-events-none'}`}
                     >
                        {phrase}
                     </p>
                  ))}
               </div>

               {error && (
                  <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center border border-red-100 flex-wrap">
                     <ShieldAlert className="w-5 h-5 mr-2 shrink-0" />
                     {error}
                  </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
                     <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-semibold"
                        placeholder="ejemplo@correo.com"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
                     <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-semibold"
                        placeholder="••••••••"
                     />
                  </div>

                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full mt-4 bg-[#0B86A3] hover:bg-[#0B86A3]/90 text-white font-bold rounded-2xl px-5 py-4 flex items-center justify-center transition-all shadow-xl shadow-[#0B86A3]/30 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
                  >
                     {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                        <>
                           Ingresar a mi Área <LogIn className="w-5 h-5 ml-2" />
                        </>
                     )}
                  </button>
               </form>
            </div>
            
            <p className="text-center text-xs font-bold text-slate-400 mt-8 uppercase tracking-widest">
               © 2025 Clinica Equilibrar.
            </p>
         </div>
      </div>
   );
}

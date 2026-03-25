import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Paintbrush } from 'lucide-react';

export function Ajustes() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col pt-8">
      <header className="mb-8 shrink-0">
        <h1 className="text-3xl font-black text-slate-800 flex items-center">
        <SettingsIcon className="w-8 h-8 mr-3 text-slate-600" />
          Ajustes del Portal
        </h1>
        <p className="text-slate-500 mt-2">Configuraciones visuales y parámetros del sistema Maestro.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* SECTIONS */}
         {[
            { icon: Shield, title: 'Accesos y Roles', desc: 'Control avanzado de permisos', color: 'text-indigo-500 bg-indigo-50' },
            { icon: Paintbrush, title: 'Identidad Visual', desc: 'Fondos, logotipo, paleta global', color: 'text-pink-500 bg-pink-50' },
            { icon: Bell, title: 'Notificaciones BOT', desc: 'Credenciales API de WhatsApp Meta', color: 'text-emerald-500 bg-emerald-50' },
         ].map((cfg, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 ${cfg.color}`}>
                  <cfg.icon className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-lg">{cfg.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{cfg.desc}</p>
               </div>
            </div>
         ))}
      </div>
      <div className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        Módulo Operativo (Configurable a Demanda)
      </div>
    </div>
  );
}

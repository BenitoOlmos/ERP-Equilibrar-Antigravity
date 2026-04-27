import React from 'react';
import { Briefcase, Calendar, Search, MapPin, Phone, Home } from 'lucide-react';

export default function Consultas() {
    return (
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col relative transition-all duration-300">
            <div className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-slate-950">
                <div className="h-full opacity-100">
                    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
                        <header className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                                    <Briefcase className="w-8 h-8 text-[#00A89C]" />
                                    Consultas
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm font-medium">Listado de prospectos interesados.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                                <div className="w-full sm:w-64 shrink-0">
                                    <div className="relative z-50 w-full">
                                        <button className="w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm transition-all group outline-none border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 transition-colors text-slate-400 group-hover:text-[#00A89C]" />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">Histórico Completo</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="relative w-full sm:w-64 md:w-80">
                                    <Search className="w-[18px] h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input placeholder="Buscar por nombre, teléfono o modelo..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#00A89C] outline-none" type="text" />
                                </div>
                            </div>
                        </header>
                        
                        <div className="flex-1 overflow-hidden p-8 flex flex-col min-h-0">
                            <div className="flex flex-col flex-1 min-h-0 gap-6">
                                <div className="relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0 z-10 relative">
                                        <div className="p-6 rounded-3xl border border-transparent shadow-sm transition-all bg-slate-100 dark:bg-slate-800">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Fichas</p>
                                            </div>
                                            <h3 className="text-3xl font-black mt-1 text-slate-600 dark:text-slate-300">87</h3>
                                        </div>
                                        <div className="p-6 rounded-3xl border border-transparent shadow-sm transition-all bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100/80 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 underline decoration-dashed decoration-1 underline-offset-4">Potencial (CLP)</p>
                                            </div>
                                            <h3 className="text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">$255,6M</h3>
                                        </div>
                                        <div className="p-6 rounded-3xl border border-transparent shadow-sm transition-all bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100/80 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 underline decoration-dashed decoration-1 underline-offset-4">Servicio Preferido</p>
                                            </div>
                                            <h3 className="font-black mt-1 text-blue-600 dark:text-blue-400 text-xl">Psiquiatría</h3>
                                        </div>
                                        <div className="p-6 rounded-3xl border border-transparent shadow-sm transition-all bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100/80 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 underline decoration-dashed decoration-1 underline-offset-4">Tipos de Servicio</p>
                                            </div>
                                            <h3 className="font-black mt-1 text-indigo-600 dark:text-indigo-400 text-xl">PSQ | PSI | NUT</h3>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                                    <div className="overflow-auto custom-scrollbar flex-1 relative">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="sticky top-0 z-10 shadow-sm backdrop-blur-md bg-slate-50/90 dark:bg-slate-800/90">
                                                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-500">
                                                    <th className="px-6 py-4">Cliente</th>
                                                    <th className="px-6 py-4">Decidor</th>
                                                    <th className="px-6 py-4">Teléfono</th>
                                                    <th className="px-6 py-4">Origen Cliente</th>
                                                    <th className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            Ubicación
                                                            <button className="flex items-center gap-1 p-1 px-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-colors ml-2" title="Ver en Mapa Nacional">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-wider">Ver Mapa</span>
                                                            </button>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4">Especialidad</th>
                                                    <th className="px-6 py-4">Tipo de Servicio</th>
                                                    <th className="px-6 py-4 text-rose-500">Presupuesto</th>
                                                    <th className="px-6 py-4 text-right">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                {/* Demo Rows based on user HTML */}
                                                {[
                                                    { name: 'Cecilia', phone: '56954659514', loc: 'Melón, comuna de Hijuelas', type: 'Paihuén', budget: '$4.000.000' },
                                                    { name: 'Paola', phone: '56933116387', loc: 'La Ligua, Quebrada del Pobre', type: '-', budget: '-' },
                                                    { name: 'Ana Pizarro', phone: '56942968106', loc: 'Papudo', type: 'Petorca', budget: '-' },
                                                    { name: 'Santiago', phone: '56984497680', loc: 'La Ballena', type: 'Pichidangui', budget: '$5.000.000' },
                                                    { name: 'Contacto 6027', phone: '56994936027', loc: 'Sin especificar', type: '-', budget: '-' },
                                                    { name: 'Mercedes', phone: '56998914428', loc: 'Petorca', type: 'Los Molles', budget: '$4.600.000' },
                                                    { name: 'Rosa', phone: '56971470685', loc: 'Quintero', type: 'Pichidangui', budget: '$5.500.000' },
                                                    { name: 'Fabiola', phone: '56949847452', loc: 'Canela', type: 'Longotoma', budget: '-' },
                                                ].map((row, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer opacity-100">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-[#00A89C]/10 text-[#00A89C] flex items-center justify-center font-bold text-sm shrink-0">
                                                                    {row.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">{row.name}</p>
                                                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Consulta</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4"><span className="text-sm font-medium text-slate-600 dark:text-slate-300">-</span></td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-mono">
                                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                                {row.phone}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4"><span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sin origen</span></td>
                                                        <td className="px-6 py-4"><span className="text-sm font-medium text-slate-600 dark:text-slate-300">{row.loc}</span></td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                                                <Home className="w-3.5 h-3.5 text-emerald-500" />
                                                                {row.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-3 py-1 rounded-lg">-</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-black text-sm text-rose-600 dark:text-rose-400 whitespace-nowrap">{row.budget}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="text-[#00A89C] hover:text-[#008f84] font-bold text-xs bg-[#00A89C]/10 hover:bg-[#00A89C]/20 px-4 py-2 rounded-xl transition-colors">Abrir Chat</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

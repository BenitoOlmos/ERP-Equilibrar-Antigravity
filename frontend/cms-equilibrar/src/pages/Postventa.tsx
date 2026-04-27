import React, { useState } from 'react';
import { Wrench, Calendar, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Postventa() {
    const [showHistory, setShowHistory] = useState(false);
    return (
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col relative transition-all duration-300">
            <div className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-slate-950">
                <div className="h-full opacity-100">
                    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
                        <header className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                                    <Wrench className="w-8 h-8 text-[#00A89C]" />
                                    Postventa
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm font-medium">Seguimiento de atenciones, entregas y garantías clínicas.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                                <div className="w-full sm:w-64 shrink-0">
                                    <div className="relative z-50 w-full">
                                        <button 
                                            onClick={() => setShowHistory(!showHistory)}
                                            className="w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm transition-all group outline-none border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 transition-colors text-slate-400 group-hover:text-[#00A89C]" />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">Histórico Completo</span>
                                            </div>
                                        </button>
                                        
                                        {showHistory && (
                                            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col sm:flex-row overflow-hidden min-w-[320px] sm:min-w-[480px]">
                                                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 w-full sm:w-40 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 mb-2">Atajos</span>
                                                    <button className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Hoy</button>
                                                    <button className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Ayer</button>
                                                    <button className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Esta Semana</button>
                                                    <button className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Semana Pasada</button>
                                                    <button className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Este Mes</button>
                                                    <button className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Mes Pasado</button>
                                                    <button className="text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#00A89C] hover:bg-[#00A89C]/10 px-3 py-2 rounded-lg transition-colors">Todo el Histórico</button>
                                                </div>
                                                <div className="p-4 flex-1 select-none">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <div className="font-bold text-sm capitalize">abril 2026</div>
                                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-7 mb-2">
                                                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">Lu</div>
                                                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">Ma</div>
                                                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">Mi</div>
                                                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">Ju</div>
                                                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">Vi</div>
                                                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">Sá</div>
                                                        <div className="text-center text-[10px] font-black text-slate-400 uppercase">Do</div>
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-y-1">
                                                        <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">30</button>
                                                        <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">31</button>
                                                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(day => (
                                                            <button key={day} className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">{day}</button>
                                                        ))}
                                                        <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">1</button>
                                                        <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">2</button>
                                                        <button disabled className="h-8 text-xs font-bold transition-all mx-0.5 relative z-10 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 rounded-lg">3</button>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">Selecciona inicio</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="relative w-full sm:w-64 md:w-80">
                                    <Search className="w-[18px] h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input placeholder="Buscar por nombre, teléfono o especialidad..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#00A89C] outline-none" type="text" />
                                </div>
                            </div>
                        </header>
                        <div className="flex-1 overflow-hidden p-8 flex flex-col min-h-0">
                            <div className="flex flex-col items-center justify-center h-full opacity-50">
                                <FileText className="w-12 h-12 text-slate-400 mb-4" />
                                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">No hay registros en Postventa</h3>
                                <p className="text-sm text-slate-400">Las fichas aparecerán aquí a medida que los pacientes contraten servicios y avancen en el embudo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

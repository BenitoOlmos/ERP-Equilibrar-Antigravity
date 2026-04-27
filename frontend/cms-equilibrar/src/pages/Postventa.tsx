import React from 'react';
import { Wrench, Calendar, Search, FileText } from 'lucide-react';

export default function Postventa() {
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

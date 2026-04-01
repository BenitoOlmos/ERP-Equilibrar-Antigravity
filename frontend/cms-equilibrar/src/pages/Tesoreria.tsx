import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Banknote, TrendingUp, TrendingDown, RefreshCcw, Activity } from 'lucide-react';

export function Tesoreria() {
  const [cashflow, setCashflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFlow = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/finance/cashflow/summary');
      setCashflow(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFlow(); }, []);

  if (loading || !cashflow) return (
    <div className="flex justify-center items-center h-full min-h-[50vh]">
         <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  const netTotal = cashflow.summary.totalIncome - cashflow.summary.totalExpense;
  const isPositive = netTotal >= 0;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Banknote className="w-8 h-8 mr-3 text-amber-500" />
            Tesorería y Flujo de Caja
          </h1>
          <p className="text-slate-500 mt-2">Métricas de rentabilidad, ganancias brutas y cálculo de ROI.</p>
        </div>
        <button onClick={fetchFlow} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-400 hover:text-amber-500">
           <RefreshCcw className="w-5 h-5"/>
        </button>
      </header>

      {/* SUPER DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4"><TrendingUp className="w-6 h-6"/></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Ingresos Reales Brutos</p>
            <h2 className="text-3xl font-black text-slate-800">${cashflow.summary.totalIncome.toLocaleString()}</h2>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4"><TrendingDown className="w-6 h-6"/></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Egresos Consolidados</p>
            <h2 className="text-3xl font-black text-slate-800">${cashflow.summary.totalExpense.toLocaleString()}</h2>
         </div>
         <div className={`p-6 rounded-3xl border-2 flex flex-col ${isPositive ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30' : 'bg-gradient-to-br from-rose-500 to-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/30'}`}>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4"><Activity className="w-6 h-6"/></div>
            <p className="text-xs font-black uppercase tracking-widest text-white/80 mb-1">Flujo Neto Retenido</p>
            <h2 className="text-4xl font-black">${netTotal.toLocaleString()}</h2>
         </div>
      </div>

      {/* TABLA FLUJO MENSUAL (History) */}
      <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-4 mt-4 ml-2">Histórico por Periodos</h3>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden mb-6">
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border-b border-slate-100">
                <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6 font-bold w-1/4">Periodo Mensual</th>
                  <th className="p-4 font-bold text-center text-emerald-600/70">Ingresado (+)</th>
                  <th className="p-4 font-bold text-center text-rose-600/70">Asignado (-)</th>
                  <th className="p-4 font-bold text-right pr-6">Resultado (Neto)</th>
                </tr>
              </thead>
              <tbody>
                {cashflow.history.map((h: any) => (
                   <tr key={h.month} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4 pl-6 text-sm font-black text-slate-700 tracking-wider">
                         {h.month}
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-600">
                         ${h.income.toLocaleString()}
                      </td>
                      <td className="p-4 text-center font-bold text-rose-600">
                         ${h.expense.toLocaleString()}
                      </td>
                      <td className={`p-4 pr-6 text-right font-black text-lg ${h.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {h.net >= 0 ? '+' : ''}${h.net.toLocaleString()}
                      </td>
                   </tr>
                ))}
                {cashflow.history.length === 0 && (
                   <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-bold">No existen flujos monetarios registrados</td></tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function CuentasCobrar() {
  const [receivables, setReceivables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceivables = async () => {
    try {
      const res = await axios.get('/api/finance/receivables/list');
      setReceivables(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivables();
  }, []);

  const markAsPaid = async (id: string) => {
    if (!confirm('¿Marcar este pago como completado?')) return;
    try {
      await axios.put(`/api/finance/receivables/${id}/pay`, { paymentMethod: 'TRANSFER' });
      fetchReceivables();
    } catch (e) {
      alert('Error al actualizar el estado de pago');
    }
  };

  const totalPending = receivables.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Wallet className="w-8 h-8 mr-3 text-indigo-500" />
            Cuentas por Cobrar (Clientes)
          </h1>
          <p className="text-slate-500 mt-2">Seguimiento de deudas y pagos pendientes de pacientes.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl border border-indigo-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-indigo-600"/>
           </div>
           <div>
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Total Pendiente</p>
              <p className="text-2xl font-black">${totalPending.toLocaleString()}</p>
           </div>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar deudor..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-b-3xl">
          {loading ? (
             <div className="flex justify-center items-center h-full"><div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6 font-bold">Concepto</th>
                  <th className="p-4 font-bold">Paciente deudor</th>
                  <th className="p-4 font-bold">Vencimiento</th>
                  <th className="p-4 font-bold text-right">Deuda</th>
                  <th className="p-4 font-bold text-center pr-6">Acción</th>
                </tr>
              </thead>
              <tbody>
                {receivables.map(r => {
                   const isOverdue = r.dueDate && new Date(r.dueDate) < new Date();
                   return (
                   <tr key={r.id} className={`border-b border-slate-50 hover:bg-slate-50/50 ${isOverdue ? 'bg-red-50/30' : ''}`}>
                      <td className="p-4 pl-6 text-sm font-bold text-slate-800">
                         {r.concept || r.appointment?.service?.name || 'Venta Pendiente'}
                         <div className="text-[10px] font-bold text-slate-400 mt-0.5">Creado: {new Date(r.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                         <div className="text-sm font-bold text-slate-700">{r.user?.profile?.firstName} {r.user?.profile?.lastName}</div>
                         <div className="text-xs text-slate-500">{r.user?.email}</div>
                      </td>
                      <td className="p-4">
                         {r.dueDate ? (
                             <span className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                                 {new Date(r.dueDate).toLocaleDateString()}
                             </span>
                         ) : <span className="text-xs text-slate-300 italic">Sin Vencimiento</span>}
                      </td>
                      <td className="p-4 text-right font-black text-lg text-slate-700">
                         ${r.amount.toLocaleString()}
                      </td>
                      <td className="p-4 pr-6 text-center">
                         <button 
                            onClick={() => markAsPaid(r.id)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center w-full gap-2 transition-colors"
                         >
                            <CheckCircle2 className="w-4 h-4"/> Marcar Pagado
                         </button>
                      </td>
                   </tr>
                )})}
                {receivables.length === 0 && (
                   <tr>
                      <td colSpan={5} className="p-16 text-center">
                         <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                         <div className="font-bold text-slate-400">No hay cuentas por cobrar</div>
                      </td>
                   </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

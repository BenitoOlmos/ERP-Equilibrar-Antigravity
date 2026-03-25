import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, Search, Filter } from 'lucide-react';

export function Pagos() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/data/payments')
      .then(res => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Wallet className="w-8 h-8 mr-3 text-emerald-500" />
            Control de Pagos
          </h1>
          <p className="text-slate-500 mt-2">Registro unificado de transferencias de pacientes y alumnos.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar transacción..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#00A89C]/20" />
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-b-3xl">
          {loading ? (
             <div className="flex justify-center items-center h-full"><div className="w-10 h-10 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6 font-bold w-1/4">ID Transacción</th>
                  <th className="p-4 font-bold">Concepto</th>
                  <th className="p-4 font-bold">Asociado a</th>
                  <th className="p-4 font-bold">Estado</th>
                  <th className="p-4 font-bold text-right pr-6">Monto</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                   <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-widest">{payment.id.substring(0,8)}</td>
                      <td className="p-4 text-sm font-bold text-slate-800">
                         {payment.appointment?.service?.name || payment.appointment?.rfaiType || 'Pago por Servicio'}
                         <div className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(payment.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                         <div className="text-sm font-bold text-slate-700">{payment.client?.profile?.firstName} {payment.client?.profile?.lastName}</div>
                         <div className="text-xs text-slate-500">{payment.client?.email}</div>
                      </td>
                      <td className="p-4">
                         {payment.status === 'COMPLETED' ? (
                            <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600">Completado</span>
                         ) : (
                            <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-600">Pendiente</span>
                         )}
                      </td>
                      <td className="p-4 pr-6 text-right font-black text-lg text-emerald-600">
                         ${payment.amount.toLocaleString()}
                      </td>
                   </tr>
                ))}
                {payments.length === 0 && (
                   <tr>
                      <td colSpan={5} className="p-16 text-center">
                         <Wallet className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                         <div className="font-bold text-slate-400">Sin Movimientos Registrados</div>
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

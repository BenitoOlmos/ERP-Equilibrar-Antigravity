import React, { useState, useEffect } from 'react';
import axios from '../api';
import { UserPlus, FileSignature, Receipt, CheckCircle } from 'lucide-react';

export function Honorarios() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/hr/honorarios');
      setProfiles(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const issueReceipt = async (profileId: string) => {
    const amountStr = prompt('Ingrese Monto Bruto de la Boleta:', '100000');
    if(!amountStr) return;
    try {
       await axios.post('/api/hr/honorarios/receipt', {
          profileId, receiptNumber: `BHE-${Math.floor(Math.random()*1000)}`, grossAmount: Number(amountStr), retentionRate: 13.75, retentionType: 'RETAINED_BY_COMPANY'
       });
       fetchData();
    } catch(e) { alert('Error ingresando boleta'); }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <FileSignature className="w-8 h-8 mr-3 text-emerald-500" />
            Profesionales Indirectos
          </h1>
          <p className="text-slate-500 mt-2">DPI 1879, control de honorarios y retención (13.75%).</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden mb-6">
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border-b border-slate-100">
                <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6 font-bold w-1/3">Profesional Independiente</th>
                  <th className="p-4 font-bold">Última Boleta BHE</th>
                  <th className="p-4 font-bold text-right pr-6">Acción (DTE)</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p: any) => (
                   <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4 pl-6">
                         <div className="text-sm font-black text-slate-700">{p.supplier.name}</div>
                         <div className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 inline-block rounded mt-1">{p.activity || 'Sin Actividad'}</div>
                      </td>
                      <td className="p-4">
                         {p.receipts[0] ? (
                            <div>
                               <span className="text-emerald-600 font-black text-sm">${p.receipts[0].netAmount.toLocaleString()} líq.</span>
                               <div className="text-[10px] text-slate-400">Bruto: ${p.receipts[0].grossAmount.toLocaleString()}</div>
                            </div>
                         ) : <span className="text-xs text-slate-300">Sin historial</span>}
                       </td>
                      <td className="p-4 pr-6 text-right">
                         <button onClick={() => issueReceipt(p.id)} className="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center transition-all group">
                            <Receipt className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110"/> Ingresar Boleta
                         </button>
                      </td>
                   </tr>
                ))}
                {profiles.length === 0 && !loading && (
                   <tr><td colSpan={3} className="p-16 text-center text-slate-400 font-bold">Sin profesionales listados.</td></tr>
                )}
              </tbody>
            </table>
         </div>
       </div>
    </div>
  );
}

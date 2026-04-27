import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Users, FileText, CheckCircle2, DollarSign, Briefcase } from 'lucide-react';

export function TrabajadoresPlanta() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [empRes, indRes] = await Promise.all([
        axios.get('/api/hr/employees'),
        axios.get('/api/hr/indicators')
      ]);
      setEmployees(empRes.data);
      setIndicators(indRes.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const simulatePayroll = async (empId: string, baseSalary: number) => {
    try {
       const res = await axios.post('/api/hr/payroll/calculate', { employeeId: empId, baseSalary });
       alert(`Cálculo exitoso: Sueldo Líquido $ ${res.data.netSalary.toLocaleString()}`);
    } catch(e) { alert('Error calculando planilla'); }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-indigo-500" />
            Recursos Humanos: Planta
          </h1>
          <p className="text-slate-500 mt-2">Gestión de contratos y emisión del Libro de Remuneraciones Electrónico.</p>
        </div>
        {indicators && (
           <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl border border-indigo-100 flex gap-4 text-xs font-bold items-center shadow-sm">
              <div className="flex flex-col"><span className="text-indigo-400">UF Actual</span><span>${indicators.uf.toLocaleString()}</span></div>
              <div className="w-px h-6 bg-indigo-200" />
              <div className="flex flex-col"><span className="text-indigo-400">UTM Mensual</span><span>${indicators.utm.toLocaleString()}</span></div>
           </div>
        )}
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden mb-6">
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border-b border-slate-100">
                <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6 font-bold w-1/3">Trabajador</th>
                  <th className="p-4 font-bold">Contrato Base</th>
                  <th className="p-4 font-bold">Previsión</th>
                  <th className="p-4 font-bold text-right pr-6">Acción (Nómina)</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e: any) => (
                   <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4 pl-6">
                         <div className="text-sm font-black text-slate-700">{e.supplier.name}</div>
                         <div className="text-xs text-slate-400">{e.supplier.rut}</div>
                      </td>
                      <td className="p-4">
                         <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${e.contracts[0]?.baseSalary.toLocaleString() || 0}</span>
                         <div className="text-[10px] text-slate-400 mt-1">{e.contracts[0]?.position || 'Sin cargo'}</div>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-600">
                         {e.afp} / {e.healthSystem}
                      </td>
                      <td className="p-4 pr-6 text-right">
                         <button onClick={() => simulatePayroll(e.id, e.contracts[0]?.baseSalary || 0)} className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center transition-all">
                            <FileText className="w-4 h-4 mr-1.5"/> Calcular Mes
                         </button>
                      </td>
                   </tr>
                ))}
                {employees.length === 0 && !loading && (
                   <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-bold">Sin trabajadores de planta registrados.</td></tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

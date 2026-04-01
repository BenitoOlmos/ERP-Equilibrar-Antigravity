import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Search, PlusCircle, CheckCircle2, UserPlus, Factory, Building2, UserX } from 'lucide-react';

export function CuentasPagar() {
  const [activeTab, setActiveTab] = useState<'expenses'|'suppliers'>('expenses');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({ name: '', type: 'EXTERNAL', rut: '', contact: '', email: '' });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ concept: '', amount: '', category: 'HONORARIOS', supplierId: '', dueDate: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [suppRes, expRes] = await Promise.all([
        axios.get('/api/finance/suppliers/list'),
        axios.get('/api/finance/expenses/list')
      ]);
      setSuppliers(suppRes.data);
      setExpenses(expRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveSupplier = async () => {
    try {
      await axios.post('/api/finance/suppliers/create', supplierForm);
      setIsSupplierModalOpen(false);
      setSupplierForm({ name: '', type: 'EXTERNAL', rut: '', contact: '', email: '' });
      fetchData();
    } catch(e) { alert('Error guardando proveedor'); }
  };

  const handleSaveExpense = async () => {
    try {
      await axios.post('/api/finance/expenses/create', {
        ...expenseForm, 
        amount: Number(expenseForm.amount),
        dueDate: expenseForm.dueDate ? new Date(expenseForm.dueDate).toISOString() : null
      });
      setIsExpenseModalOpen(false);
      setExpenseForm({ concept: '', amount: '', category: 'HONORARIOS', supplierId: '', dueDate: '' });
      fetchData();
    } catch(e) { alert('Error creando gasto'); }
  };

  const markExpenseAsPaid = async (id: string) => {
    if (!confirm('¿Marcar egreso como pagado?')) return;
    try {
      await axios.put(`/api/finance/expenses/${id}`, { status: 'PAID' });
      fetchData();
    } catch(e) { alert('Error'); }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm('¿Eliminar registro?')) return;
    try {
      await axios.delete(`/api/finance/expenses/${id}`);
      fetchData();
    } catch(e) { alert('Error'); }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-rose-500" />
            Cuentas por Pagar
          </h1>
          <p className="text-slate-500 mt-2">Gestión de Egresos, Remuneraciones y Proveedores.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
           <button onClick={() => setActiveTab('expenses')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'expenses' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Gestión de Deudas</button>
           <button onClick={() => setActiveTab('suppliers')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'suppliers' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Directorio Proveedores</button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* TAB CONTROLS */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500/20" />
          </div>
          {activeTab === 'expenses' ? (
             <button onClick={() => setIsExpenseModalOpen(true)} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md text-sm">
                 <PlusCircle className="w-4 h-4"/> Añadir Egreso
             </button>
          ) : (
             <button onClick={() => setIsSupplierModalOpen(true)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md text-sm">
                 <UserPlus className="w-4 h-4"/> Nuevo Proveedor
             </button>
          )}
        </div>

        <div className="flex-1 overflow-auto rounded-b-3xl relative">
          {loading ? (
             <div className="flex justify-center items-center h-full"><div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" /></div>
          ) : (
            activeTab === 'expenses' ? (
               <table className="w-full text-left border-collapse">
                 <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                   <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                     <th className="p-4 pl-6 font-bold w-1/3">Concepto/Categoría</th>
                     <th className="p-4 font-bold">Proveedor / Nómina</th>
                     <th className="p-4 font-bold">Estado</th>
                     <th className="p-4 font-bold text-right">Monto</th>
                     <th className="p-4 font-bold text-center pr-6">Acción</th>
                   </tr>
                 </thead>
                 <tbody>
                   {expenses.map(exp => (
                      <tr key={exp.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                         <td className="p-4 pl-6">
                            <div className="text-sm font-bold text-slate-800">{exp.concept}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 px-1.5 py-0.5 bg-slate-100 rounded inline-block">{exp.category}</div>
                         </td>
                         <td className="p-4 text-sm font-bold text-slate-600">
                            {exp.supplier?.name || <span className="text-slate-300 italic">Sin asignar</span>}
                         </td>
                         <td className="p-4">
                            {exp.status === 'PAID' ? (
                               <span className="text-emerald-600 text-[10px] font-black tracking-widest uppercase bg-emerald-50 px-2 py-1 rounded">Pagado</span>
                            ) : (
                               <span className="text-rose-600 text-[10px] font-black tracking-widest uppercase bg-rose-50 px-2 py-1 rounded">Pendiente</span>
                            )}
                            {exp.status === 'PENDING' && exp.dueDate && (
                               <div className="text-[10px] text-slate-400 font-bold mt-1">Vence: {new Date(exp.dueDate).toLocaleDateString()}</div>
                            )}
                         </td>
                         <td className="p-4 text-right font-black text-lg text-slate-800">
                            ${exp.amount.toLocaleString()}
                         </td>
                         <td className="p-4 pr-6">
                            {exp.status === 'PENDING' ? (
                               <div className="flex gap-2 justify-end">
                                  <button onClick={() => markExpenseAsPaid(exp.id)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"><CheckCircle2 className="w-4 h-4"/></button>
                                  <button onClick={() => deleteExpense(exp.id)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"><UserX className="w-4 h-4"/></button>
                               </div>
                            ) : (
                               <span className="text-slate-300 text-xs italic flex justify-end">Liquidado</span>
                            )}
                         </td>
                      </tr>
                   ))}
                   {expenses.length === 0 && (
                      <tr><td colSpan={5} className="p-16 text-center text-slate-400 font-bold">Sin cuentas por pagar registradas</td></tr>
                   )}
                 </tbody>
               </table>
            ) : (
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suppliers.map(s => (
                     <div key={s.id} className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/80 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1 group flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${s.type==='EMPLOYEE'?'bg-indigo-100 text-indigo-500':s.type==='UTILITY'?'bg-blue-100 text-blue-500':s.type==='INDIRECT_PROFESSIONAL'?'bg-amber-100 text-amber-500':'bg-slate-200 text-slate-500'}`}>
                              {s.type === 'EMPLOYEE' || s.type === 'INDIRECT_PROFESSIONAL' ? <UserPlus className="w-6 h-6"/> : <Building2 className="w-6 h-6"/>}
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                              {s.type.replace('_',' ')}
                           </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{s.name}</h3>
                        <p className="text-sm font-semibold text-slate-500 mb-4">{s.email || 'Sin correo'}, {s.phone || 'Sin télefono'}</p>
                        {s.rut && <div className="text-xs text-slate-400 font-bold tracking-widest mt-auto border-t border-slate-200 pt-3">RUT: {s.rut}</div>}
                     </div>
                  ))}
               </div>
            )
          )}
        </div>
      </div>

      {/* Supplier Modal */}
      {isSupplierModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSupplierModalOpen(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-in flex flex-col">
               <h3 className="text-xl font-black text-slate-800 mb-6">Añadir Entidad Empleada/Proveedora</h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nombre Completo / Razón Social</label>
                     <input type="text" value={supplierForm.name} onChange={e=>setSupplierForm(s=>({...s,name:e.target.value}))} className="w-full bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl font-semibold mt-1 outline-none focus:border-slate-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo</label>
                        <select value={supplierForm.type} onChange={e=>setSupplierForm(s=>({...s,type:e.target.value}))} className="w-full bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl font-semibold mt-1 outline-none text-sm">
                           <option value="EMPLOYEE">Nómina/Trabajador</option>
                           <option value="INDIRECT_PROFESSIONAL">Profesional Indirecto</option>
                           <option value="UTILITY">Gasto Fijo (Servicio)</option>
                           <option value="EXTERNAL">Insumos/Proveedor</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Identificador RUT</label>
                        <input type="text" value={supplierForm.rut} onChange={e=>setSupplierForm(s=>({...s,rut:e.target.value}))} className="w-full bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl font-semibold mt-1 outline-none" />
                     </div>
                  </div>
               </div>

               <div className="flex justify-end gap-3 mt-8">
                  <button onClick={() => setIsSupplierModalOpen(false)} className="px-5 py-2 hover:bg-slate-100 rounded-xl font-bold text-slate-500">Cancelar</button>
                  <button onClick={handleSaveSupplier} disabled={!supplierForm.name} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl font-bold shadow-md disabled:opacity-50">Registrar Entidad</button>
               </div>
            </div>
         </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsExpenseModalOpen(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-in flex flex-col">
               <h3 className="text-xl font-black text-rose-600 mb-6">Registrar Deuda / Egreso</h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gasto o Concepto</label>
                     <input type="text" placeholder="Ej: Pago de Luz Abril" value={expenseForm.concept} onChange={e=>setExpenseForm(s=>({...s,concept:e.target.value}))} className="w-full bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl font-semibold mt-1 outline-none focus:border-rose-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monto ($)</label>
                        <input type="number" value={expenseForm.amount} onChange={e=>setExpenseForm(s=>({...s,amount:e.target.value}))} className="w-full bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl font-black text-rose-600 mt-1 outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vencimiento</label>
                        <input type="date" value={expenseForm.dueDate} onChange={e=>setExpenseForm(s=>({...s,dueDate:e.target.value}))} className="w-full bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl font-semibold mt-1 outline-none text-sm text-slate-600" />
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contratista / Empleado</label>
                     <select value={expenseForm.supplierId} onChange={e=>setExpenseForm(s=>({...s,supplierId:e.target.value}))} className="w-full bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl font-semibold mt-1 outline-none text-sm">
                        <option value="">(Ignorar - Gasto Administrativo)</option>
                        {suppliers.map(sup => (
                           <option key={sup.id} value={sup.id}>{sup.name} ({sup.type})</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="flex justify-end gap-3 mt-8">
                  <button onClick={() => setIsExpenseModalOpen(false)} className="px-5 py-2 hover:bg-slate-100 rounded-xl font-bold text-slate-500">Descartar</button>
                  <button onClick={handleSaveExpense} disabled={!expenseForm.concept || !expenseForm.amount} className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl font-bold shadow-md disabled:opacity-50">Crear Deuda</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}

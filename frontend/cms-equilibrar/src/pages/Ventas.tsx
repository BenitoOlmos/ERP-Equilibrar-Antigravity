import React, { useState, useEffect } from 'react';
import axios from '../api';
import { ShoppingCart, Search, Plus, Edit3, Trash2, X, ChevronDown } from 'lucide-react';

export default function Ventas() {
  const [sales, setSales] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any>({ services: [], programs: [], courses: [], products: [] });
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDrop, setShowClientDrop] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [productId, setProductId] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('COMPLETED');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER');

  // Scheduling State
  const [requiresScheduling, setRequiresScheduling] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [specialistId, setSpecialistId] = useState('');
  const [attachedServiceId, setAttachedServiceId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, usersRes, catalogRes] = await Promise.all([
        axios.get('/api/data/payments'),
        axios.get('/api/data/users'),
        axios.get('/api/data/payments/catalog')
      ]);
      setSales(salesRes.data);
      setUsers(usersRes.data);
      setCatalog(catalogRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNewSale = () => {
    setEditingId(null);
    setAmount('');
    setClientSearch('');
    setShowClientDrop(false);
    setConcept('');
    setProductId('');
    setUserId('');
    setStatus('COMPLETED');
    setPaymentMethod('TRANSFER');
    setRequiresScheduling(false);
    setAppointmentDate('');
    setAppointmentTime('');
    setSpecialistId('');
    setAttachedServiceId('');
    setShowModal(true);
  };

  const openEditSale = (sale: any) => {
    setEditingId(sale.id);
    setAmount(sale.amount.toString());
    setClientSearch('');
    setShowClientDrop(false);
    
    // Auto-derive concept if sale was generated implicitly from Agenda
    const derivedConcept = sale.concept || sale.appointment?.service?.name || sale.appointment?.rfaiType || '';
    setConcept(derivedConcept);
    
    setProductId(sale.productId || '');
    setUserId(sale.userId || sale.user?.id || '');
    setStatus(sale.status);
    setPaymentMethod(sale.paymentMethod || 'TRANSFER');
    
    if (sale.appointment) {
       setRequiresScheduling(true);
       const d = new Date(sale.appointment.date);
       // To get local yyyy-mm-dd
       const localDateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
       setAppointmentDate(localDateStr);
       setAppointmentTime(sale.appointment.timeStr || d.toTimeString().slice(0,5));
       setSpecialistId(sale.appointment.specialistId || '');
       setAttachedServiceId(sale.appointment.serviceId || '');
    } else {
       setRequiresScheduling(false);
       setAppointmentDate('');
       setAppointmentTime('');
       setSpecialistId('');
       setAttachedServiceId('');
    }

    setShowModal(true);
  };

  const handleConceptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedConcept = e.target.value;
    setConcept(selectedConcept);
    setProductId('');
    setRequiresScheduling(false);
    setAttachedServiceId('');
    setSpecialistId('');
    setAppointmentDate('');
    setAppointmentTime('');
    
    // Auto-Pricing & Scheduling Logic
    if (selectedConcept) {
      let item: any;
      
      // 1. Check Service
      item = catalog.services?.find((s:any) => s.name === selectedConcept);
      if(item) { 
         setRequiresScheduling(true); 
         setAttachedServiceId(item.id); 
         if(item.specialistId) setSpecialistId(item.specialistId);
      }
      
      // 2. Check Programs (RFAI)
      if (!item) {
        item = catalog.programs?.find((p:any) => p.title === selectedConcept);
        if(item && item.services?.length > 0) { 
           setRequiresScheduling(true); 
           setAttachedServiceId(item.services[0].agendaServiceId || item.services[0].serviceId); 
           if(item.services[0].agendaService?.specialistId) setSpecialistId(item.services[0].agendaService.specialistId);
        }
      }
      
      // 3. Check Treatments
      if (!item) {
        item = catalog.treatments?.find((p:any) => p.name === selectedConcept);
        if(item && item.services?.length > 0) {
           setRequiresScheduling(true); 
           setAttachedServiceId(item.services[0].agendaServiceId || item.services[0].serviceId); 
           if(item.services[0].service?.specialistId) setSpecialistId(item.services[0].service.specialistId);
        }
      }
      
      // 4. Check Courses
      if (!item) {
        item = catalog.courses?.find((c:any) => c.title === selectedConcept);
        if(item && item.services?.length > 0) {
           setRequiresScheduling(true); 
           setAttachedServiceId(item.services[0].agendaServiceId || item.services[0].serviceId); 
           if(item.services[0].agendaService?.specialistId) setSpecialistId(item.services[0].agendaService.specialistId);
        }
      }
      
      // 5. Products
      let prodItem = catalog.products?.find((p:any) => p.name === selectedConcept);
      if (prodItem) {
        item = prodItem;
        setProductId(prodItem.id);
      }
      
      if (item && item.price !== undefined) {
        setAmount(item.price.toString());
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta venta/pago permanentemente?')) return;
    try {
      await axios.delete(`/api/data/payments/${id}`);
      setSales(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      alert('Error al eliminar venta.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !userId) return alert('Cliente y Monto son requeridos');
    if (requiresScheduling && (!appointmentDate || !appointmentTime)) {
       return alert('El ítem seleccionado incluye atención clínica. Debes asignar Fecha y Hora.');
    }
    
    // Crear el timestamp respetando la zona horaria del navegador
    const dt = requiresScheduling ? new Date(`${appointmentDate}T${appointmentTime}:00`) : new Date();

    const payload = { 
       amount, concept, status, paymentMethod, userId, productId: productId || null,
       ...(requiresScheduling && {
          appointmentDetails: {
             date: dt.toISOString(),
             timeStr: appointmentTime,
             specialistId: specialistId,
             serviceId: attachedServiceId
          }
       })
    };
    
    try {
      if (editingId) {
        const res = await axios.put(`/api/data/payments/${editingId}`, payload);
        setSales(prev => prev.map(s => s.id === editingId ? res.data : s));
      } else {
        const res = await axios.post('/api/data/payments', payload);
        setSales(prev => [res.data, ...prev]);
      }
      setShowModal(false);
    } catch (e) {
      alert('Error al guardar venta');
    }
  };

  const filteredSales = sales.filter(s => {
    const text = searchTerm.toLowerCase();
    const searchStr = `${s.concept || ''} ${s.user?.name || ''} ${s.user?.profile?.firstName || ''} ${s.user?.email || ''}`.toLowerCase();
    return searchStr.includes(text);
  });

  const totalIngresos = sales.filter(s => s.status === 'COMPLETED').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendientes = sales.filter(s => s.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-h-[calc(100vh-6rem)] flex flex-col relative animate-fade-in">
      <header className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3 text-[#00A89C]" />
            Módulo de Ventas
          </h1>
          <p className="text-slate-500 mt-2">Punto de gestión manual para ventas de servicios, programas y productos.</p>
        </div>
        <button 
          onClick={openNewSale}
          className="bg-[#00A89C] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#00968b] hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Venta
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Ingresos Confirmados</span>
          <span className="text-4xl font-black text-emerald-600">${totalIngresos.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Pagos Pendientes</span>
          <span className="text-4xl font-black text-amber-500">${totalPendientes.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Volumen de Transacciones</span>
          <span className="text-4xl font-black text-slate-800">{sales.length}</span>
        </div>
      </div>

      {/* Data Grid Window */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4 items-center shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente o concepto..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A89C]/20 transition-all font-medium"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">{filteredSales.length} Registros</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white sticky top-0 z-10 shadow-sm">
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ID TRANS</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Concepto</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Monto</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.id} className="border-b border-slate-100 hover:bg-white transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-400">{sale.id.slice(0,8)}</td>
                    <td className="p-4 text-xs font-bold text-slate-600">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">
                        {sale.user?.name || sale.user?.profile?.firstName + ' ' + sale.user?.profile?.lastName || 'Sin Nombre'}
                      </div>
                      <div className="text-xs text-slate-500">{sale.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700">
                      {sale.concept || sale.appointment?.service?.name || sale.appointment?.rfaiType || 'Venta Manual'}
                      {sale.appointment && <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] uppercase tracking-widest">Consulta Atada</span>}
                    </td>
                    <td className="p-4">
                      {sale.status === 'COMPLETED' ? (
                        <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600">Cobrado</span>
                      ) : (
                        <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-600">Pendiente</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-black text-lg text-[#00A89C]">
                      ${sale.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditSale(sale)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar Venta"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(sale.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar Venta"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">No hay ventas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh] animate-fade-in animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0 rounded-t-3xl">
              <h2 className="text-xl font-black text-slate-800">{editingId ? 'Editar Venta' : 'Nueva Venta Directa'}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto p-6 flex-1 rounded-b-3xl script-scrollbar">
              <form onSubmit={handleSave} className="space-y-5">
              
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cliente Inscrito</label>
                 <div className="relative">
                    <button type="button" onClick={() => setShowClientDrop(!showClientDrop)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between text-slate-700 outline-none focus:border-[#00A89C]">
                       <span className="truncate">{userId ? (users.find(u => u.id === userId)?.name || users.find(u => u.id === userId)?.profile?.firstName + ' ' + (users.find(u => u.id === userId)?.profile?.lastName||'')) : 'Buscar paciente...'}</span>
                       <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                    
                    {showClientDrop && (
                       <div className="absolute top-full mt-1 left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl z-[150] overflow-hidden flex flex-col max-h-48">
                          <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
                            <input type="text" autoFocus placeholder="Escribe para filtrar..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#00A89C] font-semibold" />
                          </div>
                          <div className="overflow-y-auto w-full custom-scrollbar">
                             {users.filter(u => u.role !== 'ADMIN' && u.role !== 'COORDINATOR' && u.role !== 'SPECIALIST').filter(c => {
    const term = clientSearch.toLowerCase();
    return (c.name || '').toLowerCase().includes(term) || 
           (c.email || '').toLowerCase().includes(term) || 
           (c.profile?.documentId || '').toLowerCase().includes(term) || 
           (c.phone || '').includes(term);
}).slice(0, 30).map(c => (
                                <button type="button" key={c.id} onClick={() => { setUserId(c.id); setShowClientDrop(false); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-[#00A89C]/10 hover:text-[#00A89C] transition-colors border-b border-slate-50 last:border-0 hover:z-10 relative">
                                   {c.name || (c.profile?.firstName + ' ' + (c.profile?.lastName||''))} <span className="text-xs text-slate-400 opacity-70">({c.email})</span>
                                </button>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Servicios</label>
                <select 
                  value={concept} 
                  onChange={handleConceptChange} 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A89C]/20 focus:border-[#00A89C] transition-all font-medium text-slate-700 bg-white"
                >
                  <option value="">-- Seleccionar Ítem --</option>
                  
                  {concept && 
                   !catalog.services?.some((s:any) => s.name === concept) &&
                   !catalog.programs?.some((p:any) => p.title === concept) &&
                   !catalog.treatments?.some((t:any) => t.name === concept) &&
                   !catalog.courses?.some((c:any) => c.title === concept) &&
                   !catalog.products?.some((p:any) => p.name === concept) &&
                   concept !== 'Servicio Opcional' && (
                     <optgroup label="Registro Original / Histórico">
                        <option value={concept}>{concept}</option>
                     </optgroup>
                  )}
                  
                  {catalog.services?.filter((s:any) => s.isActive !== false).length > 0 && (
                     <optgroup label="Consultas y Tratamientos">
                        {catalog.services.filter((s:any) => s.isActive !== false).map((s:any) => <option key={s.id} value={s.name}>{s.name} (${s.price})</option>)}
                     </optgroup>
                  )}
                  
                  {catalog.programs?.length > 0 && (
                     <optgroup label="Programas">
                        {catalog.programs.map((p:any) => <option key={p.id} value={p.title}>{p.title} (${p.price})</option>)}
                     </optgroup>
                  )}
                  
                  {catalog.treatments?.filter((p:any) => p.isActive !== false).length > 0 && (
                     <optgroup label="Tratamientos">
                        {catalog.treatments.filter((p:any) => p.isActive !== false).map((p:any) => <option key={p.id} value={p.name}>{p.name} (${p.price})</option>)}
                     </optgroup>
                  )}
                  
                  {catalog.courses?.filter((c:any) => c.isActive !== false).length > 0 && (
                     <optgroup label="Cursos Oficiales">
                        {catalog.courses.filter((c:any) => c.isActive !== false).map((c:any) => <option key={c.id} value={c.title}>{c.title} (${c.price})</option>)}
                     </optgroup>
                  )}
                  
                  {catalog.products?.length > 0 && (
                     <optgroup label="Bodega / Inventario">
                        {catalog.products.map((p:any) => <option key={p.id} value={p.name}>{p.name} (${p.price})</option>)}
                     </optgroup>
                  )}
                  
                  <optgroup label="Otros">
                    <option value="Servicio Opcional">Servicio Opcional</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Monto ($)</label>
                  <input 
                    type="number" 
                    required
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    placeholder="25000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A89C]/20 focus:border-[#00A89C] transition-all font-black text-slate-800 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Método</label>
                  <select 
                    value={paymentMethod} 
                    onChange={e => setPaymentMethod(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-white font-bold text-slate-700"
                  >
                    <option value="TRANSFER">Transferencia</option>
                    <option value="CASH">Efectivo</option>
                    <option value="DEBIT">Tarjeta Débito</option>
                    <option value="CREDIT">Tarjeta Crédito</option>
                    <option value="GATEWAY">Pasarela Web</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Estado Cobranza</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="status" value="COMPLETED" checked={status === 'COMPLETED'} onChange={() => setStatus('COMPLETED')} className="peer sr-only" />
                    <div className="p-3 text-center rounded-xl border border-slate-200 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 font-bold transition-all text-sm">
                      Cobrado y Completado
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="status" value="PENDING" checked={status === 'PENDING'} onChange={() => setStatus('PENDING')} className="peer sr-only" />
                    <div className="p-3 text-center rounded-xl border border-slate-200 peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700 font-bold transition-all text-sm">
                      Pendiente / Deuda
                    </div>
                  </label>
                </div>
              </div>

              {requiresScheduling && (
                <div className="bg-[#00A89C]/5 border border-[#00A89C]/20 rounded-2xl p-4 space-y-4">
                  <h3 className="text-xs font-black text-[#00A89C] uppercase tracking-widest flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Agendamiento Requerido
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Fecha Sesión</label>
                      <input type="date" required value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#00A89C]/20 font-semibold text-slate-700 focus:ring-2 focus:ring-[#00A89C]/30 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Hora</label>
                      <input type="time" required value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#00A89C]/20 font-semibold text-slate-700 focus:ring-2 focus:ring-[#00A89C]/30 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
                <button type="submit" className="flex-[2] bg-[#00A89C] hover:bg-[#00968b] text-white px-4 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                  Guardar Transacción
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

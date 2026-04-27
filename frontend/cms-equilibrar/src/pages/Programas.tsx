import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Plus, Edit2, Trash2, Search, Dumbbell, Save, ArrowLeft, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { UniversalContentBuilder } from '../components/UniversalContentBuilder';

export function Programas() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Replaced Modal with Inline UI
  const [isEditing, setIsEditing] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]);
  const [formData, setFormData] = useState({ 
     id: '', profile: '', title: '', description: '', price: '', 
     agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[], modules: [] as any[] }))
  });

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
       axios.get('/api/master/rfai-programs'),
       axios.get('/api/data/services')
    ])
      .then(([resProgs, resServs]) => {
         setPrograms(resProgs.data);
         setAvailableServices(resServs.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    try {
      const payload = { 
         ...formData,
         profile: formData.profile || formData.title.replace(/\s+/g, ''),
         price: Number(formData.price) || 0,
         agendaWeeks: formData.agendaWeeks.map(aw => ({
            ...aw,
            modules: (aw.modules || []).map((m, i) => ({...m, order: i+1}))
         }))
      };
      if (formData.id) {
        await axios.put(`/api/master/rfai-programs/${formData.id}`, payload);
      } else {
        await axios.post('/api/master/rfai-programs', payload);
      }
      setIsEditing(false);
      fetchAll();
    } catch (error) {
      console.error(error);
      alert('Error guardando programa RFAI');
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('¿Eliminar permanente esta plantilla de RFAI?')) return;
    try {
      await axios.delete(`/api/master/rfai-programs/${id}`);
      fetchAll();
    } catch (error) {
       alert('Error eliminando programa');
    }
  };

  const toggleServiceInWeek = (wIdx: number, srvId: string) => {
    setFormData(prev => {
       const nw = [...prev.agendaWeeks];
       const week = {...nw[wIdx]};
       if(week.serviceIds.includes(srvId)) week.serviceIds = week.serviceIds.filter(id => id !== srvId);
       else week.serviceIds = [...week.serviceIds, srvId];
       nw[wIdx] = week;
       return { ...prev, agendaWeeks: nw };
    });
  };

  const addAgendaWeek = () => {
     setFormData(prev => ({
        ...prev,
        agendaWeeks: [...prev.agendaWeeks, { weekNumber: prev.agendaWeeks.length > 0 ? prev.agendaWeeks[prev.agendaWeeks.length-1].weekNumber + 1 : 1, serviceIds: [], modules: [] }]
     }));
     setExpandedWeeks(prev => [...prev, formData.agendaWeeks.length]);
  }

  const removeAgendaWeek = (idx: number) => {
     if(!window.confirm('¿Eliminar esta semana con todos sus contenidos?')) return;
     setFormData(prev => ({
        ...prev,
        agendaWeeks: prev.agendaWeeks.filter((_, i) => i !== idx).map((w, i) => ({ ...w, weekNumber: i + 1 }))
     }));
     setExpandedWeeks(prev => prev.filter(i => i !== idx).map(i => i > idx ? i - 1 : i));
  }

  const toggleWeek = (wIdx: number) => {
     setExpandedWeeks(prev => prev.includes(wIdx) ? prev.filter(i => i !== wIdx) : [...prev, wIdx]);
  }

  const filtered = programs.filter(p => (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()));



  // ----- MAIN VIEW -----
  if (!isEditing) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
        <header className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center">
              <Dumbbell className="w-8 h-8 mr-3 text-[#00A89C]" />
              Programas RFAI
            </h1>
            <p className="text-slate-500 mt-2">Plataformas restrictivas de 4 semanas de duración. Combine recursos, ejercicios y autoevaluaciones.</p>
          </div>
          <button 
            onClick={() => { setFormData({ id: '', profile: '', title: '', description: '', price: '', agendaWeeks: [{ weekNumber: 1, serviceIds: [], modules: [] }] }); setIsEditing(true); }}
            className="bg-[#00A89C] hover:bg-[#009287] text-white px-5 py-2.5 rounded-xl font-bold flex items-center shrink-0 whitespace-nowrap shadow-lg shadow-[#00A89C]/20 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> Nuevo Programa
          </button>
        </header>

        <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="Buscar programas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#00A89C] focus:ring-1 focus:ring-[#00A89C]"
              />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Matrices</span>
          </div>

          <div className="flex-1 overflow-auto p-4 bg-slate-50/50">
            {loading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 sticky top-0 z-10">
                    <th className="p-4 font-bold">Programa</th>
                    <th className="p-4 font-bold">Descripción</th>
                    <th className="p-4 font-bold">Detalle</th>
                    <th className="p-4 font-bold">Valor</th>
                    <th className="p-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                   {filtered.map(prog => (
                     <tr key={prog.id} className="border-b border-slate-50 hover:bg-white transition-colors">
                       <td className="p-4">
                          <span className="inline-block px-2 py-0.5 bg-[#00A89C]/10 text-[#00A89C] font-black uppercase text-[9px] tracking-widest rounded mb-1">
                             {prog.profile}
                          </span>
                          <div className="font-bold text-slate-800 text-sm tracking-tight">{prog.title}</div>
                       </td>
                       <td className="p-4 text-sm text-slate-500 max-w-xs truncate">
                          {prog.description || 'Sin descripción'}
                       </td>
                       <td className="p-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 mr-2">
                             4 Fases
                          </span>
                          <span className="text-xs font-semibold text-slate-600 border border-slate-100 px-2 py-1 rounded bg-slate-50">
                             {prog.services?.length || 0} Clínica
                          </span>
                       </td>
                       <td className="p-4 font-semibold text-emerald-600">
                          ${(prog.price || 0).toLocaleString()}
                       </td>
                       <td className="p-4 text-right space-x-2">
                          <button onClick={() => { 
                           const weeksFromServices = (prog.services || []).map((s:any) => s.weekNumber || 1);
                           const weeksFromModules = (prog.modules || []).map((m:any) => m.weekNumber || 1);
                           const maxW = Math.max(1, ...weeksFromServices, ...weeksFromModules);
                           const aw = Array.from({length: maxW}, (_, i) => {
                               const wNum = i + 1;
                               return { 
                                   weekNumber: wNum, 
                                   serviceIds: (prog.services || []).filter((s:any) => (s.weekNumber || 1) === wNum).map((s:any) => s.serviceId || s.agendaServiceId),
                                   modules: (prog.modules || []).filter((m:any) => m.weekNumber === wNum)
                               };
                           });
                           setFormData({ id: prog.id, profile: prog.profile, title: prog.title, description: prog.description || '', price: prog.price?.toString() || '', agendaWeeks: aw }); 
                             setIsEditing(true); 
                          }} className="p-2 text-slate-400 hover:text-[#00A89C] hover:bg-[#00A89C]/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(prog.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                   {filtered.length === 0 && (
                      <tr>
                       <td colSpan={5} className="p-16 text-center text-slate-400 font-bold bg-transparent border-0">
                            <Dumbbell className="w-12 h-12 text-slate-200 mx-auto mb-4" /> No hay programas alojados.
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

  // ----- EDITOR VIEW -----
  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button onClick={() => setIsEditing(false)} className="p-2 mr-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><ArrowLeft className="w-6 h-6"/></button>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Gestión de Contenidos</h1>
            <p className="text-slate-500 text-sm">Administra los recursos, ejercicios y evaluaciones por programa y semana.</p>
          </div>
        </div>
        <button onClick={() => handleSave()} className="bg-[#00A89C] hover:bg-[#009287] text-white px-6 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-[#00A89C]/20 transition-all">
          <Save className="w-5 h-5 mr-2" /> Guardar Cambios
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-5 mb-6 flex flex-col gap-4">
        <div>
           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre Comercial</label>
           <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 font-semibold focus:outline-none focus:border-[#00A89C]" placeholder="Ej: Programa de Ansiedad Completo" />
        </div>
        <div>
           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción (Objetivos)</label>
           <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#00A89C]" placeholder="Describe los objetivos y detalles..."></textarea>
        </div>
        <div>
           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Valor Fijo ($)</label>
           <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white border border-slate-200 text-[#00A89C] rounded-xl px-4 py-3 font-black focus:outline-none focus:border-[#00A89C] shadow-inner" placeholder="Ej: 290000" />
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
         <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/30">
               <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="font-black text-slate-800 text-base">Temario Semanal</h3>
                    <p className="text-xs font-semibold text-slate-400">Videos, Audios, Textos y Consultas Médicas</p>
                  </div>
                  <button type="button" onClick={addAgendaWeek} className="bg-slate-800 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors">+ Añadir Semana</button>
               </div>
            </div>
            
            <div className="p-6 bg-slate-50/50 space-y-6">
               {formData.agendaWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="bg-white border border-slate-200 rounded-2xl shadow-sm relative group overflow-hidden">
                     <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleWeek(wIdx)}>
                       <div className="flex flex-col">
                         <div className="text-xs font-black uppercase tracking-widest text-[#00A89C] flex items-center">
                            <span className="w-5 h-5 rounded bg-[#00A89C]/10 flex items-center justify-center mr-2">W</span> Semana {week.weekNumber}
                         </div>
                         <div className="text-[10px] text-slate-400 font-bold mt-1 ml-7">
                            {week.modules?.length || 0} recursos • {week.serviceIds?.length || 0} turnos
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <button type="button" onClick={(e) => { e.stopPropagation(); removeAgendaWeek(wIdx); }} className="text-red-400 hover:text-red-600 bg-white shadow-sm border border-slate-100 hover:bg-red-50 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all flex items-center">
                            <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                         </button>
                         <div className="p-1 bg-white rounded-md border border-slate-200 shadow-sm">
                           {expandedWeeks.includes(wIdx) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                         </div>
                       </div>
                     </div>

                     {expandedWeeks.includes(wIdx) && (
                        <div className="p-5 space-y-6">
                           <div>
                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Consumo de Consultas</label>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                               {availableServices.map(srv => {
                                  const isSel = week.serviceIds.includes(srv.id);
                                  return (
                                     <label key={srv.id} className={`flex items-center px-3 py-2 rounded-xl border cursor-pointer transition-all ${isSel ? 'bg-[#00A89C]/5 border-[#00A89C]/30 shadow-[0_2px_10px_rgba(0,168,156,0.05)]' : 'bg-white border-slate-100/80 hover:bg-slate-50'}`}>
                                        <input type="checkbox" className="mr-3 w-4 h-4 accent-[#00A89C] rounded border-slate-300" checked={isSel} onChange={() => toggleServiceInWeek(wIdx, srv.id)} />
                                        <span className={`text-[11px] flex-1 font-bold ${isSel ? 'text-slate-800' : 'text-slate-500'}`}>{srv.name}</span>
                                     </label>
                                  );
                               })}
                             </div>
                           </div>

                           <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                             <h3 className="font-black text-slate-800 text-xs flex items-center mb-4 uppercase tracking-widest"><Layers className="w-4 h-4 mr-2 text-[#00A89C]" /> Contenidos de la Semana</h3>
                             <UniversalContentBuilder 
                                modules={week.modules || []} 
                                onChange={(modules: any[]) => {
                                   const nw = [...formData.agendaWeeks];
                                   nw[wIdx].modules = modules;
                                   setFormData({...formData, agendaWeeks: nw});
                                }} 
                                accentColor="#00A89C"
                             />
                           </div>
                        </div>
                     )}
                  </div>
               ))}
               {formData.agendaWeeks.length === 0 && <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">Sin semanas clínicas provistas</div>}
            </div>

            <div className="p-6 border-t border-slate-100 shrink-0 bg-white flex justify-end gap-3 rounded-b-3xl">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
              <button onClick={() => handleSave()} className="px-8 py-2.5 bg-[#00A89C] text-white font-black rounded-xl shadow-lg shadow-[#00A89C]/20 hover:bg-[#009287] active:scale-[0.98] transition-all flex items-center">
                 <Save className="w-5 h-5 mr-2"/> Guardar Cambios
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

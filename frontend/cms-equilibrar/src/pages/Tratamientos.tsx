import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, HeartPulse, Save, ArrowLeft, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { UniversalContentBuilder } from '../components/UniversalContentBuilder';

export function Tratamientos() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Replaced Modal with Inline UI
  const [isEditing, setIsEditing] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]);
  const [formData, setFormData] = useState({ 
     id: '', name: '', description: '', price: 0, 
     agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[], modules: [] as any[] })) 
  });

  const fetchAll = () => {
    Promise.all([
       axios.get('/api/master/treatments'),
       axios.get('/api/data/services')
    ])
      .then(([resProgs, resServs]) => {
         setTreatments(resProgs.data);
         setAvailableServices(resServs.data);
      })
      .catch((err) => {
         console.error('Error fetching treatments', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
         ...formData,
         price: Number(formData.price) || 0,
         agendaWeeks: formData.agendaWeeks.map(aw => ({
            ...aw,
            modules: (aw.modules || []).map((m, i) => ({...m, order: i+1}))
         }))
      };
      if (isEditing) {
        await axios.put(`/api/master/treatments/${formData.id}`, payload);
      } else {
        await axios.post('/api/master/treatments', payload);
      }
      setIsEditing(false);
      fetchAll();
    } catch (error) {
      console.error(error);
      alert('Error guardando tratamiento');
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('¿Eliminar permanente este Tratamiento Global?')) return;
    try {
      await axios.delete(`/api/master/treatments/${id}`);
      fetchAll();
    } catch (error) {
       alert('Error eliminando tratamiento');
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

  const toggleActive = async (id: string, currentVal: boolean) => {
    try {
      await axios.patch(`/api/master/treatments/${id}/toggle`, { isActive: !currentVal });
      setTreatments(prev => prev.map(t => t.id === id ? { ...t, isActive: !currentVal } : t));
    } catch (e) {
      alert('Error updating status');
    }
  };

  const filteredTreatments = treatments.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isEditing) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Layers className="w-8 h-8 mr-3 text-emerald-500" />
            Constructor de Tratamientos
          </h1>
          <p className="text-slate-500 mt-2">Fusione Servicios Clínicos con Recursos Bibliográficos (PDFs interactivos o Documentos) en macro-programas.</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: '', name: '', description: '', price: 0, agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[], modules: [] as any[] })) }); setIsEditing(true); }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shrink-0 whitespace-nowrap shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Nuevo Tratamiento
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar Tratamientos..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredTreatments.length} Registros</span>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 bg-white sticky top-0 z-10">
                  <th className="p-4 font-bold">Tratamiento</th>
                  <th className="p-4 font-bold">Descripción</th>
                  <th className="p-4 font-bold">Detalle</th>
                  <th className="p-4 font-bold">Valor</th>
                  <th className="p-4 font-bold text-center">Estado</th>
                  <th className="p-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTreatments.map(prog => (
                  <tr key={prog.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-bold text-slate-800">
                       {prog.name}
                    </td>
                    <td className="p-4 text-sm text-slate-500 max-w-xs truncate">
                       {prog.description || '-'}
                    </td>
                    <td className="p-4">
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-200 px-2 py-1 rounded w-max">
                          {prog.contents?.length || 0} Fases / {prog.services?.length || 0} Servicios
                       </div>
                    </td>
                    <td className="p-4 font-semibold text-emerald-600">
                       ${(prog.price || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleActive(prog.id, prog.isActive !== false)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${prog.isActive !== false ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {prog.isActive !== false ? 'Activo' : 'Pausado'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                       <button onClick={() => { 
                          
                           const weeksMap = new Map<number, string[]>();
                           (prog.services || []).forEach((s:any) => {
                               const wNum = s.weekNumber || 1;
                               const sId = s.serviceId || s.agendaServiceId;
                               if(!weeksMap.has(wNum)) weeksMap.set(wNum, []);
                               weeksMap.get(wNum)!.push(sId);
                           });
                           const maxW = Math.max(4, ...Array.from(weeksMap.keys()));
                           const aw = Array.from({length: maxW}, (_, i) => ({ 
                               weekNumber: i + 1, 
                               serviceIds: weeksMap.get(i+1) || [],
                               modules: (prog.modules || []).filter((m:any) => m.weekNumber === i + 1)
                           }));
                           setFormData({ 
                             id: prog.id, name: prog.name, description: prog.description, price: prog.price, 
                             agendaWeeks: aw
                          }); 
                          setIsEditing(true); 
                       }} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(prog.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {filteredTreatments.length === 0 && (
                   <tr>
                      <td colSpan={5} className="p-16 text-center text-slate-400 font-bold">
                         <Layers className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                         No hay Tratamientos matriculados
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

  return (
    <div className="max-w-7xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center">
          <button onClick={() => setIsEditing(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all mr-4 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center">
              {formData.id ? 'Configurador de Tratamiento' : 'Constructor de Tratamiento'}
            </h1>
            <p className="text-slate-500 mt-2">Conecte los hilos entre los recursos de lectura y las horas presenciales de los médicos.</p>
          </div>
        </div>
        <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 transition-all flex items-center">
          <Save className="w-5 h-5 mr-2" /> Guardar Cambios
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-8 bg-slate-50/50 max-w-4xl mx-auto w-full">
               <div className="space-y-6">
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest border-b border-slate-200 pb-2">Identidad Visual</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre Comercial</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 font-semibold focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción (Objetivos)</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Valor Fijo ($)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white border border-slate-200 text-emerald-600 rounded-xl px-4 py-3 font-black focus:outline-none focus:border-emerald-500 shadow-inner" />
                  </div>

                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mt-8">
                     <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Temario Semanal</h3>
                     <button type="button" onClick={addAgendaWeek} className="bg-slate-800 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors">+ Añadir Semana</button>
                  </div>
                  <div className="space-y-6 mt-4">
                     {formData.agendaWeeks.map((week, wIdx) => (
                        <div key={wIdx} className="bg-white border border-slate-200 rounded-2xl shadow-sm relative group overflow-hidden">
                           <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleWeek(wIdx)}>
                             <div className="flex flex-col">
                               <div className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center">
                                  <span className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center mr-2">W</span> Semana {week.weekNumber}
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
                                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Consumo de Consultas</label>
                                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                     {availableServices.map(srv => {
                                        const isSel = week.serviceIds.includes(srv.id);
                                        return (
                                           <label key={srv.id} className={`flex items-center px-3 py-2 rounded-xl border cursor-pointer transition-all ${isSel ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_2px_10px_rgba(16,185,129,0.05)]' : 'bg-white border-slate-100/80 hover:bg-slate-50'}`}>
                                              <input type="checkbox" className="mr-3 w-4 h-4 accent-emerald-500 rounded border-slate-300" checked={isSel} onChange={() => toggleServiceInWeek(wIdx, srv.id)} />
                                              <span className={`text-[11px] flex-1 font-bold ${isSel ? 'text-slate-800' : 'text-slate-500'}`}>{srv.name}</span>
                                           </label>
                                        );
                                     })}
                                   </div>
                                 </div>

                                 <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                                   <h3 className="font-black text-slate-800 text-xs flex items-center mb-4 uppercase tracking-widest"><Layers className="w-4 h-4 mr-2 text-emerald-500" /> Contenidos de la Semana</h3>
                                   <UniversalContentBuilder 
                                      modules={week.modules || []} 
                                      onChange={(modules: any[]) => {
                                         const nw = [...formData.agendaWeeks];
                                         nw[wIdx].modules = modules;
                                         setFormData({...formData, agendaWeeks: nw});
                                      }} 
                                      accentColor="#10b981"
                                   />
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                     {formData.agendaWeeks.length === 0 && <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Sin semanas clínicas provistas</div>}
                  </div>
               </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-10">
          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-8 py-2.5 bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 transition-all flex items-center">
             <Save className="w-5 h-5 mr-2" /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

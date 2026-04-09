import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, Briefcase } from 'lucide-react';

export function Servicios() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Auxiliary Data States
  const [branches, setBranches] = useState<any[]>([]);
  const [specialists, setSpecialists] = useState<any[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', description: '', duration: 60, price: 0, branchId: '', specialistId: '' });

  const fetchData = async () => {
    try {
       const [srvRes, branchRes, usersRes] = await Promise.all([
          axios.get('/api/data/services'),
          axios.get('/api/master/branches'),
          axios.get('/api/data/users')
       ]);
       setServices(srvRes.data);
       setBranches(branchRes.data);
       setSpecialists(usersRes.data.filter((u: any) => u.role && ['SPECIALIST', 'ADMIN'].includes(u.role.toUpperCase())));
    } catch(err) {
       console.error(err);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/data/services/${formData.id}`, formData);
      } else {
        await axios.post('/api/data/services', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error guardando servicio');
    }
  };

  const handleDelete = async (id: number) => {
    if(!window.confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`/api/data/services/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error eliminando servicio');
    }
  };

  const toggleActive = async (id: string, currentVal: boolean) => {
    try {
      await axios.patch(`/api/data/services/${id}/toggle`, { isActive: !currentVal });
      setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !currentVal } : s));
    } catch (e) {
      alert('Error updating status');
    }
  };

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-[#00A89C]" />
            Directorio de Consultas
          </h1>
          <p className="text-slate-500 mt-2">Gestione las consultas clínicas ofertables en la agenda.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', description: '', duration: 60, price: 0, branchId: '', specialistId: '' }); setShowModal(true); }}
          className="bg-[#00A89C] hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-[#00A89C]/20 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Nueva Consulta
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar consulta por nombre..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A89C]/20"
            />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredServices.length} Registros</span>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 bg-white sticky top-0 z-10">
                  <th className="p-4 font-bold">Consulta</th>
                  <th className="p-4 font-bold">Especialista</th>
                  <th className="p-4 font-bold">Sede</th>
                  <th className="p-4 font-bold">Detalle</th>
                  <th className="p-4 font-bold">Valor</th>
                  <th className="p-4 font-bold text-center">Estado</th>
                  <th className="p-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(service => (
                  <tr key={service.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{service.name}</td>
                    <td className="p-4 text-sm font-semibold text-slate-600 line-clamp-1 truncate block mt-2 border-b-0">
                       {service.specialist ? (`${service.specialist.profile?.firstName || ''} ${service.specialist.profile?.lastName || ''}`.trim() || service.specialist.name || service.specialist.email) : 'Sin Asignar'}
                    </td>
                    <td className="p-4 text-xs font-bold text-emerald-600 uppercase tracking-widest">{service.branch?.name || 'No Definida'}</td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{service.duration} mins</td>
                    <td className="p-4 text-sm font-black text-[#00A89C] border-l border-slate-100">${service.price?.toLocaleString() || 0}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleActive(service.id, service.isActive !== false)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${service.isActive !== false ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {service.isActive !== false ? 'Activo' : 'Pausado'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                       <button onClick={() => { setFormData(service); setIsEditing(true); setShowModal(true); }} className="p-2 text-slate-400 hover:text-[#00A89C] hover:bg-[#00A89C]/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6">{isEditing ? 'Editar Consulta' : 'Nueva Consulta'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre de la Consulta</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00A89C]" placeholder="Ej. Sesión Psicológica Inicial" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Especialista a Cargo</label>
                  <select required value={formData.specialistId || ''} onChange={e => setFormData({...formData, specialistId: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00A89C] font-semibold text-slate-700 bg-white">
                     <option value="" disabled>Seleccione Experto</option>
                     {specialists.map(sp => {
                        const displayName = `${sp.profile?.firstName || ''} ${sp.profile?.lastName || ''}`.trim() || sp.name || sp.email;
                        return <option key={sp.id} value={sp.id}>{displayName}</option>;
                     })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sede/Locación</label>
                  <select required value={formData.branchId || ''} onChange={e => setFormData({...formData, branchId: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00A89C] font-semibold text-slate-700 bg-white">
                     <option value="" disabled>Seleccione Sede</option>
                     {branches.map(br => (
                        <option key={br.id} value={br.id}>{br.name} ({br.type === 'VIRTUAL' ? 'Online' : 'Física'})</option>
                     ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duración (min)</label>
                  <input type="number" required value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00A89C]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valor ($)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00A89C]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción (Opcional)</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00A89C]" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-[#00A89C] text-white font-bold rounded-xl shadow-lg shadow-[#00A89C]/20 hover:bg-emerald-500 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

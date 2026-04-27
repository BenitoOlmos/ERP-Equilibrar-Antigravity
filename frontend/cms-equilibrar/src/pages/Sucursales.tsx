import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Plus, Edit2, Trash2, Search, MapPin, Save, ArrowLeft, Video, Building2 } from 'lucide-react';

export function Sucursales() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
     id: '', name: '', type: 'PHYSICAL', address: '', contactName: '', phone: '', meetLink: '', isActive: true
  });

  const fetchBranches = async () => {
    try {
      const { data } = await axios.get('/api/master/branches');
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateNew = () => {
    setFormData({ id: '', name: '', type: 'PHYSICAL', address: '', contactName: '', phone: '', meetLink: '', isActive: true });
    setIsEditing(true);
  };

  const handleEdit = (branch: any) => {
    setFormData(branch);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta sucursal?')) {
      try {
        await axios.delete(`/api/master/branches/${id}`);
        fetchBranches();
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`/api/master/branches/${formData.id}`, formData);
      } else {
        await axios.post(`/api/master/branches`, formData);
      }
      setIsEditing(false);
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Error al guardar la sucursal');
    }
  };

  const filtered = branches.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Cargando Directorio...</div>;

  if (isEditing) {
    return (
      <div className="flex flex-col h-full bg-slate-50/50">
        <div className="flex items-center justify-between mb-8 px-2 max-w-4xl mx-auto w-full">
          <div>
            <button onClick={() => setIsEditing(false)} className="flex items-center text-slate-400 hover:text-slate-600 transition-colors mb-2 font-bold text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver al directorio
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {formData.id ? 'Editar Sucursal' : 'Nueva Sucursal'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Configura los accesos y locaciones de atención</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
             <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-8 bg-slate-50/50">
                <div className="space-y-6">
                   <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest border-b border-slate-200 pb-2">Información Base</h3>
                   <div className="flex gap-4">
                      <div className="flex-[2]">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre Comercial / Sede</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[#008f85] transition-all" placeholder="Ej. Casa Central Providencia" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Formato</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[#008f85] transition-all cursor-pointer">
                           <option value="PHYSICAL">🏢 Presencial / Física</option>
                           <option value="VIRTUAL">💻 Online / Virtual</option>
                        </select>
                      </div>
                   </div>

                   {formData.type === 'VIRTUAL' ? (
                      <div className="mt-8">
                         <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest border-b border-slate-200 pb-2 mb-6 text-blue-600 flex items-center"><Video className="w-4 h-4 mr-2" /> Sala de Conferencias</h3>
                         <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                           <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Enlace de Google Meet / Zoom</label>
                           <input type="url" required value={formData.meetLink} onChange={e => setFormData({...formData, meetLink: e.target.value})} className="w-full bg-white border border-blue-200 text-slate-800 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="https://meet.google.com/xxx-xxxx-xxx" />
                         </div>
                      </div>
                   ) : (
                      <div className="mt-8 space-y-6">
                         <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest border-b border-slate-200 pb-2 mb-6 flex items-center"><Building2 className="w-4 h-4 mr-2 text-slate-400" /> Datos de Localidad</h3>
                         <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dirección Exacta</label>
                            <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-[#008f85] transition-all" placeholder="Av. Providencia 1234, Of 501, Santiago" />
                         </div>
                         <div className="flex gap-4">
                            <div className="flex-1">
                               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre del Anfitrión/Contacto</label>
                               <input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-[#008f85] transition-all" placeholder="Ej. Recepción / Maria" />
                            </div>
                            <div className="flex-1">
                               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Teléfono del Consultorio</label>
                               <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-[#008f85] transition-all" placeholder="+56 9 1234 5678" />
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </div>
             
             <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-10">
               <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
               <button type="submit" className="px-8 py-2.5 bg-[#00A89C] text-white font-black rounded-xl shadow-lg shadow-[#00A89C]/30 hover:bg-[#008f85] transition-all flex items-center">
                 <Save className="w-5 h-5 mr-2" /> Guardar Cambios
               </button>
             </div>
           </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-8 max-w-[1200px] w-full mx-auto relative px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-[#00A89C]" />
            Sucursales
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg leading-relaxed max-w-2xl">
            Administra las sedes físicas y las salas virtuales (Google Meet) para tus servicios.
          </p>
        </div>
        <button 
          onClick={handleCreateNew} 
          className="bg-[#00A89C] hover:bg-[#008f85] text-white px-6 py-3.5 rounded-2xl font-black flex items-center shadow-lg shadow-[#00A89C]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 mr-2" strokeWidth={3} /> Nueva Sucursal
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm flex items-center max-w-md focus-within:ring-2 focus-within:ring-[#00A89C]/20 transition-all">
        <Search className="w-5 h-5 text-slate-400 ml-3" />
        <input 
          type="text" 
          placeholder="Buscar sede o link..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full px-4 py-2 font-semibold text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(branch => (
          <div key={branch.id} className="bg-white border text-left border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl inline-flex shadow-sm ${branch.type === 'VIRTUAL' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-[#00A89C]/10 text-[#00A89C] border border-[#00A89C]/20'}`}>
                {branch.type === 'VIRTUAL' ? <Video className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(branch)} className="p-2 text-slate-400 hover:text-[#00A89C] hover:bg-[#00A89C]/10 rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(branch.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">{branch.name}</h3>
            
            {branch.type === 'VIRTUAL' ? (
               <div className="mt-2 space-y-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-md">Online / Meet</span>
                 <p className="text-sm font-mono text-slate-500 break-all bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">{branch.meetLink}</p>
               </div>
            ) : (
               <div className="mt-2 space-y-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#00A89C] bg-[#00A89C]/10 px-2 py-1 rounded-md">Presencial</span>
                 <p className="text-sm font-medium text-slate-500 mt-2 line-clamp-2">{branch.address}</p>
                 {(branch.contactName || branch.phone) && (
                    <div className="text-xs text-slate-400 font-medium pt-3 border-t border-slate-100 mt-3">
                       {branch.contactName && <span>📞 {branch.contactName}</span>}
                       {branch.contactName && branch.phone && <span> • </span>}
                       {branch.phone && <span>{branch.phone}</span>}
                    </div>
                 )}
               </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-500 font-bold text-lg">No hay sucursales configuradas</h3>
            <p className="text-slate-400 text-sm mt-1">Crea tu primera sede o sala de conferencias.</p>
          </div>
        )}
      </div>
    </div>
  );
}

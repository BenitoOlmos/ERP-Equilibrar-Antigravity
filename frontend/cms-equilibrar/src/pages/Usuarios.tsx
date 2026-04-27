import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Users, Search, Mail, Edit2, Trash2, Plus, ShieldAlert, Smartphone, UserCircle, BriefcaseMedical } from 'lucide-react';

const COLOR_OPTIONS = [
  { value: 'bg-emerald-100 text-emerald-800 border-emerald-400', label: 'Verde', bg: 'bg-emerald-500' },
  { value: 'bg-indigo-100 text-indigo-800 border-indigo-400', label: 'Morado', bg: 'bg-indigo-500' },
  { value: 'bg-blue-100 text-blue-800 border-blue-400', label: 'Azul', bg: 'bg-blue-500' },
  { value: 'bg-amber-100 text-amber-800 border-amber-400', label: 'Naranja', bg: 'bg-amber-500' },
  { value: 'bg-rose-100 text-rose-800 border-rose-400', label: 'Rosa', bg: 'bg-rose-500' },
  { value: 'bg-teal-100 text-teal-800 border-teal-400', label: 'Turquesa', bg: 'bg-teal-500' },
  { value: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-400', label: 'Fucsia', bg: 'bg-fuchsia-500' },
  { value: 'bg-slate-100 text-slate-800 border-slate-400', label: 'Gris', bg: 'bg-slate-500' }
];

export function Usuarios() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '', firstName: '', lastName: '', email: '', phone: '', role: 'Cliente', password: '',
    documentId: '', address: '', commune: '', healthSystem: '', complementaryInsurance: '',
    observations: '', emergencyPhone: '', emergencyContactName: '', birthDate: '', medicalRecordLink: '', color: ''
  });

  const fetchUsers = () => {
    setLoading(true);
    axios.get('/api/data/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/data/users/${formData.id}`, formData);
      } else {
        await axios.post('/api/data/users', formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || 'Error guardando usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('¿Estás seguro de que deseas eliminar permanentemente a este usuario y todos sus registros asociados?')) return;
    try {
       await axios.delete(`/api/data/users/${id}`);
       fetchUsers();
    } catch (error) {
       console.error(error);
       alert('Error eliminando usuario.');
    }
  };

  const openCreateModal = () => {
     setIsEditing(false);
     setFormData({ 
       id: '', firstName: '', lastName: '', email: '', phone: '', role: 'Cliente', password: '',
       documentId: '', address: '', commune: '', healthSystem: '', complementaryInsurance: '',
       observations: '', emergencyPhone: '', emergencyContactName: '', birthDate: '', medicalRecordLink: '', color: ''
     });
     setShowModal(true);
  };

  const openEditModal = (user: any) => {
     setIsEditing(true);
     setFormData({
        id: user.id,
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'Cliente',
        password: '', // Don't fill password on edit
        documentId: user.profile?.documentId || '',
        address: user.profile?.address || '',
        commune: user.profile?.commune || '',
        healthSystem: user.profile?.healthSystem || '',
        complementaryInsurance: user.profile?.complementaryInsurance || '',
        observations: user.profile?.observations || '',
        emergencyPhone: user.profile?.emergencyPhone || '',
        emergencyContactName: user.profile?.emergencyContactName || '',
        birthDate: user.profile?.birthDate || '',
        medicalRecordLink: user.profile?.medicalRecordLink || '',
        color: user.profile?.color || ''
     });
     setShowModal(true);
  };

  const roles = [
    { id: 'ALL', label: 'Todos' },
    { id: 'Super Admin', label: 'Super Admins' },
    { id: 'Administrador', label: 'Administradores' },
    { id: 'Coordinador', label: 'Coordinadores' },
    { id: 'Especialista', label: 'Especialistas' },
    { id: 'Cliente', label: 'Clientes' }
  ];

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'Super Admin': return <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-600 border border-red-200 shadow-sm">Super Admin</span>;
      case 'Administrador': return <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 border border-orange-200 shadow-sm">Admin</span>;
      case 'Coordinador': return <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600 border border-blue-200 shadow-sm">Coordinador</span>;
      case 'Especialista': return <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-600 border border-purple-200 shadow-sm">Especialista</span>;
      case 'Cliente': return <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#00A89C]/20 text-[#00A89C] border border-[#00A89C]/30 shadow-sm">Cliente</span>;
      default: return <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">{role || 'Desconocido'}</span>;
    }
  };

  const getRoleIcon = (role: string) => {
     switch(role) {
        case 'Super Admin': return <ShieldAlert className="w-4 h-4 text-red-600" />;
        case 'Administrador': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
        case 'Coordinador': return <BriefcaseMedical className="w-4 h-4 text-blue-500" />;
        case 'Especialista': return <BriefcaseMedical className="w-4 h-4 text-purple-500" />;
        default: return <UserCircle className="w-4 h-4 text-slate-400" />;
     }
  }

  const filteredUsers = users.filter(u => {
    const fullName = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.toLowerCase();
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(searchLow) || u.email.toLowerCase().includes(searchLow) || (u.phone || '').includes(searchLow) || (u.profile?.documentId || '').includes(searchLow);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col pb-6">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-[#00A89C]" />
            Control de Usuarios CRM
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Administra jerarquías transversales en todo el Ecosistema Equilibrar y gestiona Fichas Clínicas.</p>
        </div>
        <button onClick={openCreateModal} className="bg-[#00A89C] hover:bg-[#009287] text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-[#00A89C]/20 transition-all">
          <Plus className="w-5 h-5 mr-2" /> Añadir Usuario
        </button>
      </header>

      {/* Tabs / Pills Navigation */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
         {roles.map(r => (
            <button 
               key={r.id} 
               onClick={() => setRoleFilter(r.id)}
               className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${roleFilter === r.id ? 'bg-[#00A89C] text-white border-[#00A89C] shadow-md shadow-[#00A89C]/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
            >
               {r.label}
               <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-black ${roleFilter === r.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {r.id === 'ALL' ? users.length : users.filter(usr => usr.role === r.id).length}
               </span>
            </button>
         ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
           <div className="relative w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Filtrar por Nombre, Email, Teléfono o RUT..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-[#00A89C] focus:ring-1 focus:ring-[#00A89C]"
             />
           </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50/30">
          {loading ? (
             <div className="flex justify-center items-center h-full"><div className="w-10 h-10 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 shadow-sm border-b border-slate-200">
                <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6 font-bold w-1/3">Identificación CRM</th>
                  <th className="p-4 font-bold">Jerarquía</th>
                  <th className="p-4 font-bold">Contacto</th>
                  <th className="p-4 font-bold text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                     <td colSpan={4} className="text-center py-20 text-slate-400 font-bold">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-300" />
                        No se encontraron usuarios bajo este cruce de filtros.
                     </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group bg-white">
                      <td className="p-4 pl-6">
                        <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-200 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                              {getRoleIcon(user.role)}
                           </div>
                           <div>
                              <div className="font-extrabold text-slate-800 text-sm">{user.profile?.firstName || user.name || 'Usuario'} {user.profile?.lastName || ''}</div>
                              <div className="flex items-center mt-1 text-[10px] font-bold text-slate-400 space-x-2">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-mono">ID: {user.id.substring(0,6)}</span>
                                {user.phone && <span className="flex items-center"><Smartphone className="w-3 h-3 mr-0.5"/> {user.phone}</span>}
                              </div>
                           </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-600">
                        <div className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {user.email}</div>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openEditModal(user)} className="p-2 text-slate-400 hover:text-[#00A89C] hover:bg-[#00A89C]/10 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                         {(user.role !== 'Super Admin' || filteredUsers.filter(u=>u.role==='Super Admin').length > 1) && (
                            <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                         )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CRUD / EXTENDED MEDICAL PROFILE MODAL */}
      {showModal && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
               <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-[#00A89C]/10 text-[#00A89C] rounded-2xl flex items-center justify-center border border-[#00A89C]/20">
                        <Users className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-800 leading-tight">{isEditing ? 'Gestión de Ficha de Usuario' : 'Forjar Nuevo Perfil'}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Carga Clínica Multidimensional</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Abortar</button>
                     <button onClick={handleSave} className="px-5 py-2.5 bg-[#00A89C] hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-[#00A89C]/30 transition-all">Consolidar Perfil</button>
                  </div>
               </div>
               
               <div className="space-y-8">
                  {/* SECCIÓN 1: Credenciales Base */}
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Credenciales Base & Acceso</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nivel de Dominio (Rol)</label>
                           <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-[#00A89C] outline-none focus:border-[#00A89C] shadow-sm cursor-pointer">
                              {roles.filter(r => r.id !== 'ALL').map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                           </select>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico (Login)</label>
                           <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombres</label>
                           <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Apellidos</label>
                           <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" />
                        </div>
                     </div>
                     <div className="mt-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña (Sobrescritura)</label>
                        <input type="text" placeholder={isEditing ? "Dejar en blanco para mantener la clave actual" : "Contraseña inicial (Ej: 123456)"} required={!isEditing} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm placeholder:text-slate-300" />
                     </div>

                     {formData.role === 'Especialista' && (
                        <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Color del Especialista en Agenda</label>
                           <div className="flex flex-wrap gap-3">
                              {COLOR_OPTIONS.map(c => (
                                 <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setFormData({...formData, color: c.value})}
                                    className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm flex items-center justify-center ${
                                       formData.color === c.value ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                                    } ${c.bg}`}
                                    title={c.label}
                                 >
                                    {formData.color === c.value && <div className="w-3 h-3 bg-white rounded-full"></div>}
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* SECCIÓN 2: Información Demográfica y Contacto */}
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Información Demográfica & Contacto Local</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Documento Nacional (RUT)</label>
                           <input type="text" value={formData.documentId} onChange={e => setFormData({...formData, documentId: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#00A89C] shadow-sm" placeholder="Ej: 19.123.456-7" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Fecha de Nacimiento</label>
                           <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm text-slate-600" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Teléfono Primario</label>
                           <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" placeholder="+56 9..." />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Dirección Residencial</label>
                           <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Comuna / Ciudad</label>
                           <input type="text" value={formData.commune} onChange={e => setFormData({...formData, commune: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" />
                        </div>
                     </div>
                  </div>

                  {/* SECCIÓN 3: Protección Financiera y SOS Clínico */}
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Protección Médica y Red de Apoyo SOS</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Previsión de Salud</label>
                           <input type="text" value={formData.healthSystem} onChange={e => setFormData({...formData, healthSystem: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" placeholder="Ej: Fonasa, Isapre Consalud..." />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seguro Complementario</label>
                           <input type="text" value={formData.complementaryInsurance} onChange={e => setFormData({...formData, complementaryInsurance: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm" placeholder="Opcional. Ej: MetLife, Chilena..." />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombre Red de Apoyo (Familiar SOS)</label>
                           <input type="text" value={formData.emergencyContactName} onChange={e => setFormData({...formData, emergencyContactName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-red-400 shadow-sm" placeholder="Referencia Emergencia." />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Número de Contacto (Red de Apoyo SOS)</label>
                           <input type="text" value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-red-400 shadow-sm" placeholder="+56 9..." />
                        </div>
                     </div>
                  </div>

                  {/* SECCIÓN 4: Clínico Fino */}
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mb-8">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Documentación Clínica Opcional</h4>
                     <div className="mb-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Anotación Médica Rápida (Observación)</label>
                        <textarea rows={2} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#00A89C] shadow-sm resize-none"></textarea>
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Enlace a Ficha o Anexo Externo</label>
                        <input type="url" value={formData.medicalRecordLink} onChange={e => setFormData({...formData, medicalRecordLink: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#00A89C] shadow-sm text-blue-500" placeholder="https://..." />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

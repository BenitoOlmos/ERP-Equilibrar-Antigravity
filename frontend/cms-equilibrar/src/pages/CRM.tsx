import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Target, Search, Phone, Mail, FileText, CheckCircle2, Clock, CalendarDays, ExternalLink, X, Save } from 'lucide-react';

export default function CRM() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  
  // Modal state
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  const fetchLeads = () => {
    setLoading(true);
    axios.get('/api/crm/leads')
      .then(res => setLeads(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenLead = (lead: any) => {
    setSelectedLead(lead);
    setNotesDraft(lead.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSaving(true);
    try {
      await axios.put(`/api/crm/leads/${selectedLead.id}/notes`, { notes: notesDraft });
      // Update local state instead of doing a full refetch to be faster
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: notesDraft } : l));
      setSelectedLead({ ...selectedLead, notes: notesDraft });
    } catch (error) {
      console.error(error);
      alert('Error al guardar apunte.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'ALL' || lead.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const kpis = {
    total: leads.length,
    patients: leads.filter(l => l.role === 'PATIENT').length,
    withDiagnostic: leads.filter(l => !!l.diagnostic).length,
    conversions: leads.filter(l => l.diagnostic && (l.role === 'PATIENT' || (l.payments && l.payments.length > 0))).length
  };

  const getStatusBadge = (lead: any) => {
    if (lead.role === 'PATIENT') return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md">PACIENTE ACTIVO</span>;
    if (lead.diagnostic) return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md">TEST RFAI TOMADO</span>;
    return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">PROSPECTO WEB</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-h-[calc(100vh-6rem)] flex flex-col relative animate-fade-in">
      <header className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center">
            <Target className="w-8 h-8 mr-3 text-[#00A89C]" />
            CRM Equilibrar
          </h1>
          <p className="text-slate-500 mt-2">Seguimiento proactivo de prospectos, clientes y pacientes.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Base</span>
          <span className="text-3xl font-black text-slate-800">{kpis.total}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pacientes</span>
          <span className="text-3xl font-black text-emerald-600">{kpis.patients}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Test RFAI</span>
          <span className="text-3xl font-black text-blue-600">{kpis.withDiagnostic}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Conversiones RFAI</span>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-amber-500">{kpis.conversions}</span>
            <span className="text-sm font-bold text-slate-400 mb-1">/ {kpis.withDiagnostic} tests</span>
          </div>
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
              placeholder="Buscar por nombre, correo o teléfono..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A89C]/20 transition-all font-medium"
            />
          </div>
          
          <select 
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none bg-white cursor-pointer"
          >
            <option value="ALL">Todos los Segmentos</option>
            <option value="USER">Prospectos Nuevos</option>
            <option value="CLIENT">Clientes en Evaluación</option>
            <option value="PATIENT">Pacientes Activos</option>
          </select>
          
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">{filteredLeads.length} Registros</span>
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
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Contacto</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Estado Segmento</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Actividad Clínica</th>
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Apuntes Seguimiento</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr 
                    key={lead.id} 
                    onClick={() => handleOpenLead(lead)}
                    className="border-b border-slate-100 hover:bg-white cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {lead.name || lead.profile?.firstName + ' ' + lead.profile?.lastName || 'Sin Nombre'}
                        {lead.diagnostic && <span title="Perfil RFAI Completado"><CheckCircle2 className="w-4 h-4 text-blue-500" /></span>}
                      </div>
                      <div className="flex flex-col gap-1 mt-1 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center"><Mail className="w-3 h-3 mr-1" />{lead.email}</span>
                        {(lead.phone || lead.profile?.phone) && <span className="flex items-center"><Phone className="w-3 h-3 mr-1" />{lead.phone || lead.profile?.phone}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(lead)}
                    </td>
                    <td className="p-4">
                      {lead.appointmentsAsClient && lead.appointmentsAsClient.length > 0 ? (
                        <div className="text-xs">
                          <span className="block font-bold text-slate-700">Última cita:</span>
                          <span className="text-slate-500 flex items-center mt-1">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            {new Date(lead.appointmentsAsClient[0].date).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Sin agenda clínica</span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-xs group-hover:text-slate-800 transition-colors">
                        {lead.notes || <span className="opacity-50 italic">Sin apuntes (clic para añadir)...</span>}
                      </p>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-slate-400 font-medium">No se encontraron leads con estos filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Slide-over Profile Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedLead(null)}></div>
          
          <div className="w-[500px] h-full bg-white shadow-2xl relative z-10 flex flex-col animate-fade-in animate-slide-in-right border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-1">
                    {selectedLead.name || selectedLead.profile?.firstName + ' ' + selectedLead.profile?.lastName}
                  </h2>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedLead)}
                    <span className="text-xs text-slate-500 font-bold">Registro: {new Date(selectedLead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex p-4 gap-3 bg-white border-b border-slate-100 shrink-0">
              {(selectedLead.phone || selectedLead.profile?.phone) && (
                <a href={`https://wa.me/${selectedLead.phone || selectedLead.profile?.phone}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white py-2.5 rounded-xl text-center font-bold text-xs transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> WhatsApp
                </a>
              )}
              <a href={`mailto:${selectedLead.email}`} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 py-2.5 rounded-xl text-center font-bold text-xs transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Enviar Correo
              </a>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Notas de Seguimiento */}
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Apuntes Internos de Cuenta
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                  <textarea 
                    value={notesDraft}
                    onChange={e => setNotesDraft(e.target.value)}
                    placeholder="Escribe aquí acuerdos, llamadas, contexto de ventas..."
                    className="w-full bg-transparent border-none focus:outline-none resize-none text-sm text-slate-700 min-h-[150px]"
                  />
                  <div className="flex justify-end mt-2 pt-2 border-t border-slate-200">
                    <button 
                      onClick={handleSaveNotes}
                      disabled={isSaving || notesDraft === (selectedLead.notes || '')}
                      className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                    >
                      {isSaving ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                      Guardar Apuntes
                    </button>
                  </div>
                </div>
              </section>

              {/* RFAI Result Snippet */}
              {selectedLead.diagnostic && (
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Diagnóstico RFAI Web
                  </h3>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-900">Perfil Dominante</span>
                      <span className="text-sm font-black text-blue-700 uppercase">{selectedLead.diagnostic.profile}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-blue-100 pt-2">
                      <span className="text-xs font-bold text-blue-900">Estado Onboarding</span>
                      <span className="text-[10px] font-bold tracking-widest bg-blue-200 text-blue-800 px-2 py-0.5 rounded-md">{selectedLead.diagnostic.status}</span>
                    </div>
                  </div>
                </section>
              )}

              {/* CRM Meta */}
              <section className="text-xs text-slate-400 font-medium bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                 <div className="flex justify-between py-1"><span>ID Cliente:</span> <span className="font-mono">{selectedLead.id.slice(0,8)}</span></div>
                 <div className="flex justify-between py-1 border-t border-slate-100 mt-1 pt-2"><span>Nivel de Acceso:</span> <span className="font-bold">{selectedLead.role}</span></div>
              </section>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

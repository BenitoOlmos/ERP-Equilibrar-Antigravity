import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, FolderOpen, Plus, UserCircle, Phone, Mail, Clock, FileText, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FichasClinicas() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const [records, setRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    reason: '',
    anamnesis: '',
    diagnosis: '',
    treatment: '',
    evolution: '',
    observations: ''
  });

  const fetchPatients = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/data/users'),
      axios.get('/api/data/appointments')
    ])
      .then(([resUsers, resAppts]) => {
        const appointments = resAppts.data || [];
        const usersWithAppointments = new Set(appointments.map((a: any) => a.clientId).filter(Boolean));

        const clientUsers = resUsers.data.filter((u: any) => 
          ['CLIENT', 'Cliente', 'USER', 'CLIENTE'].includes(u.role) && 
          usersWithAppointments.has(u.id)
        );
        
        setPatients(clientUsers);
        if (clientUsers.length > 0) {
          setSelectedPatient(clientUsers[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  useEffect(() => {
    if (selectedPatient) {
      setLoadingRecords(true);
      axios.get(`/api/data/clinical/client/${selectedPatient.id}`)
        .then(res => setRecords(res.data))
        .catch(console.error)
        .finally(() => setLoadingRecords(false));
    } else {
      setRecords([]);
    }
  }, [selectedPatient]);

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.profile?.firstName || ''} ${p.profile?.lastName || ''} ${p.name || ''}`.toLowerCase();
    const emailStr = (p.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || emailStr.includes(term);
  });

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        reason: record.reason || '',
        anamnesis: record.anamnesis || '',
        diagnosis: record.diagnosis || '',
        treatment: record.treatment || '',
        evolution: record.evolution || '',
        observations: record.observations || ''
      });
    } else {
      setEditingRecord(null);
      setFormData({
        reason: '',
        anamnesis: '',
        diagnosis: '',
        treatment: '',
        evolution: '',
        observations: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !user) return;
    try {
      if (editingRecord) {
        await axios.put(`/api/data/clinical/${editingRecord.id}`, formData);
      } else {
        await axios.post('/api/data/clinical', {
          ...formData,
          clientId: selectedPatient.id,
          specialistId: user.id
        });
      }
      setShowModal(false);
      // Refresh records
      const res = await axios.get(`/api/data/clinical/client/${selectedPatient.id}`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al guardar la ficha clínica');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este registro clínico?')) return;
    try {
      await axios.delete(`/api/data/clinical/${id}`);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la ficha');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0097B2] to-[#00A89C] shadow-lg shadow-teal-200 flex items-center justify-center text-white">
              <FolderOpen className="w-5 h-5" />
            </span>
            Fichas Clínicas
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1 ml-13">Gestión de registros médicos (Estándar MINSAL).</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* PANEL IZQUIERDO */}
        <div className="w-1/3 min-w-[300px] flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar paciente..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A89C] focus:border-transparent outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-sm">Cargando pacientes...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">No hay pacientes con consultas agendadas.</div>
            ) : (
              filteredPatients.map(patient => (
                <button 
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border ${
                    selectedPatient?.id === patient.id 
                    ? 'bg-[#00A89C]/5 border-[#00A89C]/20 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50'
                  } flex items-center gap-3`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    <UserCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className={`text-sm font-bold truncate ${selectedPatient?.id === patient.id ? 'text-[#00A89C]' : 'text-slate-700'}`}>
                      {patient.profile?.firstName} {patient.profile?.lastName}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{patient.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO */}
        {selectedPatient ? (
          <div className="flex-1 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col overflow-hidden relative">
            
            {/* Cabecera del Paciente */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {selectedPatient.profile?.firstName} {selectedPatient.profile?.lastName}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedPatient.email}
                    </span>
                    {selectedPatient.phone && (
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {selectedPatient.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-[#0097B2] hover:bg-[#00829A] text-white px-5 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all shadow-md shadow-[#0097B2]/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Nota Clínica
              </button>
            </div>

            {/* Lista Cronológica */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {loadingRecords ? (
                <div className="text-center text-slate-400 text-sm mt-10">Cargando historial clínico...</div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-semibold text-slate-500">Sin historial clínico activo</p>
                  <p className="text-sm">Aún no se han redactado fichas clínicas para este paciente.</p>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {records.map(record => (
                    <div key={record.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden group">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#00A89C]/10 text-[#00A89C] px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(record.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            Atendido por: {record.specialist?.profile?.firstName} {record.specialist?.profile?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(record)} className="p-1.5 text-slate-400 hover:text-[#00A89C] hover:bg-[#00A89C]/10 rounded-lg transition-colors" title="Editar ficha">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {user?.role !== 'Especialista' && (
                            <button onClick={() => handleDeleteRecord(record.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar ficha">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        {record.reason && (
                          <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#0097B2] mb-1">Motivo de Consulta</h5>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{record.reason}</p>
                          </div>
                        )}
                        {record.anamnesis && (
                          <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#0097B2] mb-1">Anamnesis / Antecedentes</h5>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{record.anamnesis}</p>
                          </div>
                        )}
                        {record.diagnosis && (
                          <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#0097B2] mb-1">Diagnóstico</h5>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{record.diagnosis}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {record.treatment && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Indicaciones Médicas</h5>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">{record.treatment}</p>
                            </div>
                          )}
                          {record.evolution && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Evolución / Seguimiento</h5>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">{record.evolution}</p>
                            </div>
                          )}
                        </div>
                        {record.observations && (
                          <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Observaciones Internas</h5>
                            <p className="text-sm text-slate-500 whitespace-pre-wrap italic">{record.observations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-3xl border border-slate-200/60 flex items-center justify-center text-slate-400">
            {loading ? 'Cargando datos...' : 'Selecciona a un paciente para visualizar sus fichas clínicas.'}
          </div>
        )}
      </div>

      {/* Modal Edición / Creación */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">{editingRecord ? 'Editar Ficha Clínica' : 'Nueva Ficha Clínica'}</h3>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider text-[#0097B2]">
                  Paciente: {selectedPatient?.profile?.firstName} {selectedPatient?.profile?.lastName}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-white">
              <form id="recordForm" onSubmit={handleSaveRecord} className="space-y-6">
                
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Motivo de Consulta</label>
                  <textarea 
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                    placeholder="Describe el motivo principal por el cual se presenta el paciente..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A89C] min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Anamnesis / Antecedentes</label>
                  <textarea 
                    value={formData.anamnesis}
                    onChange={e => setFormData({...formData, anamnesis: e.target.value})}
                    placeholder="Historial médico, antecedentes familiares, alergias, contexto psicosocial..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A89C] min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Diagnóstico</label>
                  <textarea 
                    value={formData.diagnosis}
                    onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                    placeholder="Hipótesis diagnóstica o disgnóstico clínico confirmado..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A89C]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-emerald-700 uppercase tracking-wider mb-2">Indicaciones y Tratamiento</label>
                    <textarea 
                      value={formData.treatment}
                      onChange={e => setFormData({...formData, treatment: e.target.value})}
                      placeholder="Fármacos, terapia física, derivaciones, reposo..."
                      className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[120px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-indigo-700 uppercase tracking-wider mb-2">Evolución</label>
                    <textarea 
                      value={formData.evolution}
                      onChange={e => setFormData({...formData, evolution: e.target.value})}
                      placeholder="Estado actual frente a la sesión anterior, cambios observados..."
                      className="w-full bg-indigo-50/30 border border-indigo-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[120px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Notas Rápidas Internas</label>
                  <textarea 
                    value={formData.observations}
                    onChange={e => setFormData({...formData, observations: e.target.value})}
                    placeholder="Observaciones de carácter personal para la próxima cita..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

              </form>
            </div>
            <div className="p-6 border-t border-slate-100 shrink-0 bg-white flex justify-end gap-3 rounded-b-3xl">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="recordForm"
                className="bg-[#0097B2] hover:bg-[#00829A] text-white px-8 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all shadow-md shadow-[#0097B2]/20"
              >
                Guardar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

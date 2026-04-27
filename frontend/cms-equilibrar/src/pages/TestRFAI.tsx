import React, { useState, useEffect } from 'react';
import axios from '../api';
import { 
  MessageSquare, Search, Download, Trash2, X, Settings2, 
  Users, TrendingUp, AlertCircle, Clock, Filter, Columns, 
  ChevronLeft, ChevronRight, Eye 
} from 'lucide-react';

export function TestRFAI() {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Edit State
  const [editingDiag, setEditingDiag] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({af:0, am:0, ae:0, r:0, ita:0, re:0, idsE:0});

  const fetchDiagnostics = () => {
    setLoading(true);
    axios.get('/api/crm/diagnostics')
      .then(res => setDiagnostics(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDiagnostics(); }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await axios.put(`/api/crm/diagnostics/${editingDiag.id}`, editFormData);
          setEditingDiag(null);
          fetchDiagnostics();
      } catch (err) {
          console.error(err);
          alert('Error actualizando test');
      }
  };

  const markAsRead = async (id: string) => {
      try {
          await axios.put(`/api/crm/diagnostics/${id}/read`);
          setDiagnostics(prev => prev.map(d => d.id === id ? { ...d, isRead: true } : d));
      } catch (e) {
          console.error("Error marking logic as read:", e);
      }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          await axios.put(`/api/crm/diagnostics/${id}/status`, { status: newStatus });
          setDiagnostics(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      } catch (e) {
          console.error(e);
          alert('Error actualizando estado');
      }
  };

  const filteredDiagnostics = diagnostics.filter(diag => {
    const fullName = `${diag.user?.profile?.firstName || diag.user?.name || ''} ${diag.user?.profile?.lastName || ''}`.toLowerCase();
    const searchTokens = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    const email = (diag.user?.email || '').toLowerCase();
    const phone = (diag.user?.phone || diag.phone || '').toLowerCase();
    
    if (searchTokens.length === 0) return true;
    return searchTokens.every(token => 
      fullName.includes(token) || email.includes(token) || phone.includes(token)
    );
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredDiagnostics.length / itemsPerPage);
  const paginatedDiagnostics = filteredDiagnostics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, filteredDiagnostics.length);

  // Computations
  const totalRegistros = diagnostics.length;
  const balancesCount = diagnostics.filter(d => 
    (d.r >= 16 && d.af <= 19 && d.am <= 19 && d.ae <= 19) || (d.interpretation && d.interpretation.includes('Balance'))
  ).length;
  const riskCount = diagnostics.filter(d => 
    d.r < 16 || d.af > 19 || d.am > 19 || d.ae > 19
  ).length;
  const pendingCount = diagnostics.filter(d => 
    d.status === 'INGRESADO' || !d.status
  ).length;

  const validStatuses = ['INGRESADO', 'PILOTO', 'SESION CON CLAUDIO', 'PROPUESTA ENTREGADA', 'INICIA RFAI'];

  const handleExportCSV = () => {
    if (filteredDiagnostics.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    const headers = [
      'Fecha', 'Nombre', 'Correo', 'Teléfono', 'AF', 'AM', 'AE', 'R', 'ITA', 'Re', 'IDS-E', 'Interpretación', 'Perfil General', 'Estado'
    ];
    const rows = filteredDiagnostics.map(diag => {
      const dateVal = diag.date || diag.createdAt;
      const dateStr = dateVal ? new Date(dateVal).toLocaleString('es-CL') : '';
      const name = `${diag.user?.profile?.firstName || diag.user?.name || ''} ${diag.user?.profile?.lastName || ''}`.trim();
      const email = diag.user?.email || '';
      const phone = diag.user?.phone || diag.phone || '';
      return [
        `"${dateStr}"`, `"${name}"`, `"${email}"`, `"${phone}"`,
        diag.af || 0, diag.am || 0, diag.ae || 0, diag.r || 0, diag.ita || 0, diag.re || 0, diag.idsE ?? diag.ids_e ?? 0, 
        `"${(diag.interpretation || '').replace(/"/g, '""')}"`, `"${(diag.profile || '').replace(/"/g, '""')}"`, `"${diag.status || ''}"`
      ].join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(',') + "\n" + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Test_RFAI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50/50">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 leading-none">Test RFAI</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium italic">Bandeja de diagnósticos automatizados</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="hidden md:flex bg-slate-100 rounded-xl p-1">
                    <button className="px-4 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-lg shadow-sm border border-slate-200">Hoy</button>
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Semana</button>
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Mes</button>
                </div>
                <button onClick={handleExportCSV} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95">
                    <Download className="w-4 h-4" />
                    Exportar
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-auto flex flex-col p-6 gap-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Total Registros</p>
                        <p className="text-xl font-black text-slate-800">{totalRegistros.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Balanceados</p>
                        <p className="text-xl font-black text-slate-800">{balancesCount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">En Riesgo</p>
                        <p className="text-xl font-black text-slate-800">{riskCount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Pendientes</p>
                        <p className="text-xl font-black text-slate-800">{pendingCount.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col min-h-[500px] overflow-hidden animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 shrink-0">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            id="table-search" 
                            placeholder="Buscar por nombre, email o teléfono..." 
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white" 
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
                            <Columns className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    {loading ? (
                       <div className="flex justify-center items-center h-full min-h-[300px]"><div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>
                    ) : (
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-20 shadow-[0_1px_0_rgba(226,232,240,1)]">
                            <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Perfil General</th>
                                <th className="px-6 py-4 text-center text-indigo-600 bg-indigo-50/20">AF</th>
                                <th className="px-6 py-4 text-center text-indigo-600 bg-indigo-50/20">AM</th>
                                <th className="px-6 py-4 text-center text-indigo-600 bg-indigo-50/20">AE</th>
                                <th className="px-6 py-4 text-center text-emerald-600 bg-emerald-50/20">REG</th>
                                <th className="px-6 py-4 text-center text-emerald-600 bg-emerald-50/20">ITA</th>
                                <th className="px-6 py-4 text-center text-slate-600 bg-slate-50/10">IDS-E</th>
                                <th className="px-6 py-4">Interpretación</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="table-body" className="divide-y divide-slate-100">
                            {paginatedDiagnostics.map((diag: any) => {
                                const dateVal = diag.date || diag.createdAt;
                                const dateFormated = dateVal ? new Date(dateVal).toLocaleString('es-CL') : '';
                                const name = `${diag.user?.profile?.firstName || diag.user?.name || 'Vació'} ${diag.user?.profile?.lastName || ''}`.trim();
                                const email = diag.user?.email || '[Sin Correo]';
                                const phone = diag.user?.phone || diag.phone || '[Sin Teléfono]';
                                
                                const valAF = Number(diag.af) || 0;
                                const valAM = Number(diag.am) || 0;
                                const valAE = Number(diag.ae) || 0;
                                const valR = Number(diag.r) || 0;
                                const valITA = Number(diag.ita) || 0;
                                const valIDS = Number(diag.idsE ?? diag.ids_e ?? 0);

                                return (
                                <tr key={diag.id} className="row-hover hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col relative">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-slate-800">{name}</span>
                                                {diag.isRead === false && (
                                                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">NUEVO</span>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400 mt-0.5">{email} • {phone}</span>
                                            <span className="text-[10px] text-indigo-500 font-bold mt-1 uppercase italic">{dateFormated}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-block truncate max-w-[140px]" title={diag.profile || 'Pendiente'}>
                                            {diag.profile || 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-xs ${valAF > 19 ? 'bg-red-100 border border-red-200 font-black text-red-600' : 'bg-slate-100 font-bold text-slate-700'}`}>{valAF}</span>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-xs ${valAM > 19 ? 'bg-red-100 border border-red-200 font-black text-red-600' : 'bg-slate-100 font-bold text-slate-700'}`}>{valAM}</span>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-xs ${valAE > 19 ? 'bg-red-100 border border-red-200 font-black text-red-600' : 'bg-slate-100 font-bold text-slate-700'}`}>{valAE}</span>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-xs ${valR < 16 ? 'bg-red-50 border border-red-100 font-black text-red-600' : 'bg-emerald-50 border border-emerald-100 font-black text-emerald-600'}`}>{valR}</span>
                                    </td>
                                    <td className="px-4 py-5 text-center font-bold text-slate-600">{valITA}</td>
                                    <td className="px-4 py-5 text-center font-black text-indigo-600">{valIDS}</td>
                                    <td className="px-6 py-5 max-w-xs">
                                        <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-2">{diag.interpretation || 'Sin interpretación...'}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <select 
                                          value={diag.status || ''} 
                                          onChange={(e) => handleStatusChange(diag.id, e.target.value)}
                                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer focus:ring-2 border ${
                                             !diag.status || diag.status === 'INGRESADO' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                                             diag.status === 'PILOTO' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                             diag.status === 'SESION CON CLAUDIO' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                             diag.status === 'PROPUESTA ENTREGADA' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                             diag.status === 'INICIA RFAI' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                             'bg-indigo-50 text-indigo-600 border-indigo-100'
                                          }`}
                                        >
                                            <option value="" disabled>Seleccionar</option>
                                            {validStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { markAsRead(diag.id); setEditingDiag(diag); setEditFormData({af: valAF, am: valAM, ae: valAE, r: valR, ita: valITA, re: diag.re||0, idsE: valIDS}); }} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all" title="Ver/Editar Detalles">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={async () => { if(confirm('¿Seguro que deseas eliminar este diagnóstico permanentemente?')){ await axios.delete('/api/crm/diagnostics/' + diag.id); fetchDiagnostics(); } }} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 shadow-sm transition-all" title="Eliminar">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                            {paginatedDiagnostics.length === 0 && (
                                <tr>
                                    <td colSpan={11} className="p-16 text-center text-slate-400 font-bold">
                                        <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        No hay diagnósticos registrados para mostrar
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    )}
                </div>

                {!loading && filteredDiagnostics.length > 0 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Mostrando {startIdx} a {endIdx} de {filteredDiagnostics.length} registros
                    </p>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-900 transition-all active:scale-90 disabled:opacity-50 disabled:pointer-events-none">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        {Array.from({length: Math.min(5, totalPages)}).map((_, i) => {
                            // Simple logic to show nearby pages
                            let pageNum = currentPage;
                            if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;

                            if (pageNum < 1 || pageNum > totalPages) return null;

                            return (
                                <button 
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition-colors ${
                                      pageNum === currentPage ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                            );
                        })}

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-900 transition-all active:scale-90 disabled:opacity-50 disabled:pointer-events-none">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>
        
        {/* Modal de Edición */}
        {editingDiag && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingDiag(null)} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Editar Diagnóstico</h3>
                <button onClick={() => setEditingDiag(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'af', label: 'Activación F.' }, { id: 'am', label: 'Activación M.' }, { id: 'ae', label: 'Activación E.' },
                     { id: 'r', label: 'Regulación' }, { id: 'ita', label: 'Carga Int.' }, { id: 're', label: 'Reg. eq' }, { id: 'idsE', label: 'Índice (IDS-E)' }
                   ].map(fld => (
                     <div key={fld.id}>
                       <label className="block text-xs font-bold text-slate-500 mb-1">{fld.label}</label>
                       <input type="number" required value={(editFormData as any)[fld.id]} onChange={e => setEditFormData({...editFormData, [fld.id]: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500" />
                     </div>
                   ))}
                 </div>
                 <div className="pt-4 flex justify-end gap-3">
                   <button type="button" onClick={() => setEditingDiag(null)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                   <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-600/20">Guardar Cambios</button>
                 </div>
              </form>
            </div>
          </div>
        )}
    </main>
  );
}

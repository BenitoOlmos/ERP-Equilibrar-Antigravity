import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Search, Download, Bot, Settings2 } from 'lucide-react';

export function TestRFAI() {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Column Visibility State
  const [visibleCols, setVisibleCols] = useState({
     date: true, name: true, email: true, phone: true, af: true, am: true, ae: true,
     r: true, ita: true, re: true, ids: true, interpretacion: true, perfil: true, estado: true
  });
  const [showColMenu, setShowColMenu] = useState(false);

  const fetchDiagnostics = () => {
    setLoading(true);
    axios.get('/api/crm/diagnostics')
      .then(res => setDiagnostics(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDiagnostics(); }, []);

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
    const searchLow = searchTerm.toLowerCase();
    return fullName.includes(searchLow) || (diag.user?.email || '').toLowerCase().includes(searchLow);
  });

  const validStatuses = ['INGRESADO', 'PILOTO', 'SESION CON CLAUDIO', 'PROPUESTA ENTREGADA', 'INICIA RFAI'];

  const handleExportCSV = () => {
    if (filteredDiagnostics.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'Fecha', 'Nombre', 'Correo', 'Teléfono', 'Activación Fisiológica (AF)', 
      'Activación Mental (AM)', 'Activación Emocional (AE)', 'Regulación (R)',
      'Carga Interna (ITA)', 'Regulación eq (Re)', 'Índice (IDS-E)',
      'Interpretación', 'Perfil General', 'Estado'
    ];
    
    const rows = filteredDiagnostics.map(diag => {
      const dateVal = diag.date || diag.createdAt;
      const dateStr = dateVal ? new Date(dateVal).toLocaleString('es-CL') : '';
      const name = `${diag.user?.profile?.firstName || diag.user?.name || ''} ${diag.user?.profile?.lastName || ''}`.trim();
      const email = diag.user?.email || '';
      const phone = diag.user?.phone || diag.phone || '';
      
      return [
        `"${dateStr}"`, 
        `"${name}"`, 
        `"${email}"`, 
        `"${phone}"`,
        diag.af || 0, 
        diag.am || 0, 
        diag.ae || 0, 
        diag.r || 0, 
        diag.ita || 0, 
        diag.re || 0, 
        diag.idsE ?? diag.ids_e ?? 0, 
        `"${(diag.interpretation || '').replace(/"/g, '""')}"`, 
        `"${(diag.profile || '').replace(/"/g, '""')}"`, 
        `"${diag.status || ''}"`
      ].join(',');
    });
    
    // Use \uFEFF to ensure UTF-8 encoding is recognized by Excel
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(',') + "\n" + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Test_RFAI_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[100vw] mx-auto animate-fade-in flex flex-col min-h-[calc(100vh-6rem)] relative pb-6 px-2 sm:px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-indigo-500" />
            Test RFAI
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">Bandeja de diagnósticos guardados desde la Web RFAI.</p>
        </div>
        <div className="flex flex-wrap gap-2 md:space-x-3 md:gap-0">
           <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex-1 md:flex-none justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-bold flex items-center transition-all">
             <Bot className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Auto-Perfilador
           </button>
           <button onClick={handleExportCSV} className="bg-slate-900 text-white hover:bg-slate-800 flex-1 md:flex-none justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-bold flex items-center shadow-lg shadow-slate-900/20 transition-all">
             <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Exportar CSV
           </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 flex flex-col overflow-hidden">
        <div className="p-3 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-slate-50/50 shrink-0">
           <div className="relative w-full sm:w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Buscar por Nombre o Email..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
             />
           </div>

           <div className="relative">
              <button onClick={() => setShowColMenu(!showColMenu)} className="w-full sm:w-auto justify-center flex items-center text-sm font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 sm:py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                 <Settings2 className="w-4 h-4 mr-2 text-slate-400" /> Columnas Visibles
              </button>
              {showColMenu && (
                 <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-fade-in grid grid-cols-2 sm:grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                    {Object.keys(visibleCols).map(col => (
                       <label key={col} className="flex items-center px-4 py-1.5 hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 uppercase tracking-wider">
                          <input type="checkbox" className="mr-3 accent-indigo-500 w-4 h-4 rounded border-slate-300" checked={visibleCols[col as keyof typeof visibleCols]} onChange={() => setVisibleCols({...visibleCols, [col]: !visibleCols[col as keyof typeof visibleCols]})} />
                          <span className="truncate">{col}</span>
                       </label>
                    ))}
                 </div>
              )}
           </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto bg-slate-50/30 custom-scrollbar relative">
          {loading ? (
             <div className="flex justify-center items-center h-full"><div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>
          ) : (
               <table className="w-full text-left whitespace-nowrap min-w-max">
                  <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                     <tr className="border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500">
                        {visibleCols.date && <th className="p-4 font-black">Fecha</th>}
                        {visibleCols.name && <th className="p-4 font-black">Nombre</th>}
                        {visibleCols.email && <th className="p-4 font-black">Correo</th>}
                        {visibleCols.phone && <th className="p-4 font-black">Teléfono</th>}
                        {visibleCols.af && <th className="p-4 font-black text-center text-indigo-500 bg-indigo-50/30">Activación Fisiológica (AF)</th>}
                        {visibleCols.am && <th className="p-4 font-black text-center text-indigo-500 bg-indigo-50/30">Activación Mental (AM)</th>}
                        {visibleCols.ae && <th className="p-4 font-black text-center text-indigo-500 bg-indigo-50/30">Activación Emocional (AE)</th>}
                        {visibleCols.r && <th className="p-4 font-black text-center text-emerald-500 bg-emerald-50/30">Regulación (R)</th>}
                        {visibleCols.ita && <th className="p-4 font-black text-center text-emerald-500 bg-emerald-50/30">Carga Interna (ITA)</th>}
                        {visibleCols.re && <th className="p-4 font-black text-center text-emerald-500 bg-emerald-50/30">Regulación eq (Re)</th>}
                        {visibleCols.ids && <th className="p-4 font-black text-center text-rose-500 bg-rose-50/30">Índice (IDS-E)</th>}
                        {visibleCols.interpretacion && <th className="p-4 font-black max-w-xs whitespace-normal min-w-[200px]">Interpretación</th>}
                        {visibleCols.perfil && <th className="p-4 font-black max-w-xs whitespace-normal min-w-[200px]">Perfil General</th>}
                        {visibleCols.estado && <th className="p-4 font-black">ESTADO</th>}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredDiagnostics.map(diag => {
                        const dateVal = diag.date || diag.createdAt;
                        const dateFormated = dateVal ? new Date(dateVal).toLocaleString('es-CL') : '';
                        return (
                        <tr key={diag.id} className="hover:bg-indigo-50/30 transition-colors text-sm font-semibold text-slate-700">
                           {visibleCols.date && <td className="p-4 text-xs font-bold text-slate-500">{dateFormated}</td>}
                           {visibleCols.name && <td className="p-4 font-black text-slate-800">{diag.user?.profile?.firstName || diag.user?.name || 'Vació'} {diag.user?.profile?.lastName || ''}</td>}
                           {visibleCols.email && <td className="p-4 text-xs font-medium text-slate-500">{diag.user?.email || '[Sin Correo]'}</td>}
                           {visibleCols.phone && <td className="p-4 text-xs font-medium text-slate-500">{diag.user?.phone || diag.phone || '[Sin Teléfono]'}</td>}
                           {visibleCols.af && <td className={`p-4 text-center ${Number(diag.af) > 19 ? 'bg-red-100 text-red-700 font-black' : 'bg-indigo-50/10'}`}>{diag.af}</td>}
                           {visibleCols.am && <td className={`p-4 text-center ${Number(diag.am) > 19 ? 'bg-red-100 text-red-700 font-black' : 'bg-indigo-50/10'}`}>{diag.am}</td>}
                           {visibleCols.ae && <td className={`p-4 text-center ${Number(diag.ae) > 19 ? 'bg-red-100 text-red-700 font-black' : 'bg-indigo-50/10'}`}>{diag.ae}</td>}
                           {visibleCols.r && <td className={`p-4 text-center ${Number(diag.r) < 16 ? 'bg-red-100 text-red-700 font-black' : 'bg-emerald-50/10'}`}>{diag.r}</td>}
                           {visibleCols.ita && <td className="p-4 text-center bg-emerald-50/10">{diag.ita}</td>}
                           {visibleCols.re && <td className="p-4 text-center bg-emerald-50/10">{diag.re}</td>}
                           {visibleCols.ids && <td className="p-4 text-center bg-rose-50/10 font-black text-rose-600">{diag.idsE ?? diag.ids_e}</td>}
                           {visibleCols.interpretacion && <td className="p-4 text-xs max-w-xs whitespace-normal">{diag.interpretation}</td>}
                           {visibleCols.perfil && <td className="p-4 text-xs max-w-xs whitespace-normal text-slate-500">{diag.profile}</td>}
                           {visibleCols.estado && (
                              <td className="p-4">
                                 <select 
                                    value={diag.status || ''} 
                                    onChange={(e) => handleStatusChange(diag.id, e.target.value)}
                                    className={`text-[10px] font-black uppercase tracking-wider rounded-md border text-center shadow-sm cursor-pointer outline-none transition-colors px-2 py-1.5 appearance-none ${
                                       !diag.status || diag.status === 'INGRESADO' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                       diag.status === 'PILOTO' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                       diag.status === 'SESION CON CLAUDIO' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                       diag.status === 'PROPUESTA ENTREGADA' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                       diag.status === 'INICIA RFAI' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                       'bg-indigo-100 text-indigo-700 border-indigo-200'
                                    }`}
                                 >
                                    <option value="" disabled>Seleccionar</option>
                                    {validStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                                 </select>
                              </td>
                           )}
                        </tr>
                     )})}
                     {filteredDiagnostics.length === 0 && (
                        <tr>
                           <td colSpan={13} className="p-16 text-center text-slate-400 font-bold">
                              <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                              No hay diagnósticos registrados
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

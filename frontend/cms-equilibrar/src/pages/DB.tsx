import React, { useState } from 'react';
import axios from '../api';
import { Database, Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function DB() {
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setDownloading(true);
    setMessage('Generando super-JSON de toda la red PostgreSQL...');
    try {
      const resp = await axios.get('/api/data/backup/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Respaldo_ERP_Global_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('✅ Descarga del JSON Maestro completada.');
    } catch (e) {
      console.error(e);
      setMessage('❌ Error exportando la base de datos centralizada.');
    } finally {
      setDownloading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files || !e.target.files[0]) return;
    if(!confirm('¡PELIGRO! Esta acción BORRARÁ por completo la base de datos actual (Agenda, Cursos, CRM) y la reemplazará con el JSON provisto. ¿Proceder?')) {
       e.target.value = '';
       return;
    }
    
    setUploading(true);
    setMessage('Restaurando estructura Bottom-Up en PostgreSQL... (No cierre esta ventana)');
    const formData = new FormData();
    formData.append('database', e.target.files[0]);

    try {
      await axios.post('/api/data/backup/import', formData);
      setMessage('✅ Restauración masiva completada exitosamente.');
      alert('La Base de Datos Global ha sido restaurada con éxito.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setMessage('❌ Error en el parseo del JSON o conflictos de Relación BBDD.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in py-12">
      <header className="text-center mb-12">
        <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-slate-900/20">
           <Database className="w-10 h-10 text-[#00A89C]" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Centro de Datos <span className="text-[#00A89C]">PostgreSQL</span></h1>
        <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">
          Respaldo global unificado. Este módulo exporta e importa absolutamente toda la arquitectura: <b>Agenda, CRM, Cursos, Pagos y Usuarios.</b>
        </p>
      </header>

      {message && (
         <div className="mb-8 p-4 bg-slate-800 text-white rounded-2xl text-center font-bold shadow-lg animate-fade-in flex items-center justify-center">
            {message.includes('✅') ? <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400" /> : <Database className="w-5 h-5 mr-3 text-[#00A89C] animate-pulse" />}
            {message}
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* EXPORT CARD */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <Download className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">Exportar Nube</h2>
          <p className="text-slate-500 text-sm mb-8">
            Compila todas las tablas relacionadas y genera un archivo <b>.json</b> portable que contiene la foto exacta de la base de datos al segundo.
          </p>
          <button 
            onClick={handleExport}
            disabled={downloading || uploading}
            className="w-full py-4 text-white bg-emerald-500 hover:bg-emerald-600 font-black rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {downloading ? 'Compilando JSON...' : 'Generar Exportación JSON'}
          </button>
        </div>

        {/* IMPORT CARD */}
        <div className="bg-white p-8 rounded-3xl border-2 border-red-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-xl transition-all hover:border-red-200">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
            Zona de Riesgo
          </div>
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">Inyección Bottom-Up</h2>
          <p className="text-slate-500 text-sm mb-8">
            Selecciona el archivo <b>.json</b> previamente exportado. Esta acción purga la nube y la rescribe desde cero. <b className="text-red-500">Irreversible.</b>
          </p>
          <label className="w-full py-4 text-rose-600 bg-rose-50 hover:bg-rose-100 font-black border-2 border-dashed border-rose-200 rounded-2xl cursor-pointer transition-all flex items-center justify-center group-hover:border-rose-400">
            {uploading ? 'Restaurando Nodos...' : 'Seleccionar JSON'}
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImport} 
              disabled={downloading || uploading}
            />
          </label>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-200">
         <h4 className="font-bold flex items-center text-slate-700 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            Metodología de Restauración
         </h4>
         <p className="text-xs text-slate-500 leading-relaxed text-left">
           El backend intercepta el modelo Prisma relacional. Primero, borra el árbol comenzando por las hojas (Diagóstikos, Pagos, Cursos) hasta llegar a los Usuarios raíz. 
           Luego, inyecta el JSON en orden top-down (Usuarios &gt; Profiles &gt; Cursos &gt; Diagnostic &gt; Appointments &gt; Pagos). Solo se recomienda restaurar usando un JSON creado desde esta misma ventana.
         </p>
      </div>

    </div>
  );
}

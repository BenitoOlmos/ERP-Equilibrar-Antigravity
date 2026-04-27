import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Network, Search, AlertCircle, CheckCircle2, RefreshCw, Key, Link as LinkIcon, ShieldAlert, Cpu } from 'lucide-react';

export default function TestWhatsapp() {
  const [config, setConfig] = useState({
    verifyToken: '',
    accessToken: '',
    phoneId: ''
  });
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchConfig();
    runDiagnostics();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get('/api/whatsapp/config');
      if (res.data) {
        setConfig({
          verifyToken: res.data.verifyToken || '',
          accessToken: res.data.accessToken || '',
          phoneId: res.data.phoneId || ''
        });
      }
    } catch (e) {
      console.error("Error fetching config", e);
    }
  };

  const runDiagnostics = async () => {
    setChecking(true);
    try {
      const res = await axios.get('/api/whatsapp/diagnostics');
      setDiagnostics(res.data);
    } catch (e) {
      console.error("Error running diagnostics", e);
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await axios.post('/api/whatsapp/config', config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      runDiagnostics();
    } catch (e) {
      console.error("Error saving config", e);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'ONLINE') return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (status === 'CONNECTING') return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse';
    return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  };

  const getStatusText = (status: string) => {
    if (status === 'ONLINE') return 'text-emerald-600';
    if (status === 'CONNECTING') return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Ecosistema Meta</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Configuración y Diagnóstico de conexión en tiempo real con Meta WhatsApp Business.
          </p>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={checking}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Testeando Red...' : 'Testear Conexión'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Credenciales Webhook Meta</h2>
                <p className="text-xs text-slate-500 font-medium">Bóveda asegurada por Prisma ORM</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Paso 1: Token de Verificación Interno</label>
              <p className="text-xs text-slate-500 mb-2 font-medium">Es la contraseña que inventarás en Meta para que Facebook verifique que somos nosotros. Sugerencia: mantenla igual.</p>
              <input
                type="text"
                required
                value={config.verifyToken}
                onChange={e => setConfig({ ...config, verifyToken: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-mono"
                placeholder="Ejemplo: mi_token_secreto_h7"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Paso 2: Token de Acceso Permanente Meta</label>
              <p className="text-xs text-slate-500 mb-2 font-medium">El Token súper largo EAAO... que te da Meta para enviar mensajes.</p>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={config.accessToken}
                  onChange={e => setConfig({ ...config, accessToken: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-mono pr-10"
                  placeholder="EAAOlZ..."
                />
                <ShieldAlert className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Paso 3: ID de Número de Teléfono Meta</label>
              <p className="text-xs text-slate-500 mb-2 font-medium">No es el número, es el ID numérico que Meta asigna a tu número.</p>
              <input
                type="text"
                required
                value={config.phoneId}
                onChange={e => setConfig({ ...config, phoneId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-mono"
                placeholder="Ej: 1234567890123"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
               {saveSuccess ? (
                 <span className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" /> Guardado
                 </span>
               ) : <span></span>}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? 'Aplicando...' : 'Aplicar Credenciales'}
              </button>
            </div>
          </form>
        </div>

        {/* Columna Derecha: Semáforos */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden text-slate-300">
          <div className="p-6 border-b border-slate-800 bg-black/20">
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Semáforos En Vivo</h2>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Sistema Webhook */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 relative">
                <div className={`w-4 h-4 rounded-full ${getStatusColor('ONLINE')}`}></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">Puerto de Escucha Webhook</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tu servidor recibe tráfico POST. <br/><span className="text-emerald-400 font-mono">200 OK</span>
                </p>
              </div>
            </div>

            {/* Vertex AI */}
            <div className="flex items-start gap-4 relative">
              <div className="absolute left-[7px] -top-8 w-0.5 h-8 bg-slate-800"></div>
              <div className="flex-shrink-0 mt-1 relative">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(diagnostics?.vertexEngineStatus || 'CONNECTING')}`}></div>
              </div>
              <div>
                <h4 className={`font-bold text-sm mb-1 ${getStatusText(diagnostics?.vertexEngineStatus || '')}`}>Capa Vertex AI Flash</h4>
                <p className="text-xs text-slate-400 leading-relaxed w-full">
                  {diagnostics?.vertexInfo || 'Esperando respuesta...'}
                </p>
              </div>
            </div>

            {/* Meta Graph */}
            <div className="flex items-start gap-4 relative">
              <div className="absolute left-[7px] -top-8 w-0.5 h-8 bg-slate-800"></div>
              <div className="flex-shrink-0 mt-1 relative">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(diagnostics?.metaGraphStatus || 'CONNECTING')}`}></div>
              </div>
              <div>
                <h4 className={`font-bold text-sm mb-1 ${getStatusText(diagnostics?.metaGraphStatus || '')}`}>Túnel Graph Facebook</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {diagnostics?.metaInfo || 'Esperando respuesta...'}
                </p>
              </div>
            </div>

          </div>

          <div className="p-4 bg-slate-800/50 border-t border-slate-800 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-500/80 leading-relaxed">
                 Si Vertex y Graph están verdes, el Chatbot puede conversar autónomamente con el mundo.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}

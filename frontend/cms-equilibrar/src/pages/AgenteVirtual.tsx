import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Bot, Save, Sparkles, Activity, FileText, LayoutDashboard, BrainCircuit, RefreshCw, MessageCircle } from 'lucide-react';

interface ConfiguredAgent {
  id: string;
  systemPrompt: string;
  welcomeMessage: string;
}

interface ServiceItem {
  id: string;
  title: string;
  name?: string;
  type: 'PROGRAM' | 'COURSE' | 'RFAI';
  virtualAgent: ConfiguredAgent | null;
}

export default function AgenteVirtual() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/master/virtual-agents');
      
      const mappedPrograms = (response.data.programs || []).map((p: any) => ({
        ...p, type: 'PROGRAM', title: p.name
      }));
      const mappedCourses = (response.data.courses || []).map((c: any) => ({
        ...c, type: 'COURSE'
      }));
      const mappedRFAI = (response.data.rfaiServices || []).map((r: any) => ({
        ...r, type: 'RFAI'
      }));

      setServices([...mappedPrograms, ...mappedCourses, ...mappedRFAI]);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Error al cargar servicios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setSystemPrompt(service.virtualAgent?.systemPrompt || '');
    setWelcomeMessage(service.virtualAgent?.welcomeMessage || '');
  };

  const handleSave = async () => {
    if (!selectedService) return;
    if (!systemPrompt.trim()) {
      alert('El System Prompt es obligatorio');
      return;
    }

    setIsSaving(true);
    try {
      const resp = await axios.post('/api/master/virtual-agents/upsert', {
        serviceType: selectedService.type,
        serviceId: selectedService.id,
        systemPrompt,
        welcomeMessage
      });

      alert('Agente configurado exitosamente');
      
      const updatedAgent = resp.data;
      setServices(prev => prev.map(s => {
        if (s.id === selectedService.id) {
          return { ...s, virtualAgent: updatedAgent };
        }
        return s;
      }));
      
      setSelectedService(prev => prev ? { ...prev, virtualAgent: updatedAgent } : null);
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Ocurrió un error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="font-outfit flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Bot className="w-8 h-8 text-indigo-500" />
            Control de Agentes Virtuales
          </h1>
          <p className="text-slate-500 mt-2 font-inter text-sm max-w-2xl">
            Diseña el cerebro (Prompt) y las reglas de integración con Vertex AI. Cada servicio listado aquí 
            actúa como un contenedor para un sub-agente experto que interactuará con el paciente dentro de su portal.
          </p>
        </div>
        <button 
          onClick={fetchServices}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all focus:ring-4 focus:ring-slate-100 font-medium text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refrescar Lista
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Left Column: Services Matrix */}
        <div className="lg:col-span-4 flex flex-col gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-5 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 font-outfit mb-2 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            Servicios Activos
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 font-inter custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center text-slate-500 py-10 bg-white rounded-2xl border border-slate-200 border-dashed">
                No hay servicios creados aún.
              </div>
            ) : (
              services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border shadow-sm group hover:-translate-y-0.5 ${
                    selectedService?.id === service.id 
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-indigo-200' 
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                      selectedService?.id === service.id 
                        ? 'bg-indigo-500/50 text-indigo-100' 
                        : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      {service.type === 'PROGRAM' ? 'PROGRAMA' : service.type === 'COURSE' ? 'CURSO' : 'RFAI'}
                    </span>
                    {service.virtualAgent ? (
                      <span className="flex h-3 w-3 relative" title="Agente Activo">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    ) : (
                      <span className={`w-3 h-3 rounded-full ${selectedService?.id === service.id ? 'bg-indigo-400/30' : 'bg-slate-200'}`} title="Sin Agente"></span>
                    )}
                  </div>
                  <h3 className={`font-semibold line-clamp-2 text-sm leading-snug ${selectedService?.id === service.id ? 'text-white' : 'text-slate-800'}`}>
                    {service.title || service.name}
                  </h3>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Prompt Editor */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          {!selectedService ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 flex items-center justify-center ring-8 ring-slate-50/50">
                <BrainCircuit className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 font-outfit mb-2">Selecciona un Servicio</h3>
              <p className="max-w-md font-inter text-sm">Escoge un Curso, Programa o Tratamiento del lado izquierdo para despertar a su Agente Virtual y programar su cerebro.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 font-inter">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 font-outfit flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Arquitectura de Agente
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Configurando módulo para: <span className="font-semibold text-slate-700">{selectedService.title || selectedService.name}</span></p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 group"
                >
                  <Save className={`w-4 h-4 ${isSaving ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
                  {isSaving ? 'Inyectando...' : 'Guardar Cerebro'}
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 font-outfit">
                    <BrainCircuit className="w-4 h-4 text-slate-400" />
                    System Prompt Principal
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Instrucciones secretas y directrices de personalidad que el paciente nunca verá. Usa lenguaje técnico MD o texto plano.</p>
                  <div className="relative">
                    <textarea 
                      value={systemPrompt}
                      onChange={e => setSystemPrompt(e.target.value)}
                      placeholder="Ej: Eres un terapeuta experto asignado al curso de Autoestima. Tu objetivo es escuchar empáticamente y sugerir audios del módulo vigente..."
                      className="w-full h-64 p-4 bg-slate-900 text-emerald-400 font-mono text-sm leading-relaxed rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent custom-scrollbar resize-none shadow-inner"
                      spellCheck="false"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md uppercase tracking-wide">Vertex AI Ready</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 font-outfit">
                    <MessageCircle className="w-4 h-4 text-slate-400" />
                    Mensaje Inicial de Bienvenida (Opcional)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Lo primero que verá el cliente al abrir el chat dentro del servicio.</p>
                  <textarea 
                    value={welcomeMessage}
                    onChange={e => setWelcomeMessage(e.target.value)}
                    placeholder="Ej: ¡Hola! Soy tu asistente virtual para este tratamiento. Si tienes preguntas, escríbelas aquí."
                    className="w-full p-4 bg-slate-50 text-slate-800 text-sm leading-relaxed rounded-2xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}

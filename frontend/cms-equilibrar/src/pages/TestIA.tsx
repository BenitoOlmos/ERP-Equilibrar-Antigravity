import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrainCircuit, Database, Key, CheckCircle, XCircle, Send, Loader2 } from 'lucide-react';

interface Diagnostics {
  db: boolean;
  apiKey: boolean;
  aiEngine: boolean;
  geminiVersion: string;
  error: string | null;
}

export default function TestIA() {
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/master/ai/status');
      setDiagnostics(res.data);
    } catch (error) {
      console.error('Error fetching AI diagnostics:', error);
      setDiagnostics({
        db: false, apiKey: false, aiEngine: false, geminiVersion: 'Unknown', error: 'Network Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isTyping) return;
    
    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const res = await axios.post('/api/master/ai/test-chat', { 
        message: userMsg,
        model: diagnostics?.geminiVersion || 'gemini-2.5-flash'
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error: any) {
      setChatHistory(prev => [...prev, { role: 'ai', text: '❌ Error: ' + (error.response?.data?.error || error.message) }]);
    } finally {
      setIsTyping(false);
    }
  };

  const StatusItem = ({ label, active, icon: Icon, errorText }: { label: string, active: boolean, icon: any, errorText?: string }) => (
    <div className={`p-4 rounded-2xl border flex items-center justify-between ${active ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-outfit font-semibold text-slate-800">{label}</p>
          {!active && errorText && <p className="text-xs text-red-500 mt-1">{errorText}</p>}
        </div>
      </div>
      {active ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-outfit flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            Consola Test IA (Gemini)
          </h1>
          <p className="text-slate-500 mt-2 font-inter text-sm">
            Diagnóstico de conectividad en tiempo real entre el servidor, Vertex AI y la base de datos.
          </p>
        </div>
        <button 
          onClick={checkStatus}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Reescanear Conexión
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : diagnostics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-inter">
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-outfit text-slate-800 border-b pb-2 mb-4">Semáforo de Subsistemas</h2>
            <StatusItem 
              label="GEMINI_API_KEY .env" 
              active={diagnostics.apiKey} 
              icon={Key} 
              errorText="Lave no encontrada en el .env del servidor"
            />
            <StatusItem 
              label="Base de Datos Agentes" 
              active={diagnostics.db} 
              icon={Database} 
              errorText="Error leyendo esquema VirtualAgent"
            />
            <StatusItem 
              label={`Motor Conectado (${diagnostics.geminiVersion})`}
              active={diagnostics.aiEngine} 
              icon={BrainCircuit}
              errorText={diagnostics.error || 'Google GenAI rechazó ping'}
            />
          </div>

          <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col h-[400px]">
            <h2 className="text-lg font-bold font-outfit text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              Simulador Raw Chat
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-slate-400 py-10 text-sm">
                  Envía un mensaje para saludar al modelo {diagnostics.geminiVersion}.
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pregúntale algo a Gemini..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!diagnostics.aiEngine}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!diagnostics.aiEngine || isTyping || !chatMessage.trim()}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

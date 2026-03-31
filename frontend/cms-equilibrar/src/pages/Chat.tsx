import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, MessageCircle, Send, User as UserIcon } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
        setFilteredPatients(patients);
    } else {
        setFilteredPatients(patients.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, patients]);

  const fetchPatients = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/data/users'),
      axios.get('/api/data/payments'),
      axios.get('/api/data/payments/catalog')
    ])
      .then(([resUsers, resFinance, resCatalog]) => {
        const payments = resFinance.data || [];
        const catalog = resCatalog.data || { programs: [], treatments: [], courses: [] };
        
        const validConcepts = [
          ...(catalog.programs || []).map((p: any) => p.title),
          ...(catalog.treatments || []).map((p: any) => p.name),
          ...(catalog.courses || []).map((c: any) => c.title)
        ];

        const validPaymentUserIds = new Set(
          payments
            .filter((p: any) => p.status === 'COMPLETED' && p.concept && validConcepts.includes(p.concept))
            .map((p: any) => p.userId)
        );

        const activeUsers = resUsers.data.filter((u: any) => validPaymentUserIds.has(u.id));
        setPatients(activeUsers);
        setFilteredPatients(activeUsers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const loadConversation = async (patientId: string) => {
    try {
        const res = await axios.get(`/api/data/messages/conversation/${user?.id}/${patientId}`);
        setMessages(res.data);
        setTimeout(scrollToBottom, 100);
    } catch (e) {
        console.error("Error cargando conversación", e);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setMessages([]);
    loadConversation(patient.id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatient) return;
    
    try {
        const res = await axios.post('/api/data/messages/send', {
            senderId: user?.id,
            receiverId: selectedPatient.id,
            content: newMessage
        });
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
        setTimeout(scrollToBottom, 100);
    } catch (e) {
        console.error("Error al enviar mensaje", e);
    }
  };

  const getInitials = (name: string) => {
      if (!name) return 'U';
      const parts = name.split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-40 hidden md:block">
            <div className="relative">
                <button className="text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" tabIndex={0}>
                    <Bell className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* Columna Izquierda: Lista de Contactos */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 shadow-sm p-4 h-[40vh] md:h-full shrink-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Mensajes Directos</h2>
            
            <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    placeholder="Buscar paciente para chatear..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0097B2] dark:text-white" 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="w-6 h-6 border-2 border-[#0097B2] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="text-center p-4 text-slate-500 text-sm">No hay pacientes disponibles.</div>
                ) : (
                    filteredPatients.map((p) => (
                        <div 
                            key={p.id}
                            onClick={() => handleSelectPatient(p)}
                            className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 border ${selectedPatient?.id === p.id ? 'bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-transparent dark:border-slate-700/50'}`}
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                {getInitials(p.name || p.email)}
                            </div>
                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                <p className="font-bold text-sm truncate leading-tight text-slate-700 dark:text-white">{p.name || p.email}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Columna Derecha: El Chat */}
        <div className="w-full md:w-2/3 h-[50vh] md:h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative z-20">
            {!selectedPatient ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-medium">Selecciona un paciente para comenzar a chatear.</p>
                </div>
            ) : (
                <div className="flex flex-col h-full animate-fade-in flex-1 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-[#0097B2] flex items-center justify-center font-bold text-sm">
                                {getInitials(selectedPatient.name || selectedPatient.email)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Chat con {selectedPatient.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1">Respuestas en tiempo real</p>
                            </div>
                        </div>
                        <MessageCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-slate-800 flex flex-col gap-3">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inicia la conversación enviando un mensaje.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] px-4 py-2 text-sm shadow-sm rounded-2xl ${isMe ? 'bg-[#0097B2] text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                                            {new Date(msg.createdAt).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2 shrink-0">
                        <input 
                            placeholder="Escribe un mensaje para el paciente..." 
                            className="flex-1 bg-slate-50 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0097B2]/50" 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()} 
                            className="w-10 h-10 bg-[#0097B2] text-white rounded-xl flex items-center justify-center hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    </div>
  );
}

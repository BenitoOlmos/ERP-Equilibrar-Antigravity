import React, { useState, useEffect, useRef } from 'react';
import axios from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Send, User, MessageCircle, Bot, Power, PowerOff, Building, CheckCircle, Clock, Mail, Phone, FileText, Calendar, Plus } from 'lucide-react';

export default function Whatsapp() {
    const { user } = useAuth();
    const [leads, setLeads] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchLeads = async () => {
        try {
            const res = await axios.get('/api/whatsapp/leads');
            setLeads(res.data);
            if (!selectedLead && res.data.length > 0) {
                setSelectedLead(res.data[0]);
            }
            setLoading(false);
        } catch (e) {
            console.error("Error fetching leads", e);
            setLoading(false);
        }
    };

    const fetchMessages = async (leadId: string) => {
        try {
            const res = await axios.get(`/api/whatsapp/leads/${leadId}/messages`);
            setMessages(res.data);
            setTimeout(scrollToBottom, 100);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchLeads();
        const interval = setInterval(() => {
            fetchLeads();
            if (selectedLead) {
                fetchMessages(selectedLead.id);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedLead]);

    useEffect(() => {
        if (selectedLead) {
            fetchMessages(selectedLead.id);
        }
    }, [selectedLead]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedLead) return;
        setSending(true);
        try {
             await axios.post(`/api/whatsapp/leads/${selectedLead.id}/send`, { text: newMessage });
             setNewMessage('');
             fetchMessages(selectedLead.id);
        } catch (e) {
             console.error("Error sending message", e);
        } finally {
             setSending(false);
        }
    };

    const toggleBotStatus = async () => {
        if (!selectedLead) return;
        const newStatus = selectedLead.status === 'BOT' ? 'HUMAN' : 'BOT';
        try {
            await axios.put(`/api/whatsapp/leads/${selectedLead.id}/status`, { status: newStatus });
            setSelectedLead({ ...selectedLead, status: newStatus });
            const leadsObj = [...leads];
            const i = leadsObj.findIndex(l => l.id === selectedLead.id);
            if(i!==-1) leadsObj[i].status = newStatus;
            setLeads(leadsObj);
        } catch (e) {
            console.error("Error toggling bot", e);
        }
    };

    // --- MOCK DATA FOR DEMONSTRATION IF NO LEADS ---
    const displayLeads = leads.length > 0 ? leads : [
        { id: '1', name: 'Paola Díaz', phone: '+56989214464', status: 'HUMAN', updatedAt: new Date().toISOString(), unreadCount: 1, type: 'Consulta', category: 'Psiquiatría', emotion: '😠' },
        { id: '2', name: 'Juan Garay', phone: '+56912345678', status: 'HUMAN', updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), unreadCount: 0, type: 'Nuevo', category: 'Psicología', emotion: '😊' },
        { id: '3', name: 'Cecilia', phone: '+56987654321', status: 'BOT', updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), unreadCount: 0, type: 'Consulta', category: 'Terapia', emotion: '😊' },
        { id: '4', name: 'Santiago', phone: '+56955555555', status: 'HUMAN', updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), unreadCount: 0, type: 'Evaluación', category: 'Psiquiatría', emotion: '🥶' },
    ];

    const stats = [
        { label: 'Total', count: 221, sub: '6 esta semana', color: 'slate' },
        { label: 'Pacientes Nuevos', count: 99, sub: '4 esta semana', color: 'blue' },
        { label: 'Consultas', count: 87, sub: '2 esta semana', color: 'amber' },
        { label: 'Evaluaciones', count: 31, sub: '0 esta semana', color: 'orange' },
        { label: 'Alta Médica', count: 0, sub: '0 esta semana', color: 'emerald' },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Stats Top Bar */}
            <div className="p-4 sm:p-6 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-sm">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`p-4 rounded-3xl border shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${
                            stat.color === 'slate' ? 'bg-slate-100 dark:bg-slate-800 ring-2 ring-[#00A89C] ring-offset-2 dark:ring-offset-slate-900 border-[#00A89C]' :
                            stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-transparent' :
                            stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 border-transparent' :
                            stat.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-transparent' :
                            'bg-emerald-50 dark:bg-emerald-900/20 border-transparent'
                        }`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.label}</p>
                            <h3 className={`text-2xl font-black mt-1 ${
                                stat.color === 'slate' ? 'text-slate-600 dark:text-slate-300' :
                                stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                                stat.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                'text-emerald-600 dark:text-emerald-400'
                            }`}>{stat.count}</h3>
                            <p className="text-[9px] font-black opacity-50 mt-1 uppercase tracking-wider">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Col 1: Chat List */}
                <aside className="w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-xl text-slate-800">Conversaciones</h3>
                            <button className="p-2 bg-[#00A89C]/10 text-[#00A89C] hover:bg-[#00A89C] hover:text-white rounded-xl transition-colors cursor-pointer" title="Iniciar Nuevo Chat Privado">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-4 relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input placeholder="Buscar chat..." className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm transition-all focus:ring-2 focus:ring-[#00A89C] mb-3 outline-none" type="text" />
                        </div>
                        <div className="relative z-50 w-full">
                            <button className="w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm transition-all group outline-none border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 transition-colors text-slate-400 group-hover:text-[#00A89C]" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">Histórico Completo</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {displayLeads.map((lead: any, idx) => {
                            const isSelected = selectedLead?.id === lead.id;
                            const emotion = lead.emotion || '😊';
                            const borderColor = idx % 4 === 0 ? 'border-l-red-500' : idx % 4 === 1 ? 'border-l-emerald-500' : idx % 4 === 2 ? 'border-l-purple-500' : 'border-l-yellow-400';
                            const initial = (lead.name || lead.phone || '?').charAt(0).toUpperCase();

                            return (
                                <button 
                                    key={lead.id}
                                    onClick={() => {
                                        setSelectedLead(lead);
                                        if (lead.unreadCount > 0 && lead.id !== '1' && lead.id !== '2') { // Real leads check
                                            axios.put(`/api/whatsapp/leads/${lead.id}/read`).catch(console.error);
                                            setLeads(currentLeads => currentLeads.map(l => l.id === lead.id ? { ...l, unreadCount: 0 } : l));
                                        }
                                    }}
                                    className={`w-full p-4 flex items-start gap-4 transition-all border-b border-slate-100 dark:border-slate-800 relative border-l-4 ${borderColor} ${isSelected ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    <div className="relative shrink-0 mt-1">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-black/5 dark:border-white/5 bg-[#00A89C]/10 text-[#00A89C]">
                                            {initial}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center text-[10px] bg-white" title="Estado">
                                            {emotion}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-sm truncate text-slate-900 dark:text-white flex items-center gap-1">{lead.name || lead.phone}</p>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[10px] font-bold text-slate-500">{new Date(lead.updatedAt).toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-1 font-medium">Último mensaje recibido o enviado en la conversación...</p>
                                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                                            <span className="px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 bg-slate-100 text-slate-600 border-slate-200">
                                                📌 {lead.type || 'Consulta'}
                                            </span>
                                            {lead.status === 'BOT' ? (
                                                <span className="px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
                                                    🤖 Agente Virtual
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm">
                                                    🧑‍💻 Control Humano
                                                </span>
                                            )}
                                            {lead.category && (
                                                <span className="px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 bg-slate-100 text-slate-600 border-slate-200">
                                                    🏥 {lead.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Col 2: Chat Interface */}
                {selectedLead ? (
                    <div className="flex-1 flex flex-col bg-[#E6DDD4] relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px', opacity: 0.95 }}>
                        {/* Header Chat */}
                        <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#00A89C]/10 flex items-center justify-center font-bold text-[#00A89C] text-xl">
                                    {(selectedLead.name || selectedLead.phone || '?').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-lg leading-tight">{selectedLead.name || selectedLead.phone}</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedLead.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase text-slate-400 mr-2">Control IA:</span>
                                <button 
                                    onClick={toggleBotStatus}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${selectedLead.status === 'BOT' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100' : 'bg-slate-700 text-white hover:bg-slate-800'}`}
                                >
                                    {selectedLead.status === 'BOT' ? <><Bot className="w-4 h-4"/> Bot Respondiendo</> : <><User className="w-4 h-4"/> Control Humano</>}
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 relative z-10 w-full max-w-4xl mx-auto custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="mx-auto mt-10 bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-sm max-w-sm border border-[#00A89C]/20">
                                    <span className="bg-[#00A89C]/10 text-[#00A89C] text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">WhatsApp Conectado</span>
                                    <p className="text-slate-600 text-sm font-medium">Esta conversación inicia en el servidor. Envíale el primer mensaje al contacto o espera su respuesta.</p>
                                </div>
                            )}
                            {messages.map((msg) => {
                                const isPatient = msg.sender === 'USER';
                                const isBot = msg.sender === 'BOT';
                                return (
                                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${isPatient ? 'self-start items-start' : 'self-end items-end'}`}>
                                        <div className={`p-3 rounded-2xl relative shadow-sm ${
                                            isPatient ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100' : 
                                            isBot ? 'bg-[#D1F4CC] text-slate-900 rounded-tr-sm border border-[#A7EBA5]/50' : 
                                            'bg-[#E2F7CB] text-slate-800 rounded-tr-sm border border-[#C5F3A9]/50'
                                        }`}>
                                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
                                            <span className="text-[10px] text-slate-500 block text-right mt-1.5 font-medium -mb-1 select-none">
                                                {isBot && <Bot className="w-3 h-3 inline mr-1 text-indigo-500 opacity-70" />}
                                                {new Date(msg.createdAt).toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-[#F0F2F5] px-6 py-4 border-t border-slate-300 z-20">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
                                {selectedLead.status === 'BOT' && (
                                    <div className="absolute left-1/2 -top-12 -translate-x-1/2 bg-slate-800 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce">
                                        <Bot className="w-4 h-4 text-indigo-400" /> La IA está administrando esta conversación
                                    </div>
                                )}
                                <input 
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder={selectedLead.status === 'BOT' ? "La IA está activa. Pausa al bot para intervenir..." : "Escribe un mensaje a WhatsApp..."}
                                    className={`flex-1 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 transition-all shadow-sm ${selectedLead.status === 'BOT' ? 'bg-slate-200 text-slate-500 placeholder-slate-400 focus:ring-slate-300' : 'bg-white text-slate-800 focus:ring-[#00A89C]/50'}`}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim() || sending}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform shadow-sm ${newMessage.trim() ? (selectedLead.status === 'BOT' ? 'bg-slate-700 text-white' : 'bg-[#00A884] text-white hover:scale-105 active:scale-95') : 'bg-slate-300 text-slate-500'}`}
                                >
                                    <Send className="w-5 h-5 ml-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-100">
                        <div className="text-center text-slate-400">
                            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <h2 className="text-xl font-bold mb-2">WhatsApp Web Hub</h2>
                            <p className="text-sm">Selecciona una conversación a la izquierda para interactuar.</p>
                        </div>
                    </div>
                )}

                {/* Col 3: Lead CRM Data Card */}
                {selectedLead && (
                    <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar hidden lg:flex">
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-[#00A89C]/10 mb-4 overflow-hidden border-4 border-white shadow-md flex items-center justify-center font-bold text-[#00A89C] text-3xl">
                                {(selectedLead.name || selectedLead.phone || '?').charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-black text-slate-800 leading-tight">{selectedLead.name || 'Sin Nombre Capturado'}</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">{selectedLead.phone}</p>
                        </div>

                        <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 mb-6 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-4 flex items-center gap-2">
                               <Bot className="w-4 h-4" /> Inteligencia Artificial
                            </h4>
                            <p className="text-xs text-indigo-900/80 font-medium leading-relaxed">
                                Los datos de este panel son extraídos automáticamente en tiempo real por el Agente Virtual basándose en lo que el paciente conversa.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Correo Electrónico</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedLead.email || '—'}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <Building className="w-5 h-5 text-slate-400" />
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Previsión / Isapre</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedLead.isapre || '—'}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Horas Solicitadas</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedLead.requestedHours || '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

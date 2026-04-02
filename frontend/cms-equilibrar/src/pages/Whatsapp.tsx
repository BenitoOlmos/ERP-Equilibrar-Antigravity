import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Send, User, MessageCircle, Bot, Power, PowerOff, Building, CheckCircle, Clock, Mail, Phone, FileText } from 'lucide-react';

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

    if (loading && leads.length === 0) {
        return (
            <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] bg-[#E8EDF2] flex overflow-hidden">
            {/* Col 1: Lead List */}
            <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col z-10 flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="p-5 border-b border-slate-100 bg-[#F8FAFC]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <MessageCircle className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 leading-tight">Hub Meta</h2>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">WhatsApp Business</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {leads.map(lead => (
                        <div 
                            key={lead.id} 
                            onClick={() => setSelectedLead(lead)}
                            className={`p-4 border-b border-slate-100 cursor-pointer flex gap-4 transition-colors ${selectedLead?.id === lead.id ? 'bg-emerald-50 relative' : 'hover:bg-slate-50 bg-white'}`}
                        >
                            {selectedLead?.id === lead.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${lead.name || lead.phone}&backgroundColor=e2e8f0&textColor=475569`} alt="User" className="w-full h-full object-cover" />
                                {lead.status === 'BOT' && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                                        <Bot className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{lead.name || lead.phone}</h4>
                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                        {new Date(lead.updatedAt).toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{lead.phone}</p>
                            </div>
                        </div>
                    ))}
                    {leads.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">Aún no hay conversaciones registradas.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Col 2: Chat Interface */}
            {selectedLead ? (
                <div className="flex-1 flex flex-col bg-[#E6DDD4] relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px', opacity: 0.95 }}>
                    {/* Header Chat */}
                    <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedLead.name || selectedLead.phone}&backgroundColor=e2e8f0`} alt="User avatar" />
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
                            <div className="mx-auto mt-10 bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-sm max-w-sm border border-emerald-100/50">
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">WhatsApp Conectado</span>
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
                                className={`flex-1 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 transition-all shadow-sm ${selectedLead.status === 'BOT' ? 'bg-slate-200 text-slate-500 placeholder-slate-400 focus:ring-slate-300' : 'bg-white text-slate-800 focus:ring-emerald-500/50'}`}
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
                <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 mb-4 overflow-hidden border-4 border-white shadow-md relative">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedLead.name || selectedLead.phone}&backgroundColor=bbf7d0&textColor=166534`} alt="User" />
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
                            Los datos de este panel son extraídos automáticamente en tiempo real por el Coordinador Clínico Virtual basándose puramente en lo que el paciente conversa.
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

                        <div className="flex gap-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <FileText className="w-5 h-5 text-amber-500" />
                            <div>
                                <span className="text-[10px] uppercase font-bold text-amber-600 block mb-0.5">Necesidad PostVenta</span>
                                <span className="text-sm font-bold text-slate-800 leading-snug block">{selectedLead.postSalesNeed || 'Ninguna registrada'}</span>
                            </div>
                        </div>

                        <div className="flex gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <div>
                                <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-0.5">Id Interno Lead</span>
                                <span className="text-xs font-mono font-bold text-slate-800" title={selectedLead.id}>...{selectedLead.id.slice(-8)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

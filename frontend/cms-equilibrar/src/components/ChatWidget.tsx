import React, { useState, useEffect, useRef } from 'react';
import axios from '../api';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, X, Send, User } from 'lucide-react';

export default function ChatWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Only render for Clients (or Patients)
    if (user?.role !== 'Cliente' && user?.role !== 'Patient' && user?.role !== 'CLIENT') {
        return null;
    }

    const loadConversation = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await axios.get(`/api/data/messages/history/${user?.id}`);
            const newMessages = res.data.reverse();
            setMessages(prev => {
                // Solo auto-scroleamos si detectamos que entraron nuevos mensajes
                if (prev.length !== newMessages.length) {
                    setTimeout(scrollToBottom, 200);
                }
                return newMessages;
            });
        } catch (e) {
            console.error("Error al cargar historial de chat", e);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isOpen) {
            loadConversation();
            interval = setInterval(() => {
                loadConversation(true);
            }, 5000); // Poll every 5 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user?.id) return;
        
        try {
            const res = await axios.post('/api/data/messages/send', {
                senderId: user.id,
                // receiverId missing automatically routes to admin/specialist team on the backend
                content: newMessage
            });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
            setTimeout(scrollToBottom, 100);
        } catch (e) {
            console.error("Error enviando mensaje al equipo", e);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-[350px] sm:w-[400px] h-[550px] flex flex-col mb-4 animate-fade-in origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0097B2] to-[#00A89C] p-4 text-white flex items-center justify-between shrink-0 shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight">Equipo Clínico</h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">En línea</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3 relative">
                        {loading && messages.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
                                <div className="w-8 h-8 border-4 border-[#0097B2] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center mt-10 p-4">
                                <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h4 className="text-slate-600 font-bold mb-1">¿En qué podemos ayudarte?</h4>
                                <p className="text-xs text-slate-400">Escribe directamente y un especialista te responderá apenas se encuentre disponible.</p>
                            </div>
                        ) : (
                            messages.map((msg: any, i: number) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        {!isMe && i === 0 && (
                                            <span className="text-xs font-bold text-slate-500 mb-1 ml-1">{msg.sender?.name || 'Clínica Equilibrar'}</span>
                                        )}
                                        <div className={`max-w-[85%] px-4 py-2.5 text-sm shadow-sm rounded-2xl break-words whitespace-pre-wrap ${isMe ? 'bg-[#0097B2] text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'}`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                                            {new Date(msg.createdAt).toLocaleString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
                        <input 
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0097B2]/50 focus:border-[#0097B2]"
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim() || loading}
                            className="w-10 h-10 bg-[#0097B2] hover:bg-cyan-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:scale-100 shadow-sm shadow-[#0097B2]/30 active:scale-95 flex-shrink-0"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Float Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-[#0097B2] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all group relative border-4 border-white/20"
                >
                    <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                    </span>
                </button>
            )}
        </div>
    );
}

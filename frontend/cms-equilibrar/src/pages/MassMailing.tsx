import React, { useState, useRef, useMemo } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
    Mail, Users, PenTool, Eye, Send, FileUp, AlertCircle, 
    CheckCircle2, ArrowRight, ArrowLeft, Loader2, Play 
} from 'lucide-react';

interface Recipient {
    email: string;
    name?: string;
}

export function MassMailing() {
    const [step, setStep] = useState<number>(1);
    const [rawList, setRawList] = useState<string>('');
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [subject, setSubject] = useState<string>('');
    const [htmlContent, setHtmlContent] = useState<string>('<p>Hola {{nombre}}!</p><br/><p>Escribe tu mensaje aquí...</p>');
    
    // Test logic
    const [testEmail, setTestEmail] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    // Bulk logic
    const [isSendingBulk, setIsSendingBulk] = useState(false);
    const [bulkSuccess, setBulkSuccess] = useState(false);

    // Step 1: Processing the DB
    const processDatabase = () => {
        const lines = rawList.split(/\r?\n/);
        const parsed: Recipient[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        lines.forEach(line => {
            if (!line.trim()) return;
            // Support formats: "email@domain.com" OR "John Doe, email@domain.com"
            const parts = line.split(',');
            if (parts.length === 1) {
                const email = parts[0].trim();
                if (emailRegex.test(email)) parsed.push({ email, name: 'Paciente' });
            } else {
                const possibleEmail = parts[parts.length - 1].trim();
                const possibleName = parts.slice(0, parts.length - 1).join(' ').trim();
                
                if (emailRegex.test(possibleEmail)) {
                    parsed.push({ email: possibleEmail, name: possibleName || 'Paciente' });
                } else if (emailRegex.test(parts[0].trim())) {
                    // Reversed: email, name
                    parsed.push({ email: parts[0].trim(), name: parts.slice(1).join(' ').trim() || 'Paciente' });
                }
            }
        });

        // Deduplicate by email
        const unique = Array.from(new Map(parsed.map(item => [item.email.toLowerCase(), item])).values());

        setRecipients(unique);
        if (unique.length > 0) {
            setStep(2);
        } else {
            alert('No se encontraron correos electrónicos válidos en el texto. Revisa el formato.');
        }
    };

    const handleTestSend = async () => {
        if (!testEmail || !subject || !htmlContent) {
            alert('Falta correo de prueba, asunto o contenido.');
            return;
        }
        setIsTesting(true);
        try {
            // Apply a sample replacement for test preview
            const previewHtml = htmlContent.replace(/\{\{nombre\}\}/gi, 'Usuario Prueba');
            await axios.post('/api/mailing/test', {
                to: testEmail,
                subject,
                htmlContent: previewHtml
            });
            alert('Correo de prueba enviado con éxito. Revisa tu bandeja.');
        } catch (error: any) {
            alert('Error enviando correo de prueba: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsTesting(false);
        }
    };

    const handleBulkSend = async () => {
        if (!confirm(`¿Estás completamente seguro de enviar esta campaña a ${recipients.length} personas? Esta acción no se puede deshacer.`)) {
            return;
        }
        
        setIsSendingBulk(true);
        try {
            await axios.post('/api/mailing/bulk', {
                recipients,
                subject,
                htmlContent
            });
            setBulkSuccess(true);
            setStep(5); // Success Screen
        } catch (error: any) {
            alert('Fallo al iniciar el envío en masa: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSendingBulk(false);
        }
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }), []);

    return (
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
            <header className="mb-8 animate-fade-in shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
                        <Mail className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Campaña de Correos</h1>
                        <p className="text-slate-500 font-medium mt-1">Herramienta de marketing y envío masivo</p>
                    </div>
                </div>
            </header>

            {/* Stepper Wizard Indicator */}
            {step < 5 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6 shrink-0 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-10" />
                    {[
                        { id: 1, label: 'Base de Datos', icon: Users },
                        { id: 2, label: 'Diseño', icon: PenTool },
                        { id: 3, label: 'Pruebas', icon: Eye },
                        { id: 4, label: 'Envío Masivo', icon: Send }
                    ].map(st => {
                        const Icon = st.icon;
                        const active = step === st.id;
                        const done = step > st.id;
                        return (
                            <div key={st.id} className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer" onClick={() => step > st.id && setStep(st.id)}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                                    active ? 'bg-indigo-600 text-white scale-110 shadow-indigo-600/30' : 
                                    done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {done ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{st.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            )}

            <div className="flex-1 max-w-4xl mx-auto w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                {step === 1 && (
                    <div className="p-8 flex flex-col h-full animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Importar Base de Datos</h2>
                        <p className="text-sm text-slate-500 mb-6">Pega aquí los correos electrónicos de tus contactos. Puedes usar el formato <code>Nombre, correo@dominio.com</code> o simplemente una lista de correos separados por saltos de línea.</p>
                        
                        <div className="flex-1 relative">
                            <textarea 
                                value={rawList}
                                onChange={e => setRawList(e.target.value)}
                                placeholder="Juan Perez, juan@gmail.com&#10;maria@empresa.cl&#10;roberto@yahoo.es"
                                className="w-full h-full min-h-[300px] p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                            />
                            {rawList && (
                                <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    {rawList.split(/\n/).length} Líneas
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-between items-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                            <div className="flex items-start gap-3 text-indigo-800">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <strong>Consejo Antispam:</strong> Intenta no exceder los 500 receptores por lote diario desde una cuenta SMTP normal para proteger tu reputación en los servidores.
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={processDatabase}
                                disabled={!rawList.trim()}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl flex items-center transition-all shadow-lg hover:shadow-indigo-600/30"
                            >
                                Procesar Destinatarios <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-0 flex flex-col h-full animate-fade-in relative max-h-[800px]">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800 mb-1">Diseño del Mensaje</h2>
                            <p className="text-xs text-slate-500">Usa <code>{`{{nombre}}`}</code> en tu texto para insertar mágicamente el nombre del paciente en cada correo individual.</p>
                            
                            <div className="mt-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Asunto del Correo</label>
                                    <input 
                                        type="text" 
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="Ej: Te invitamos a conocer tu perfil emocional 🚀"
                                        className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* ReactQuill takes remaining space */}
                            <ReactQuill 
                                theme="snow" 
                                value={htmlContent} 
                                onChange={setHtmlContent}
                                modules={modules}
                                className="flex-1 flex flex-col h-[400px]"
                                style={{
                                    border: 'none',
                                    borderRadius: '0',
                                }}
                            />
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                            <button onClick={() => setStep(1)} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors">Volver</button>
                            <button 
                                onClick={() => setStep(3)}
                                disabled={!subject || !htmlContent}
                                className="px-6 py-3 bg-indigo-600 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl flex items-center transition-all shadow-lg hover:shadow-indigo-600/30"
                            >
                                Continuar a Prueba <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-8 flex flex-col h-full animate-fade-in relative bg-slate-50/30">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Preview Panel */}
                            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vista Previa Desktop</span>
                                    <div className="w-8"></div>
                                </div>
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="text-lg font-black text-slate-800">{subject}</h3>
                                    <p className="text-xs font-semibold text-slate-400 mt-1">De: Equipo Equilibrar</p>
                                </div>
                                <div className="p-8 flex-1 overflow-y-auto max-h-[400px] bg-white custom-scrollbar ql-editor" dangerouslySetInnerHTML={{ __html: htmlContent.replace(/\{\{nombre\}\}/gi, 'Francisca (Paciente de Prueba)') }}>
                                </div>
                            </div>

                            {/* Test Console */}
                            <div className="md:w-72 flex flex-col justify-center">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                        <Play className="w-4 h-4 text-indigo-500" /> Test Dinámico
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
                                        Envía una copia idéntica del diseño final a tu cuenta personal para verificar cómo se ve en tu dispositivo móvil y comprobar que no caiga en SPAM.
                                    </p>
                                    
                                    <div className="space-y-3">
                                        <input 
                                            type="email" 
                                            value={testEmail}
                                            onChange={e => setTestEmail(e.target.value)}
                                            placeholder="tucorreo@empresa.com"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                                        />
                                        <button 
                                            onClick={handleTestSend}
                                            disabled={!testEmail || isTesting}
                                            className="w-full px-4 py-2.5 bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center transition-all hover:bg-slate-800 active:scale-95"
                                        >
                                            {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mandar Prueba Analítica'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                            <button onClick={() => setStep(2)} className="px-5 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors">Atrás, quiero editar texto</button>
                            <button 
                                onClick={() => setStep(4)}
                                className="px-6 py-3 bg-emerald-500 text-white text-sm font-bold rounded-xl flex items-center transition-all shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-105"
                            >
                                Proceder a Plataforma de Envío
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="p-8 flex flex-col items-center justify-center text-center h-[500px] animate-fade-in relative bg-gradient-to-b from-slate-50 to-white">
                        
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <AlertCircle className="w-12 h-12 text-rose-500" />
                        </div>
                        
                        <h2 className="text-3xl font-black text-slate-800 mb-2">Punto de No Retorno</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                            El servidor alojado en Equilibrar despachará tu boletín oficial <strong>{subject}</strong> de manera progresiva (para no alertar filtros antispam) directo a la bandeja de <strong>{recipients.length} personas</strong>.
                        </p>

                        <div className="bg-white px-8 py-5 border border-slate-200 rounded-2xl shadow-sm mb-10 flex gap-12 text-left">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Base de Datos</p>
                                <p className="text-xl font-black text-indigo-600">{recipients.length} Correos</p>
                            </div>
                            <div className="w-px bg-slate-200"></div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Peso Estimado</p>
                                <p className="text-xl font-black text-slate-700">~Lote Simple</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStep(3)} 
                                disabled={isSendingBulk}
                                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
                            >
                                Cancelar Misión
                            </button>
                            <button 
                                onClick={handleBulkSend}
                                disabled={isSendingBulk}
                                className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-black uppercase tracking-widest rounded-xl flex items-center transition-all hover:shadow-2xl hover:shadow-red-600/40 hover:-translate-y-1"
                            >
                                {isSendingBulk ? (
                                    <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> DISPARANDO RÁFAGA...</>
                                ) : 'DISPARAR RÁFAGA AHORA'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && bulkSuccess && (
                     <div className="p-16 flex flex-col items-center justify-center text-center h-[500px] animate-fade-in bg-white">
                        <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Campaña En Curso</h2>
                        <p className="text-slate-500 max-w-lg mb-8">
                            El lote ha sido entregado exitosamente al orquestador del servidor SMTP backend. Los correos se están enviando uno a uno silenciosamente con pausas nativas para evadir filtros.
                        </p>
                        <button 
                            onClick={() => {
                                setStep(1); setRawList(''); setSubject(''); setHtmlContent('<p>¡Hola {{nombre}}!</p><br/>'); setRecipients([]); setBulkSuccess(false);
                            }}
                            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            Comenzar Nueva Campaña
                        </button>
                     </div>
                )}
            </div>
        </main>
    );
}

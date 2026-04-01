import React, { useState, useRef, useMemo } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
    Mail, Users, PenTool, Eye, Send, FileUp, AlertCircle, 
    CheckCircle2, ArrowRight, ArrowLeft, Loader2, Play,
    Database, Download, Upload, PlusCircle, Search, FolderOpen, 
    MoreVertical, Zap, CloudUpload, Filter, Edit2, Trash2, 
    ChevronLeft, ChevronRight, X, Info
} from 'lucide-react';

interface MailingGroup {
    id: string;
    name: string;
    color: string | null;
    _count?: { contacts: number };
}

interface MailingContact {
    id: string;
    email: string;
    name: string | null;
    source: string | null;
    groups: MailingGroup[];
}

export function MassMailing() {
    const [step, setStep] = useState<number>(1);
    const [rawList, setRawList] = useState<string>('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    
    // Persistent CRM State
    const [groups, setGroups] = useState<MailingGroup[]>([]);
    const [recipients, setRecipients] = useState<MailingContact[]>([]);
    const [selectedFilterGroup, setSelectedFilterGroup] = useState<string | null>(null);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const [subject, setSubject] = useState<string>('');
    const [htmlContent, setHtmlContent] = useState<string>('<p>Hola {{nombre}}!</p><br/><p>Escribe tu mensaje aquí...</p>');
    
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [manualName, setManualName] = useState('');
    const [manualEmail, setManualEmail] = useState('');

    const [testEmail, setTestEmail] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState<number | null>(null);

    // Tag Editor Modal State
    const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
    const [taggingContact, setTaggingContact] = useState<MailingContact | null>(null);
    const [selectedTagsForContact, setSelectedTagsForContact] = useState<string[]>([]);

    const EMAIL_TEMPLATES = useMemo(() => [
        {
            title: "Recordatorio Test", desc: "Invitación a completar evaluación emocional.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.25 21v-2.25a3.75 3.75 0 0 1 7.5 0V21"></path><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 2a8 8 0 0 0-8 8c0 1.5 1 3.5 1 5a3 3 0 0 1-3 3h16a3 3 0 0 1-3-3c0-1.5 1-3.5 1-5a8 8 0 0 0-8-8z"></path></svg>,
            colorClass: "bg-amber-50 text-amber-600",
            subject: "🧠 ¿Cómo estás hoy? Completa tu test de bienestar, {{nombre}}",
            content: `<img src="https://placehold.co/600x200/f8fafc/94a3b8?text=Reemplazar+Imagen+Hero" alt="Hero" width="100%" /> 
<h2 style="color: #4f46e5;">Hola {{nombre}},</h2>
<p>Hace unos días te enviamos una invitación para realizar tu test de bienestar emocional y aún no hemos recibido tu respuesta.</p>
<p>Conocer tu estado actual es el primer paso para una vida plena. El test solo toma 5 minutos.</p>
<br/>
<p style="text-align: center;">
  <a href="https://tusitio.com/test" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold;">Realizar Test Ahora</a>
</p>
<br/>
<p style="color: #64748b; font-style: italic;">"Cuidar de tu mente es la mejor inversión que puedes hacer."</p>
<p>Atentamente,<br><strong>Tu equipo de Bienestar</strong></p>`
        },
        {
            title: "Contratar Servicio", desc: "Propuesta de valor y planes premium.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
            colorClass: "bg-emerald-50 text-emerald-600",
            subject: "🚀 {{nombre}}, impulsa tu crecimiento con nuestros planes",
            content: `<h2 style="color: #059669;">Tu evolución no tiene límites</h2>
<p>Hola {{nombre}}, hemos notado tu compromiso con tu crecimiento personal. Por eso, queremos invitarte a dar el siguiente paso.</p>
<br/>
<p><strong>Nuestros Planes Premium:</strong> Accede a sesiones personalizadas y herramientas exclusivas para potenciar tu proceso.</p>
<br/>
<p style="text-align: center;">
  <a href="https://tusitio.com/planes" style="background-color: #166534; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold;">Ver Planes Disponibles</a>
</p>
<br/>
<p>Estamos listos para acompañarte en este viaje. ¿Hablamos?</p>`
        },
        {
            title: "Escuchar Podcast", desc: "Novedades y contenido en audio.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>,
            colorClass: "bg-indigo-50 text-indigo-600",
            subject: "🎧 Nuevo Episodio: Superando la ansiedad con {{nombre}}",
            content: `<img src="https://placehold.co/600x200/1e293b/ffffff?text=Nuevo+Episodio" alt="Podcast Hero" width="100%" /> 
<h2 style="color: #1e293b; text-align: center;">¡Nuevo Podcast Disponible!</h2>
<p style="text-align: center;">En el episodio de hoy hablamos sobre herramientas prácticas para gestionar el estrés diario. ¡Algo que te interesará mucho, {{nombre}}!</p>
<br/>
<p style="text-align: center;">
  <a href="https://spotify.com/podcast" style="background-color: #1DB954; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold;">ESCUCHAR EN SPOTIFY</a>
</p>
<br/>
<p style="text-align: center; color: #94a3b8;">También disponible en Apple Podcasts y YouTube.</p>`
        }
    ], []);

    const handleApplyTemplate = (idx: number) => {
        setSubject(EMAIL_TEMPLATES[idx].subject);
        setHtmlContent(EMAIL_TEMPLATES[idx].content);
        setActiveTemplate(idx);
    };

    React.useEffect(() => {
        fetchData();
    }, [selectedFilterGroup]);

    const fetchData = async () => {
        try {
            const [gRes, cRes] = await Promise.all([
                axios.get('/api/mailing/groups'),
                axios.get('/api/mailing/contacts' + (selectedFilterGroup ? `?groupId=${selectedFilterGroup}` : ''))
            ]);
            setGroups(gRes.data);
            setRecipients(cRes.data);
        } catch (error) {
            console.error('Error fetching mailing data:', error);
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return;
        try {
            await axios.post('/api/mailing/groups', { name: newGroupName });
            setNewGroupName('');
            setIsCreatingGroup(false);
            fetchData();
        } catch (error) {
            alert('Error al crear grupo.');
        }
    };

    const handleDeleteGroup = async (e: React.MouseEvent, groupId: string) => {
        e.stopPropagation();
        if (!confirm('¿Seguro que deseas eliminar esta etiqueta? Los contactos asocicados no se borrarán, solo perderán la etiqueta.')) return;
        try {
            await axios.delete(`/api/mailing/groups/${groupId}`);
            if (selectedFilterGroup === groupId) setSelectedFilterGroup(null);
            fetchData();
        } catch (e) {
            alert('Error eliminando grupo');
        }
    };

    const handleOpenTaggingModal = (contact: MailingContact) => {
        setTaggingContact(contact);
        setSelectedTagsForContact(contact.groups ? contact.groups.map(g => g.id) : []);
        setIsTaggingModalOpen(true);
    };

    const handleSaveTags = async () => {
        if (!taggingContact) return;
        try {
            await axios.put(`/api/mailing/contacts/${taggingContact.id}/groups`, {
                groupIds: selectedTagsForContact
            });
            setIsTaggingModalOpen(false);
            fetchData();
        } catch (e) { 
            alert('Error actualizando etiquetas'); 
        }
    };

    const toggleTagSelection = (groupId: string) => {
        setSelectedTagsForContact(prev => 
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };
    // Bulk logic
    const [isSendingBulk, setIsSendingBulk] = useState(false);
    const [bulkSuccess, setBulkSuccess] = useState(false);

    // Step 1: Processing the DB
    const processDatabase = async () => {
        const lines = rawList.split(/\r?\n/);
        const parsed: {email: string, name: string}[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        lines.forEach(line => {
            if (!line.trim()) return;
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
                    parsed.push({ email: parts[0].trim(), name: parts.slice(1).join(' ').trim() || 'Paciente' });
                }
            }
        });

        const unique = Array.from(new Map(parsed.map(item => [item.email.toLowerCase(), item])).values());

        if (unique.length > 0) {
            try {
                await axios.post('/api/mailing/contacts/import', {
                    contacts: unique,
                    groupId: selectedFilterGroup
                });
                setIsImportModalOpen(false);
                setRawList('');
                fetchData();
            } catch (error) {
                alert('No se pudo guardar la lista en el CRM.');
            }
        } else {
            alert('No se encontraron correos electrónicos válidos en el texto. Revisa el formato.');
        }
    };

    const handleAddManualContact = async () => {
        if (!manualEmail.includes('@') || !manualEmail.includes('.')) {
            alert('Por favor inserta un correo electrónico válido.');
            return;
        }
        try {
            await axios.post('/api/mailing/contacts/import', {
                contacts: [{ email: manualEmail.trim(), name: manualName || 'Paciente' }],
                groupId: selectedFilterGroup
            });
            setIsManualModalOpen(false);
            setManualName('');
            setManualEmail('');
            fetchData();
        } catch (error) {
            alert('Error al guardar el contacto.');
        }
    };

    const downloadDemoCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,Nombre Completo,Correo Electrónico\nJuan Perez,juan.perez@gmail.com\nMaria Sanchez,m.sanchez@empresa.cl\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "plantilla_contactos_erp.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

            <div className="flex-1 max-w-6xl mx-auto w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                {step === 1 && (
                    <div className="p-0 flex flex-col h-full animate-fade-in relative min-h-[600px] overflow-hidden bg-slate-50">
                        {/* Header Principal */}
                        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                                    <Database className="w-5 h-5"/>
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">EmailDB Pro</h2>
                                    <p className="text-xs text-slate-500 font-medium">Gestión de Audiencias Masivas</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={downloadDemoCSV} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 lg:border-none">
                                    <Download className="w-4 h-4"/> <span className="hidden sm:inline">Descargar Demo</span>
                                </button>
                                <button onClick={() => setIsManualModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
                                    <PlusCircle className="w-4 h-4"/> <span className="hidden sm:inline">Añadir Manual</span>
                                </button>

                                {recipients.length > 0 && (
                                    <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 shadow-md transition-all animate-fade-in">
                                        Diseñar Campaña <ArrowRight className="w-4 h-4"/>
                                    </button>
                                )}
                                <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all">
                                    <Upload className="w-4 h-4"/> Importar Lista
                                </button>
                            </div>
                        </header>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar: Grupos y Subgrupos */}
                            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
                                <div className="p-4 border-b border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Mis Grupos</span>
                                        <button onClick={() => setIsCreatingGroup(!isCreatingGroup)} className={`p-1.5 rounded-lg transition-colors ${isCreatingGroup ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                                            <PlusCircle className="w-4 h-4"/>
                                        </button>
                                    </div>
                                    {isCreatingGroup ? (
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" placeholder="Nuevo grupo..." value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="w-full px-3 py-2 bg-slate-100 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
                                            <button onClick={handleCreateGroup} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 text-xs font-bold transition-colors">Crear</button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                                            <input type="text" placeholder="Buscar grupo..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                    )}
                                </div>

                                <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                                    <div className="space-y-1">
                                        <div onClick={() => setSelectedFilterGroup(null)} className={`group-item flex items-center justify-between p-2.5 rounded-xl cursor-pointer font-bold text-sm ${selectedFilterGroup === null ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <Users className="w-4 h-4"/>
                                                <span>Todos los Contactos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-1">
                                        <div className="flex items-center justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            Categorías (Etiquetas)
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            {groups.map(g => (
                                                <div key={g.id} onClick={() => setSelectedFilterGroup(g.id)} className={`group group-item flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-sm transition-all ${selectedFilterGroup === g.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <FolderOpen className={`w-4 h-4 ${g.color?.split(' ')[1] || 'text-indigo-400'}`}/>
                                                        <span>{g.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {g._count?.contacts !== undefined && (
                                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{g._count.contacts}</span>
                                                        )}
                                                        <button onClick={(e) => handleDeleteGroup(e, g.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors hidden group-hover:block">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </nav>
                                <div className="p-4 bg-slate-50 border-t border-slate-200">
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
                                        <CloudUpload className="w-4 h-4 text-indigo-500"/>
                                        Capacidad: 2% usado
                                    </div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full" style={{width: '2%'}}></div>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Content: Tabla y Filtros */}
                            <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
                                <div className="p-6 bg-white border-b border-slate-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Visualización de Contactos</h3>
                                            <p className="text-sm text-slate-500">Asegúrate de que los correos luzcan bien antes de enviar.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                                                <Filter className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-auto p-6 relative">
                                    {recipients.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                            <Database className="w-16 h-16 mb-4 text-slate-200" />
                                            <p className="font-bold">No hay contactos cargados.</p>
                                            <p className="text-sm mt-1 mb-4">Haz clic en Importar Lista o Añade a mano para comenzar.</p>
                                            <button onClick={() => setIsManualModalOpen(true)} className="px-5 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 flex items-center gap-2 transition-colors">
                                                <PlusCircle className="w-4 h-4" /> Registrar Manualmente
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in pb-16">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/80 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-200">
                                                        <th className="px-6 py-4 w-10">#</th>
                                                        <th className="px-6 py-4">Contacto</th>
                                                        <th className="px-6 py-4 text-center">Estado</th>
                                                        <th className="px-6 py-4">Etiquetas</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-sm">
                                                    {recipients.map((rec, i) => (
                                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">{i + 1}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                                                                        {rec.name?.substring(0, 2) || rec.email.substring(0, 2)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-800">{rec.name || 'Sin Nombre'}</div>
                                                                        <div className="text-xs text-slate-500">{rec.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activo
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center justify-between">
                                                                    {rec.groups && rec.groups.length > 0 ? (
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {rec.groups.map((g: MailingGroup) => (
                                                                                <span key={g.id} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-medium">{g.name}</span>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-xs text-slate-400 italic">Sin etiquetas</span>
                                                                    )}
                                                                    <button onClick={() => handleOpenTaggingModal(rec)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-lg transition-colors" title="Editar Etiquetas">
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </main>
                        </div>

                        {/* Modal Gestor de Etiquetas por Contacto */}
                        {isTaggingModalOpen && taggingContact && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsTaggingModalOpen(false)}></div>
                                <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-800">Etiquetas</h3>
                                            <p className="text-xs text-slate-500">{taggingContact.email}</p>
                                        </div>
                                        <button onClick={() => setIsTaggingModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                                    </div>
                                    <div className="p-5 max-h-[60vh] overflow-y-auto">
                                        <div className="space-y-2">
                                            {groups.map(g => (
                                                <div key={g.id} onClick={() => toggleTagSelection(g.id)} className={`flex items-center gap-3 p-3 rounded-xl border ${selectedTagsForContact.includes(g.id) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} cursor-pointer transition-colors`}>
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedTagsForContact.includes(g.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                                        {selectedTagsForContact.includes(g.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="font-bold text-sm">{g.name}</span>
                                                </div>
                                            ))}
                                            {groups.length === 0 && (
                                                <p className="text-sm text-slate-400 text-center py-4">No hay grupos creados</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-5 border-t border-slate-100 bg-slate-50">
                                        <button onClick={handleSaveTags} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal de Importación */}
                        {isImportModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)}></div>
                                <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col">
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="text-xl font-extrabold text-slate-800">Importar Contactos Masivos</h3>
                                        <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                                    </div>
                                    
                                    <div className="p-8 flex flex-col gap-6">
                                        <div className="flex-1 relative">
                                            <textarea 
                                                value={rawList}
                                                onChange={e => setRawList(e.target.value)}
                                                placeholder="Juan Perez, juan@gmail.com&#10;maria@empresa.cl&#10;roberto@yahoo.es"
                                                className="w-full h-full min-h-[250px] p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                                            />
                                            {rawList && (
                                                <div className="absolute bottom-4 right-4 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                                                    {rawList.split(/\n/).filter(x => x.trim() !== '').length} Líneas Detectadas
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                            <h5 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2"><Info className="w-3 h-3"/> Previsualización del Extractor Automático</h5>
                                            <p className="text-xs text-slate-500">Pega todo tu bloque de datos. Nuestro motor aislará el correo de cada línea y detectará el nombre si existe (separado por comas).</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                        <button onClick={() => setIsImportModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
                                        <button onClick={processDatabase} disabled={!rawList.trim()} className="px-6 py-2.5 bg-indigo-600 disabled:bg-slate-400 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                                            Procesar y Montar {rawList ? `(${rawList.split(/\n/).filter(x => x.trim() !== '').length})` : ''} <ArrowRight className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Añadir Manual */}
                        {isManualModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsManualModalOpen(false)}></div>
                                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col">
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <h3 className="text-xl font-extrabold text-slate-800">Añadir Contacto</h3>
                                        <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                                    </div>
                                    <div className="p-6 flex flex-col gap-5">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest pl-1">Nombre (Opcional)</label>
                                            <input type="text" placeholder="Ej: Gerardo Martinez" value={manualName} onChange={e => setManualName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-800" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest pl-1">Correo Electrónico</label>
                                            <input type="email" placeholder="gerardo@empresa.com" value={manualEmail} onChange={e => setManualEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-800" />
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                                        <button onClick={() => setIsManualModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
                                        <button onClick={handleAddManualContact} disabled={!manualEmail} className="px-6 py-2.5 bg-indigo-600 disabled:bg-slate-400 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all">Añadir a la Tabla</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="p-0 flex h-full animate-fade-in relative min-h-[600px]">
                        {/* Sidebar Plantillas */}
                        <aside className="w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
                            <div className="p-6 border-b border-slate-200 bg-white">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1 flex items-center gap-2"><PenTool className="w-4 h-4 text-indigo-500"/> Email Studio</h3>
                                <p className="text-[10px] text-slate-500">Selecciona o comienza de cero.</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {EMAIL_TEMPLATES.map((tpl, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleApplyTemplate(i)}
                                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${activeTemplate === i ? 'border-indigo-500 bg-white shadow-md' : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-xl ${tpl.colorClass}`}>
                                                {tpl.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{tpl.title}</h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{tpl.desc}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* Editor Principal */}
                        <div className="flex-1 flex flex-col min-w-0 bg-white">
                            <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-slate-50/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-black text-slate-800">Redactar Mensaje</h2>
                                    <p className="text-[11px] text-slate-500 italic">💡 Inserta <code className="text-indigo-600 font-bold bg-indigo-50 px-1 rounded">{`{{nombre}}`}</code> para personalizar.</p>
                                </div>
                                <div className="relative group">
                                    <label className="absolute left-4 top-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest transition-all group-focus-within:text-indigo-600">Asunto del Correo</label>
                                    <input 
                                        type="text" 
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="Ej: Te invitamos a conocer tu perfil emocional 🚀"
                                        className="w-full pl-4 pr-4 pt-6 pb-2.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <ReactQuill 
                                    theme="snow" 
                                    value={htmlContent} 
                                    onChange={setHtmlContent}
                                    modules={modules}
                                    className="flex-1 flex flex-col"
                                    style={{ border: 'none', borderRadius: '0' }}
                                />
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                                <button onClick={() => setStep(1)} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors">Volver</button>
                                <button 
                                    onClick={() => setStep(3)}
                                    disabled={!subject || !htmlContent}
                                    className="px-6 py-3 bg-indigo-600 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl flex items-center transition-all shadow-lg hover:shadow-indigo-600/30"
                                >
                                    Continuar a Vista Previa <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
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

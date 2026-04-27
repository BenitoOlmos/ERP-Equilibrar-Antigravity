import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut, X, CheckCircle, User } from 'lucide-react';
import './ClientDashboard.css';

const getRFAIVideo = (profileStr: string): string | null => {
    if (!profileStr) return null;
    const s = profileStr.toLowerCase();
    if (s.includes("desregulado") || s.includes("desbordado")) return "https://www.youtube.com/embed/SU_K-Qt4tf8";
    if (s.includes("reactivo") && s.includes("hiper")) return "https://www.youtube.com/embed/Ke5JnAlBe7Y";
    if (s.includes("reactivo")) return "https://www.youtube.com/embed/Ke5JnAlBe7Y";
    if (s.includes("regulado") && s.includes("hiper")) return "https://www.youtube.com/embed/X7v43d7U4io";
    if (s.includes("regulado")) return "https://www.youtube.com/embed/X7v43d7U4io";
    if (s.includes("inhibido")) return "https://www.youtube.com/embed/liHSg0FOT9g";
    if (s.includes("adaptado") || s.includes("sobre adaptado") || s.includes("sobreadaptado")) return "https://www.youtube.com/embed/8rIIp-15huw";
    return "https://www.youtube.com/embed/Ke5JnAlBe7Y";
};

const defaultAvatars = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=e2e8f0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=bbf7d0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=fecaca',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily&backgroundColor=bfdbfe',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver&backgroundColor=e9d5ff',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia&backgroundColor=fde047'
];

export default function ClientDashboard() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [userTest, setUserTest] = useState<any>(null);
   const [catalog, setCatalog] = useState<any[]>([]);

   // Topbar states
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   
   // Form states
   const [currentAvatar, setCurrentAvatar] = useState(defaultAvatars[0]);
   const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
   const [saving, setSaving] = useState(false);
   
   // Program records
   const [activePrograms, setActivePrograms] = useState<any[]>([]);
   const [currentWeek, setCurrentWeek] = useState(1);

   useEffect(() => {
      // Initialize avatar
      if (user?.id) {
         const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
         if (savedAvatar) setCurrentAvatar(savedAvatar);
      }

      const fetchRealProfile = async () => {
         try {
            if (user?.id) {
               const diagRes = await axios.get(`/api/crm/diagnostics/user/${user.id}`);
               if (diagRes.data && diagRes.data.length > 0) {
                  setUserTest(diagRes.data[0]);
               }

               const profileRes = await axios.get(`/api/data/users/${user.id}`);
               const uName = profileRes.data.profile?.firstName || user.name?.split(' ')[0] || '';
               const uLastName = profileRes.data.profile?.lastName || user.name?.split(' ').slice(1).join(' ') || '';
               setFormData({
                  firstName: uName,
                  lastName: uLastName,
                  email: profileRes.data.email || user.email || '',
                  phone: profileRes.data.phone || '',
                  password: ''
               });
               
               try {
                   const pRes = await axios.get(`/api/data/users/${user.id}/programs`);
                   if (pRes.data && pRes.data.programs?.length > 0) {
                       setActivePrograms(pRes.data.programs);
                       setCurrentWeek(pRes.data.currentWeek === 0 ? pRes.data.computedWeek : pRes.data.currentWeek);
                   }
               } catch (ex) {
                   console.error('Programs fetching failed quietly', ex);
               }
            }
               
            const srvRes = await axios.get('/api/data/services');
            if (srvRes.data) setCatalog(srvRes.data.filter((s:any) => s.isActive));
         } catch (e) {
            console.error('Error fetching dashboard data:', e);
         } finally {
            setLoading(false);
         }
      };
      
      fetchRealProfile();
   }, [user]);

   const handleLogout = () => {
      logout();
      window.location.href = '/login';
   };

   const selectAvatar = (url: string) => {
      setCurrentAvatar(url);
      if (user?.id) localStorage.setItem(`avatar_${user.id}`, url);
   };

   const handleSaveSettings = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
         await axios.put(`/api/data/users/${user?.id}`, {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            password: formData.password
         });
         alert('Tus datos han sido actualizados en la base de datos permanentemente. Reiniciaremos tu sesión para aplicar.');
         window.location.reload();
      } catch (e: any) {
         alert('Error guardando ajustes: ' + (e.response?.data?.error || e.message));
      } finally {
         setSaving(false);
      }
   };

   const wpNumber = "56930179724";

   if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-12 h-12 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>;

   return (
    <div className="portal-wrapper">
      <div className="portal-app">
        
        {/* SIDEBAR DESKTOP */}
        <aside className="portal-sidebar">
          <div className="portal-brand">
            <div className="portal-brand-mark">E</div>
            <div className="portal-brand-copy">
              <strong>ERP Equilibrar</strong>
              <span>Portal privado</span>
            </div>
          </div>

          <nav className="portal-menu">
            <div className="portal-menu-label">Principal</div>
            <a href="#" className="active">⌂ Inicio</a>
            <a href="#tratamientos">▣ Mis tratamientos</a>
            <a href="#equipo">◉ Equipo</a>
            <a href="#descubre">◎ Descarga / Servicios</a>
          </nav>

          <nav className="portal-menu">
            <div className="portal-menu-label">Mi Cuenta</div>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSettingsOpen(true); }}>⚙ Configuración</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>⎋ Cerrar Sesión</a>
          </nav>

          <div className="portal-support-box">
            <h4>Tu espacio activo</h4>
            <p>Entra directo a tus tratamientos o pide asistencia.</p>
            <a href={`https://wa.me/${wpNumber}?text=Hola,%20necesito%20asistencia%20en%20mi%20portal%20como%20paciente.`} target="_blank" rel="noreferrer" className="portal-support-btn">Soporte Chat</a>
          </div>
        </aside>

        <div className="portal-main">
          {/* TOPBAR MOBILE & DESKTOP */}
          <header className="portal-topbar">
            <div className="portal-topbar-inner">
              <div className="portal-topbar-left">
                {/* Mobile Menu Trigger (Optional if sidebar handles it, we keep it visual) */}
                <button className="portal-mobile-menu" aria-label="Abrir menú" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
                <div className="portal-page-title">
                  <strong>Mi Espacio</strong>
                  <span>{activePrograms.length > 0 ? 'Tratamientos Activos' : 'Área de Paciente'}</span>
                </div>
              </div>

              <div className="portal-topbar-right">
                <a href="#tratamientos" className="portal-quick-btn">Tratamientos</a>
                <div className="portal-user-box" onClick={() => setIsSettingsOpen(true)}>
                  <div className="portal-user-meta">
                    <strong>{formData.firstName} {formData.lastName?.charAt(0)}.</strong>
                    <span>Paciente</span>
                  </div>
                  <div className="portal-avatar">
                     <img src={currentAvatar} alt="avatar" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="portal-content">
            
            {/* HERO SECTION */}
            <section className="portal-hero">
              <article className="portal-card portal-hero-main">
                <div className="portal-eyebrow">Comunidad Equilibrar</div>
                
                {!userTest && activePrograms.length === 0 ? (
                    <>
                        <h1>Descubre la <span>causa raíz</span> de tu estrés.</h1>
                        <p>Realiza nuestro Test de Conducta (RFAI) en menos de 3 minutos para evaluar tu sistema nervioso.</p>
                        <div className="portal-hero-actions">
                            <a href="https://clinicaequilibrar.cl/#/test-rfai" target="_blank" rel="noreferrer" className="portal-btn portal-btn-primary">Hacer Test</a>
                        </div>
                    </>
                ) : userTest && activePrograms.length === 0 ? (
                    <>
                        <h1>Tu <span>portal</span> privado.</h1>
                        <p>Tu Test RFAI indica un perfil: <strong>{userTest.profile}</strong>. Adquiere el programa de sanación específico y re-entrena tu cerebro.</p>
                        <div className="portal-hero-actions">
                            <a href={`https://wa.me/${wpNumber}?text=Hola,%20revisé%20mi%20resultado%20RFAI%20(${encodeURIComponent(userTest.profile)})%20y%20quiero%20comprar%20tratamiento.`} target="_blank" rel="noreferrer" className="portal-btn portal-btn-primary">Adquirir Tratamiento</a>
                            <a href="#descubre" className="portal-btn portal-btn-soft">Explorar Catálogo</a>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Tu <span>espacio</span> activo.</h1>
                        <p>Continúa tus programas neuromodulados y avanza a tu ritmo desde donde estés.</p>
                        <div className="portal-hero-actions">
                            <a href="#tratamientos" className="portal-btn portal-btn-primary">Mis Tratamientos</a>
                            <a href="#novedades" className="portal-btn portal-btn-soft">Novedades</a>
                        </div>
                    </>
                )}
              </article>

              <aside className="portal-card portal-hero-editorial">
                {userTest && !activePrograms.length ? (
                   // Si hizo test pero no compro, le mostramos el video de su perfil
                   <div className="h-full flex flex-col justify-between">
                     <div>
                       <div className="small">Tu Perfil RFAI</div>
                       <h2 className="mb-2">Resultado: {userTest.profile}</h2>
                       <p className="mb-4">Visualiza qué está ocurriendo en tu cerebro prefrontal.</p>
                     </div>
                     <div className="portal-editorial-art bg-black">
                        {getRFAIVideo(userTest.profile) && (
                            <iframe 
                                className="w-full h-full absolute inset-0" 
                                src={getRFAIVideo(userTest.profile) as string} 
                                title="RFAI Video" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                            />
                        )}
                     </div>
                   </div>
                ) : (
                   // Editorial genérico original del diseño
                   <div className="h-full flex flex-col justify-between">
                     <div>
                       <div className="small">Esta semana</div>
                       <h2 className="mb-2">Nuevo contenido en Spotify</h2>
                       <p className="mb-4">Escucha las regulaciones express de nuestro equipo clínico.</p>
                     </div>
                     <div className="portal-editorial-art bg-black">
                        <iframe 
                            src="https://open.spotify.com/embed/episode/0k4MQJK6z1YsGpZXyJAA3C?utm_source=generator&theme=0" 
                            className="w-full h-full absolute inset-0 rounded-[20px]" 
                            frameBorder="0" 
                            allowFullScreen 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            title="Spotify Podcast Equilibrar"
                        ></iframe>
                     </div>
                   </div>
                )}
              </aside>
            </section>

            {/* BOTTOM NAV BAR (MOBILE) */}
            <div className="portal-bottom-nav">
              <a className="portal-nav-chip active" href="#tratamientos"><span>▣</span><span>Trat.</span></a>
              <a className="portal-nav-chip" href="#novedades"><span>✦</span><span>Nuevo</span></a>
              <a className="portal-nav-chip" href="#equipo"><span>◉</span><span>Equipo</span></a>
              <a className="portal-nav-chip" href="#descubre"><span>◎</span><span>Más</span></a>
            </div>

            {/* MIS TRATAMIENTOS SECTION */}
            <section className="portal-section" id="tratamientos">
              <div className="portal-section-head">
                <div>
                  <h2>Mis tratamientos</h2>
                  <p>Entrada directa a tus programas adquiridos.</p>
                </div>
                <button onClick={() => window.location.href="mailto:contacto@clinicaequilibrar.cl"} className="portal-link-inline border-none bg-transparent cursor-pointer">Soporte</button>
              </div>

              <div className="portal-services-scroll">
                {activePrograms.length > 0 ? activePrograms.map(prog => (
                    <article className="portal-card portal-service-card" key={prog.id}>
                        <div className="portal-service-top">
                            <span className="portal-service-kicker">Activo</span>
                            <span className="portal-service-status">Semana {currentWeek}</span>
                        </div>
                        <div>
                            <h3>{prog.title}</h3>
                            <p>Continuar módulo clínico de reprogramación.</p>
                        </div>
                        <div className="portal-service-icons">
                            <div className="portal-icon-pill">🎧</div>
                            <div className="portal-icon-pill">✎</div>
                            <div className="portal-icon-pill">✓</div>
                        </div>
                        <div className="portal-service-footer">
                            <div>
                                <strong>Acceso</strong>
                                <span>Inmediato</span>
                            </div>
                            <button onClick={() => navigate(`/mi-cuenta/programa/${prog.id}`)} className="portal-btn portal-btn-primary border-none text-white">Entrar</button>
                        </div>
                    </article>
                )) : (
                    <article className="portal-card portal-service-card">
                        <div className="portal-service-top">
                            <span className="portal-service-kicker">Vacío</span>
                            <span className="portal-service-status">Sin adquirir</span>
                        </div>
                        <div>
                            <h3>Aún sin programas</h3>
                            <p>No tienes tratamientos activos asignados a esta cuenta.</p>
                        </div>
                        <div className="portal-service-icons">
                            <div className="portal-icon-pill">＋</div>
                            <div className="portal-icon-pill">◎</div>
                            <div className="portal-icon-pill">🛒</div>
                        </div>
                        <div className="portal-service-footer">
                            <div>
                                <strong>Catálogo</strong>
                                <span>Sugeridos</span>
                            </div>
                            <a href="#descubre" className="portal-btn portal-btn-soft">Explorar</a>
                        </div>
                    </article>
                )}
              </div>
            </section>

            {/* SPOTIFY & CATALOG TOP TIER */}
            <section className="portal-section" id="novedades">
              <div className="portal-duo-grid">
                <article className="portal-card portal-spotlight">
                  <div className="portal-eyebrow">Novedades Podcast</div>
                  <h3>Arquitectura Evolutiva</h3>
                  <p>Escucha el contenido directamente desde aquí sin salir del portal.</p>
                  
                  <div className="w-full mt-4 h-full max-h-[152px] rounded-[14px] overflow-hidden shadow-sm bg-black relative z-10">
                    <iframe 
                        src="https://open.spotify.com/embed/episode/0k4MQJK6z1YsGpZXyJAA3C?utm_source=generator&theme=0" 
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        title="Spotify Podcast Equilibrar"
                    ></iframe>
                  </div>
                </article>

                <div className="portal-discover-scroll">
                  {catalog.slice(0, 4).map((service, idx) => {
                      const icons = ['✦', '◎', '🛒', '▤', '↗', '✎'];
                      return (
                        <article className="portal-card portal-discover-card" key={service.id}>
                            <div className="portal-icon">{icons[idx % icons.length]}</div>
                            <h3 className="line-clamp-2">{service.name}</h3>
                            <p className="line-clamp-2">{service.description || 'Consulta clínica especialista.'}</p>
                            <a href={`https://wa.me/${wpNumber}?text=Hola,%20me%20interesa%20adquirir:%20${encodeURIComponent(service.name)},%20soy%20${encodeURIComponent(formData.firstName)}.`} target="_blank" rel="noreferrer" className="portal-pro-link mt-auto">Consultar / ${parseInt(service.price).toLocaleString()}</a>
                        </article>
                      );
                  })}
                </div>
              </div>
            </section>

            {/* TEAM SECTION (Hardcoded visually identical to the template) */}
            <section className="portal-section" id="equipo">
              <div className="portal-section-head">
                <div>
                  <h2>Equipo</h2>
                  <p>Terapeutas y estructuración del modelo clínico.</p>
                </div>
                <a href="https://clinicaequilibrar.cl" target="_blank" rel="noreferrer" className="portal-link-inline">Ver Clínica completa</a>
              </div>

              <div className="portal-pros-scroll">
                <article className="portal-card portal-pro-card">
                  <div className="portal-pro-photo portal-photo-1"></div>
                  <div className="portal-pro-body">
                    <div className="portal-pro-role">Psicología Clínica</div>
                    <h3>Claudio Reyes</h3>
                    <p>Director Ejecutivo. Lidera el desarrollo clínico del modelo RFAI.</p>
                  </div>
                </article>

                <article className="portal-card portal-pro-card">
                  <div className="portal-pro-photo portal-photo-2"></div>
                  <div className="portal-pro-body">
                    <div className="portal-pro-role">Neurociencia</div>
                    <h3>Carlos Carrasco</h3>
                    <p>Director de Investigación. Aporta una mirada científica al desarrollo conceptual clínico.</p>
                  </div>
                </article>

                <article className="portal-card portal-pro-card">
                  <div className="portal-pro-photo portal-photo-3"></div>
                  <div className="portal-pro-body">
                    <div className="portal-pro-role">Terapia Somática</div>
                    <h3>Valentín Keller</h3>
                    <p>Director del área somática. Integra la dimensión corporal centrada en regulación.</p>
                  </div>
                </article>
                
                <article className="portal-card portal-pro-card">
                  <div className="portal-pro-photo portal-photo-4"></div>
                  <div className="portal-pro-body">
                    <div className="portal-pro-role">Psiquiatría</div>
                    <h3>Alan Lama</h3>
                    <p>Asesor médico. Apoya la comprensión integral de procesos de salud mental y evaluación.</p>
                  </div>
                </article>
              </div>
            </section>

            {/* COMPLETE CATALOG SECTION */}
            <section className="portal-section" id="descubre">
              <div className="portal-section-head">
                <div>
                  <h2>Explora el catálogo</h2>
                  <p>Adquiere servicios adicionales.</p>
                </div>
              </div>

              <div className="portal-discover-scroll" style={{gridAutoColumns: 'min(45%, 180px)'}}>
                {catalog.map((service, idx) => (
                    <article className="portal-card portal-discover-card" key={service.id}>
                        <div className="portal-icon">▤</div>
                        <h3 className="line-clamp-2">{service.name}</h3>
                        <p className="line-clamp-2 text-[10px] text-slate-400 font-bold uppercase tracking-wide">${parseInt(service.price).toLocaleString()}</p>
                        <a href={`https://wa.me/${wpNumber}?text=Hola,%20busco%20saber%20sobre:%20${encodeURIComponent(service.name)}.`} target="_blank" rel="noreferrer" className="portal-pro-link mt-auto">Consultar</a>
                    </article>
                ))}
                
                {/* Dummies if catalog empty */}
                {!catalog.length && [1,2].map(i => (
                    <article className="portal-card portal-discover-card animate-pulse" key={i}>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-2"></div>
                        <div className="h-4 bg-slate-100 rounded w-full mb-1"></div>
                        <div className="h-4 bg-slate-50 rounded w-2/3"></div>
                    </article>
                ))}
              </div>

              <div className="portal-footer-note">El portal clínico ahora prioriza la navegación en celular, permitiendo acceso eficiente a programas, contenido y servicios desde cualquier dispositivo.</div>
            </section>
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM FAT CTA BAR */}
      <div className="portal-bottom-bar">
        <div className="portal-bottom-shell">
          <div className="portal-bottom-copy">
            <strong>Tratamiento y Evaluaciones</strong>
            <span>{activePrograms.length ? activePrograms[0].title : 'Acceso al Portal'}</span>
          </div>
          <a href="#tratamientos" className="portal-btn portal-btn-primary portal-icon-btn">▣ Entrar</a>
        </div>
      </div>

      {/* PROFILE MODAL (PRESERVED FROM ORIGINAL, MIGRATED) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-800 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#00A89C]" /> Ajustes de Cuenta B2C
                    </h3>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                </div>
                
                <form onSubmit={handleSaveSettings} className="p-8 space-y-8 font-sans">
                    <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recomendaciones Temporales de Avatar</label>
                    <div className="flex items-center space-x-4 overflow-x-auto hide-scrollbar py-2">
                        {defaultAvatars.map((url, i) => (
                            <button type="button" key={i} onClick={() => selectAvatar(url)} className={`relative flex-shrink-0 w-16 h-16 rounded-full border-4 transition-all duration-300 ${currentAvatar === url ? 'border-[#00A89C] scale-110 shadow-lg shadow-[#00A89C]/30' : 'border-slate-100 opacity-60 hover:opacity-100 bg-white'}`}>
                                <img src={url} className="w-full h-full rounded-full object-cover" alt={`Avatar ${i}`}/>
                                {currentAvatar === url && <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-[#00A89C] bg-white rounded-full border border-white" />}
                            </button>
                        ))}
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombres</label>
                        <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow text-slate-700" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Apellidos</label>
                        <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow text-slate-700" />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow text-slate-700" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Teléfono</label>
                        <input type="tel" placeholder="+56..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow placeholder:text-slate-300 text-slate-700" />
                    </div>
                    </div>

                    <div className="pb-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Cambiar Contraseña</label>
                    <input type="password" placeholder="Escribe aquí si deseas cambiarla..." value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A89C]/30 transition-shadow placeholder:text-slate-300 text-slate-700" />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setIsSettingsOpen(false)} className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors">Cancelar</button>
                    <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-[#00A89C] hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-[#00A89C]/20 disabled:opacity-50">
                        {saving ? 'Aplicando...' : 'Modificar Datos'}
                    </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
   );
}

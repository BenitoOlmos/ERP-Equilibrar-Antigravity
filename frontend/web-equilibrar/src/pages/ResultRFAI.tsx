import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Types from original TestRFAI
interface ResultsType {
    AF: number;
    AM: number;
    AE: number;
    R: number;
    ITA: number;
    Re: number;
    IDSE: number;
    interpretacion: string;
    perfil: string;
    afText: string;
    amText: string;
    aeText: string;
    rText: string;
    interrelacion: string;
    resumenDimensional: string;
}

import { profilesData } from '../data/testRFAIProfiles';

const ResultRFAI: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState<ResultsType | null>(null);
    const [mockProfile, setMockProfile] = useState<string | null>(null);

    useEffect(() => {
        const dataParam = searchParams.get('data');
        const profileParam = searchParams.get('perfil');

        if (dataParam) {
            try {
                // Fix for old tokens missing '+' and UTF-8 decoder
                const sanitizedParam = dataParam.replace(/ /g, '+');
                let decodedStr = '';
                try {
                    decodedStr = decodeURIComponent(escape(atob(sanitizedParam)));
                } catch(e) {
                    decodedStr = atob(sanitizedParam);
                }
                const parsedResults = JSON.parse(decodedStr) as ResultsType;
                setResults(parsedResults);
            } catch (error) {
                console.error("Invalid URL parameters format");
            }
        } else if (profileParam && profilesData[profileParam]) {
            // Render a generalized "Mock" version
            setMockProfile(profileParam);
        } else {
            console.warn("No valid results provided");
        }
    }, [searchParams]);


    if (!results && !mockProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6FAFF]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#0F2A4A] mb-4">No se pudo cargar el resultado</h1>
                    <p className="text-[#52607A] mb-8">La URL parece estar incompleta o dañada.</p>
                    <a href="#/test-rfai" className="bg-[#0F2A4A] text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-[#1B4D7A] transition-colors">Volver al Test</a>
                </div>
            </div>
        );
    }

    const matchProfileKey = results 
        ? results.perfil.split(" | ")[0].trim() 
        : (mockProfile || "Indeterminado");
    
    const activeProfile = profilesData[matchProfileKey] || profilesData["Indeterminado"];
    const isReview = matchProfileKey === "Indeterminado";

    const getLevel = (val: number, isReg: boolean) => {
        if (isReg) {
            if (val <= 27) return { text: 'Baja', cls: 'is-low' };
            if (val <= 54) return { text: 'Media', cls: 'is-medium' };
            return { text: 'Alta', cls: 'is-high' };
        }
        if (val <= 9) return { text: 'Bajo', cls: 'is-low' };
        if (val <= 18) return { text: 'Medio', cls: 'is-medium' };
        return { text: 'Alto', cls: 'is-high' };
    };

    const lvlE = getLevel(results?.AE || 10, false);
    const lvlR = getLevel(results?.AM || 10, false);
    const lvlF = getLevel(results?.AF || 10, false);
    const lvlReg = getLevel(results?.Re || 30, true);

    if (isReview) {
        return (
            <div className="bg-[#F6FAFF] min-h-screen text-[#0B1220] font-sans antialiased overflow-x-hidden" style={{ background: 'radial-gradient(1200px 420px at 50% 0%,#EAF4FF 0%, #F6FAFF 60%)', lineHeight: 1.45 }}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root{--bg:#F6FAFF;--card:#FFFFFF;--text:#0B1220;--muted:#52607A;--line:#E5ECF6;--primary:#0F2A4A;--accent:#2D7EF7;--ok:#E9FFF3;--okLine:#BFEFD3;--warn:#FFF6E6;--warnLine:#F2D3A0;--radius:18px;--radius2:22px;--shadow:0 12px 30px rgba(15,42,74,.10);--max:1100px}
                    .container{width:min(var(--max),calc(100% - 40px));margin:auto}
                    .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius2);box-shadow:var(--shadow)}
                    .muted{color:var(--muted)}
                    .topbar{border-bottom:1px solid var(--line);background:rgba(246,250,255,.8);position:sticky;top:0;z-index:50;backdrop-filter:blur(8px)}
                    .nav-review{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
                    .logo{width:40px;height:40px;border-radius:999px;background:conic-gradient(from 180deg,#7CC4FF,#2D7EF7,#6BE6C9,#7CC4FF)}
                    .brand{display:flex;gap:10px;align-items:center;font-weight:700}
                    .btn{padding:12px 16px;border-radius:14px;font-weight:700;font-size:13px;cursor:pointer;border:1px solid transparent;display:inline-flex;align-items:center;gap:8px;text-decoration:none}
                    .btn-primary{background:linear-gradient(180deg,#1B4D7A,#0F2A4A);color:#fff;box-shadow:0 8px 20px rgba(15,42,74,.20)}
                    .btn-ghost{border:1px solid var(--line);background:#fff;color:var(--primary)}
                    .hero-review{padding:40px 0 20px}
                    .grid-review{display:grid;grid-template-columns:1.1fr .9fr;gap:20px;margin-top:20px;align-items:start}
                    @media(max-width:900px){.grid-review{grid-template-columns:1fr}}
                    .kicker{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:bold}
                    .h1-review{font-size:clamp(36px, 5vw, 48px);margin:8px 0 12px;letter-spacing:-1px;line-height:1.1;font-weight:800;color:var(--text)}
                    .lead-review{color:var(--muted);font-size:18px;max-width:54ch}
                    .note{margin-top:24px;padding:18px;border-radius:var(--radius);border:1px solid var(--warnLine);background:linear-gradient(180deg,#fff,var(--warn))}
                    .right{padding:24px}
                    .right h3{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;margin-top:0}
                    .list{display:grid;gap:12px;margin-top:10px}
                    .li{border:1px solid var(--line);border-radius:14px;padding:16px;background:#fff}
                    .section-review{padding:40px 0}
                    .section-title{font-size:28px;margin:0 0 12px;letter-spacing:-.5px;color:var(--primary)}
                    .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}
                    @media(max-width:900px){.steps{grid-template-columns:1fr}}
                    .step{padding:20px;border-radius:16px;border:1px solid var(--line);background:#fff;box-shadow:0 4px 12px rgba(15,42,74,.04)}
                    .badge{width:32px;height:32px;border-radius:10px;background:#EAF2FF;color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:12px}
                    .wa{padding:30px;border-radius:var(--radius2);border:1px solid var(--okLine);background:linear-gradient(180deg,#fff,var(--ok));display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;box-shadow:0 12px 30px rgba(16,185,129,.10)}
                    footer.review-footer{padding:30px 0;font-size:13px;color:var(--muted);text-align:center;border-top:1px solid var(--line)}
                    `
                }} />

                <div className="topbar">
                    <div className="container">
                        <div className="nav-review">
                            <div className="brand" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '#/'}>
                                <div className="logo"></div>
                                <div>Equilibrar</div>
                            </div>
                            <button onClick={(e) => { e.preventDefault(); document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-primary">Contactar</button>
                        </div>
                    </div>
                </div>

                <header className="hero-review" id="top">
                    <div className="container">
                        <p className="kicker">Resultado del Test</p>
                        <h1 className="h1-review">Tu resultado requiere revisión de especialista</h1>
                        <p className="lead-review">
                            En algunos casos, los puntajes no encajan completamente en una sola categoría. Esto no significa que haya algo incorrecto. Significa que tu patrón necesita una lectura más profunda para entregarte un resultado preciso.
                        </p>
                        {results && (
                            <div className="note">
                                <strong style={{ color: 'var(--primary)' }}>Qué ocurrirá ahora:</strong><br />
                                Un especialista revisará tu resultado y te contactaremos dentro de <strong>48 horas</strong> con una lectura más detallada.
                            </div>
                        )}
                    </div>
                </header>

                <section className="section-review">
                    <div className="container grid-review">
                        <div>
                            <h2 className="section-title">Qué significa esto</h2>
                            <p className="muted" style={{ fontSize: '16px', maxWidth: '50ch' }}>
                                A veces los resultados muestran combinaciones entre distintas dimensiones de activación y regulación. En estos casos, el análisis automático no es suficiente y es necesario realizar una revisión clínica breve.
                            </p>
                            
                            {results && (
                                <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--line)'}}>
                                     <strong style={{ display: 'block', marginBottom: '8px' }}>Tu Resumen de Puntuaciones (Para Uso Profesional)</strong>
                                     <pre style={{ margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap' }}>
AF: {results.AF} | AM: {results.AM} | AE: {results.AE}
Regulación Total: {results.Re} 
ITA: {results.ITA} | IDSE: {results.IDSE}

{results.interrelacion}
                                     </pre>
                                </div>
                            )}
                        </div>
                        <aside className="card right">
                            <h3>Qué puedes esperar</h3>
                            <div className="list">
                                <div className="li">
                                    <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>Lectura más precisa</strong>
                                    <div className="muted" style={{ fontSize: '14px' }}>Identificamos si tu patrón corresponde a un perfil mixto.</div>
                                </div>
                                <div className="li">
                                    <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>Explicación clara</strong>
                                    <div className="muted" style={{ fontSize: '14px' }}>Te devolvemos el resultado en un lenguaje comprensible.</div>
                                </div>
                                <div className="li">
                                    <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>Orientación</strong>
                                    <div className="muted" style={{ fontSize: '14px' }}>Si corresponde, te indicamos el mejor siguiente paso.</div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="section-review">
                    <div className="container">
                        <h2 className="section-title">Qué pasará ahora</h2>
                        <div className="steps">
                            <div className="step">
                                <div className="badge">1</div>
                                <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--primary)' }}>Revisión clínica</strong>
                                <p className="muted" style={{ margin: 0, fontSize: '14px' }}>Un especialista revisa tus puntajes y sus interacciones.</p>
                            </div>
                            <div className="step">
                                <div className="badge">2</div>
                                <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--primary)' }}>Definición del perfil</strong>
                                <p className="muted" style={{ margin: 0, fontSize: '14px' }}>Se identifica el patrón dominante o perfil mixto.</p>
                            </div>
                            <div className="step">
                                <div className="badge">3</div>
                                <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--primary)' }}>Contacto en 48 horas</strong>
                                <p className="muted" style={{ margin: 0, fontSize: '14px' }}>Te escribimos con tu resultado preciso.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-review" id="contacto" style={{ marginBottom: '40px' }}>
                    <div className="container">
                        <div className="wa">
                            <div>
                                <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#047857', letterSpacing: '-.5px' }}>¿Prefieres escribirnos ahora?</h2>
                                <p className="muted" style={{ margin: 0, fontSize: '15px', maxWidth: '400px' }}>
                                    Puedes contactarnos por WhatsApp si te resulta más cómodo. Responderemos lo antes posible.
                                </p>
                            </div>
                            <a className="btn btn-primary" style={{ background: '#10b981', boxShadow: '0 8px 24px rgba(16,185,129,.3)' }} href="https://api.whatsapp.com/send/?phone=56930179724&text=Hola,%20hice%20el%20test%20y%20mi%20resultado%20requiere%20revisión%20especialista.%20¿Me%20pueden%20contactar?" target="_blank" rel="noopener noreferrer">
                                Abrir WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                <footer className="review-footer">
                    <div className="container">
                        © {new Date().getFullYear()} Centro Clínico Equilibrar
                    </div>
                </footer>
            </div>
        );
    }


    return (
        <div className="bg-[#F6FAFF] min-h-screen text-[#0B1220] font-sans antialiased overflow-x-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root{
                  --bg: #F6FAFF;
                  --card: #FFFFFF;
                  --text: #0B1220;
                  --muted: #52607A;
                  --line: #E5ECF6;
                  --primary: #0F2A4A;
                  --primary2: #1B4D7A;
                  --accent: #2D7EF7;
                  --soft: #EAF2FF;
                  --ok: #E9FFF3;
                  --okLine:#BFEFD3;
                  --shadow: 0 12px 30px rgba(15,42,74,.10);
                  --radius: 18px;
                  --radius2: 22px;
                  --max: 1120px;
                }
                .custom-container{max-width:var(--max);margin:0 auto;padding:0 20px}
                .topbar{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
                .mark{width:34px;height:34px;border-radius:99px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:16px;letter-spacing:-1px}
                .pill{font-size:13px;font-weight:600;text-decoration:none;padding:10px 16px;border-radius:99px;border:1px solid var(--line);background:#fff;color:var(--text);transition:.2s; cursor:pointer;}
                .pill:hover{background:var(--bg);transform:translateY(-1px)}
                .pill.cta{background:var(--primary);color:#fff;border:0;box-shadow:0 8px 20px rgba(15,42,74,.20)}
                
                .hero{padding:20px 0 40px;position:relative}
                .hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:start}
                
                .result-chip{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:99px;background:var(--card);border:1px solid var(--line);font-size:12px;font-weight:700;letter-spacing:1px;color:var(--muted);box-shadow:var(--shadow)}
                @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(45,126,247,.4)}70%{box-shadow:0 0 0 8px rgba(45,126,247,0)}100%{box-shadow:0 0 0 0 rgba(45,126,247,0)}}
                .badge-dot{width:10px;height:10px;border-radius:99px;background:var(--accent);animation:pulse 2s infinite}
                .h1-custom{margin:20px 0 16px;font-size:clamp(40px, 5vw, 64px);line-height:1;letter-spacing:-2px;font-weight:800;color:var(--text)}
                .lead{margin:0 0 24px;color:var(--muted);font-size:18px;line-height:1.6;max-width:54ch}
                
                .promise-box{padding:18px 22px;border-radius:var(--radius);background:#fff;border:1px solid var(--line);border-left:4px solid var(--accent);box-shadow:var(--shadow);font-size:15px;color:var(--text);line-height:1.5;max-width:54ch}
                
                .btn-custom{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:16px 24px;border-radius:16px;font-size:15px;font-weight:700;text-decoration:none;transition:.2s;cursor:pointer;border:none}
                .btn-primary{background:var(--primary);color:#fff;box-shadow:0 12px 30px rgba(15,42,74,.25)}
                .btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(15,42,74,.30);background:var(--primary2)}
                .btn-outline{background:#fff;border:1px solid var(--line);color:var(--text);box-shadow:0 4px 12px rgba(15,42,74,.05)}
                .btn-outline:hover{background:var(--bg)}
                
                aside{background:#fff;border-radius:var(--radius2);padding:24px;border:1px solid var(--line);box-shadow:var(--shadow)}
                .data-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
                .data-row:last-child{border-bottom:0;padding-bottom:0}
                .data-label{font-size:13px;font-weight:600;color:var(--muted)}
                .data-value{font-size:14px;font-weight:700;padding:4px 12px;border-radius:8px}
                .is-high{background:rgba(239,68,68,.1);color:#B91C1C} /* red */
                .is-medium{background:rgba(245,158,11,.1);color:#B45309} /* orange */
                .is-low{background:rgba(16,185,129,.1);color:#047857} /* green */
                
                .section-custom{padding:60px 0}
                .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
                
                .card-custom{background:#fff;border-radius:var(--radius);padding:32px;border:1px solid var(--line);box-shadow:var(--shadow)}
                .h2-custom{margin:0 0 16px;font-size:28px;letter-spacing:-1px;font-weight:800;color:var(--primary)}
                
                .quote-box{padding:16px;border-radius:12px;background:var(--bg);margin-bottom:12px;font-size:15px;color:var(--text);font-style:italic;border-left:3px solid var(--line)}
                .quote-who{display:block;margin-top:8px;font-size:12px;font-weight:700;color:var(--muted);font-style:normal;text-transform:uppercase;letter-spacing:1px}
                
                .video-wrapper{aspect-ratio:16/9;background:#000;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);position:relative;margin:0 auto 24px;max-width:800px}
                .video-wrapper iframe{width:100%;height:100%;border:0;position:absolute;top:0;left:0}
                
                .step-list{list-style:none;padding:0;margin:0}
                .step-item{display:flex;gap:16px;margin-bottom:24px}
                .step-num{width:32px;height:32px;flex-shrink:0;border-radius:99px;background:var(--soft);color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}
                .step-text{font-size:15px;color:var(--text);line-height:1.5;margin-top:5px}
                
                .price-box{background:#fff;border:2px solid var(--okLine);border-radius:var(--radius2);padding:40px;text-align:center;box-shadow:var(--shadow);max-width:500px;margin:0 auto}
                
                @media(max-width:900px){
                  .hero-grid{grid-template-columns:1fr}
                  .grid-2{grid-template-columns:1fr}
                  .nav{display:none}
                  .section-custom{padding:40px 0}
                }
                `
            }} />

            <nav className="topbar">
                <div className="custom-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.location.href = '#/'}>
                        <div className="mark">E</div>
                        <b style={{ fontSize: '15px', color: 'var(--primary)', letterSpacing: '-.3px' }}>RFAI · Análisis de Resultados</b>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }} className="nav">
                        {results && <button onClick={(e) => { e.preventDefault(); document.getElementById("patron")?.scrollIntoView({ behavior: "smooth" }); }} className="pill">Entender este patrón</button>}
                        <button onClick={(e) => { e.preventDefault(); document.getElementById("Checkout")?.scrollIntoView({ behavior: "smooth" }); }} className="pill cta">Iniciar Recuperación</button>
                    </div>
                </div>
            </nav>

            <section className="hero" id="top">
                <div className="custom-container hero-grid">
                    <div>
                        <div className="result-chip">
                            <span className="badge-dot" style={{ background: isReview ? '#6a7a8c' : 'var(--accent)' }}></span>
                            {results ? "RESULTADO DEL ANÁLISIS ESTADÍSTICO" : "VISTA DE RESULTADO GENÉRICA"}
                        </div>

                        <h1 className="h1-custom">{activeProfile.title}</h1>

                        <p className="lead" dangerouslySetInnerHTML={{ __html: activeProfile.lead }} />

                        <div className="promise-box" dangerouslySetInnerHTML={{ __html: activeProfile.promise }} />

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '32px' }}>
                            <button onClick={(e) => { e.preventDefault(); document.getElementById("video")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-custom btn-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                Ver explicación en video
                            </button>
                            {results && (
                                <button onClick={(e) => { e.preventDefault(); document.getElementById("patron")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-custom btn-outline">Leer reporte completo ↓</button>
                            )}
                        </div>
                    </div>

                    <aside>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '16px' }}>
                            {results ? "RESUMEN DIMENSIONAL" : "ESTA ES UNA LECTURA DE DEMOSTRACIÓN"}
                        </div>

                        <div className="data-row">
                            <span className="data-label">Activación Emocional</span>
                            <span className={`data-value ${lvlE.cls}`}>{lvlE.text}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Activación Racional</span>
                            <span className={`data-value ${lvlR.cls}`}>{lvlR.text}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Activación Fisiológica</span>
                            <span className={`data-value ${lvlF.cls}`}>{lvlF.text}</span>
                        </div>
                        {results && (
                           <>
                           <div className="data-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px dashed var(--line)' }}>
                               <span className="data-label" style={{ color: 'var(--primary)' }}>Capacidad de Regulación</span>
                               <span className={`data-value ${lvlReg.cls}`}>{lvlReg.text}</span>
                           </div>

                           <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'var(--soft)', fontSize: '13px', color: 'var(--primary)', lineHeight: 1.5 }}>
                               <strong style={{ display: 'block', marginBottom: '4px' }}>Diagnóstico de interrelación:</strong>
                               {results.interrelacion}
                           </div>
                           </>
                        )}
                        {!results && (
                           <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'var(--warn)', fontSize: '13px', color: '#B45309', border: '1px solid var(--warnLine)'}}>
                               <strong style={{ display: 'block', marginBottom: '4px' }}>Comparte este enlace:</strong>
                               Copia y pega la URL de arriba para compartir esta información general sobre este patrón.
                           </div>
                        )}
                    </aside>
                </div>
            </section>

            <section className="section-custom" id="patron" style={{ background: '#fff' }}>
                <div className="custom-container grid-2">
                    <div>
                        <h2 className="h2-custom">Cómo se vive este patrón en el día a día</h2>
                        <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                            Las personas con este perfil suelen reportar experiencias muy similares. No estás solo/a en esta forma de respuesta.
                        </p>
                        {activeProfile.quotes.map((quote, idx) => (
                            <div key={idx} className="quote-box">
                                {quote.text}
                                <span className="quote-who">{quote.who}</span>
                            </div>
                        ))}
                    </div>
                    <div className="card-custom" style={{ boxShadow: 'none', background: 'var(--bg)' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '20px', color: 'var(--primary)' }}>Neurobiología del patrón</h3>
                        <p style={{ color: 'var(--text)', fontSize: '16px', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: activeProfile.translation }} />
                    </div>
                </div>
            </section>

            <section className="section-custom" id="video">
                <div className="custom-container" style={{ textAlign: 'center' }}>
                    <h2 className="h2-custom">Entiende la raíz de tu resultado</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px' }}>
                        {activeProfile.videoSub}
                    </p>
                    <div className="video-wrapper">
                        <iframe src={activeProfile.videoUrl} title={`Video explicativo ${activeProfile.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>
            </section>

            <section className="section-custom" style={{ background: '#fff' }}>
                <div className="custom-container grid-2">
                    <div>
                        <h2 className="h2-custom">El Protocolo RFAI de 30 días</h2>
                        <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                            Ruta terapéutica focalizada para reentrenar tu sistema nervioso y recuperar balance.
                        </p>
                        <ul className="step-list">
                            {activeProfile.protocolSteps.map((stepDesc, idx) => (
                                <li key={idx} className="step-item">
                                    <div className="step-num">{idx + 1}</div>
                                    <div className="step-text">{stepDesc}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="card-custom" style={{ background: 'var(--primary)', color: '#fff', border: 0 }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: '24px', letterSpacing: '-.5px' }}>{activeProfile.benefitsTitle}</h3>
                            <p style={{ fontSize: '16px', lineHeight: 1.6, opacity: .9, marginBottom: '24px' }}>
                                {activeProfile.benefitsSub}
                            </p>
                            <hr style={{ border: 0, borderTop: '1px solid rgba(255,255,255,.2)', margin: '24px 0' }} />
                            <p style={{ fontSize: '15px', lineHeight: 1.5, opacity: .8 }}>
                                {activeProfile.closingP1}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-custom" id="Checkout">
                <div className="custom-container">
                    <div className="price-box">
                        <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--ok)', color: '#047857', borderRadius: '99px', fontSize: '13px', fontWeight: 800, letterSpacing: '1px', marginBottom: '24px' }}>
                            PROGRAMA COMPLETO DISPONIBLE
                        </div>
                        <h2 className="h2-custom" style={{ fontSize: '36px', marginBottom: '8px' }}>Tratamiento RFAI</h2>
                        <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '8px' }}>Tu evaluación inicial y programa completo de recuperación.</p>

                        <div style={{ fontSize: '56px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-2px', margin: '24px 0 8px' }}>
                            $290.000<span style={{ fontSize: '18px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0' }}> CLP</span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '32px' }}>Pago único y seguro vía MercadoPago.</p>

                        <a href={activeProfile.paymentUrl} className="btn-custom btn-primary" style={{ width: '100%', fontSize: '18px', padding: '20px' }}>
                            Iniciar Programa Ahora
                        </a>

                        <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
                            ¿Tienes dudas? <a href={`https://api.whatsapp.com/send/?phone=56930179724&text=${encodeURIComponent('Hola, tengo dudas sobre el protocolo RFAI para el perfil: ' + activeProfile.title)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Hablemos por WhatsApp</a>
                        </p>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid var(--line)', color: 'var(--muted)', fontSize: '14px' }}>
                © {new Date().getFullYear()} Centro Clínico Equilibrar • RFAI — Reprogramación Focalizada de Alto Impacto.<br />
                La información arrojada y expuesta en este sitio es informativa y no reemplaza diagnóstico médico oficial.
            </footer>
        </div>
    );
};

export default ResultRFAI;

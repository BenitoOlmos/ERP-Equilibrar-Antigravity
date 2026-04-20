import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import videoBg from '../assets/videos/video-home-equilibrar.mp4';

const Home: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        
        // Intersection Observer for scroll reveal
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('px-reveal-active');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.px-reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        if (isMenuOpen) toggleMenu();
        const element = document.getElementById(targetId);
        if (element) {
            const yOffset = -80; 
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="home-premium-container">
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;600;700;800;900&display=swap');

                .home-premium-container {
                    /* Brand Colors */
                    --brand-900: #0a1c1a;
                    --brand-800: #102e29;
                    --brand-700: #173f38;
                    --brand-accent: #00A89C;
                    --brand-light: #e0f6f4;
                    
                    /* Neutrals */
                    --bg-page: #f9fcfb;
                    --surface-white: #ffffff;
                    --surface-muted: #f1f5f4;
                    
                    /* Text */
                    --text-main: #14211f;
                    --text-muted: #5e706c;
                    
                    /* Structural */
                    --border-thin: rgba(0, 168, 156, 0.15);
                    --container-max: 1240px;
                    
                    /* Radii & Shadows */
                    --radius-2xl: 32px;
                    --radius-xl: 24px;
                    --radius-lg: 16px;
                    --radius-full: 999px;
                    --shadow-sm: 0 4px 14px rgba(0, 168, 156, 0.05);
                    --shadow-md: 0 12px 32px rgba(20, 33, 31, 0.08);
                    --shadow-lg: 0 24px 56px rgba(0, 168, 156, 0.12);
                    --shadow-hover: 0 32px 64px rgba(0, 168, 156, 0.18);

                    font-family: 'Inter', sans-serif;
                    background-color: var(--bg-page);
                    color: var(--text-main);
                    line-height: 1.6;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    overflow-x: hidden;
                    width: 100%;
                }

                .home-premium-container h1, 
                .home-premium-container h2, 
                .home-premium-container h3, 
                .home-premium-container h4 {
                    font-family: 'Outfit', sans-serif;
                    color: var(--brand-900);
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    margin: 0;
                }
                
                .home-premium-container img, 
                .home-premium-container video { 
                    max-width: 100%; height: auto; display: block; 
                }
                
                .home-premium-container a { 
                    text-decoration: none; color: inherit; 
                }

                .px-container {
                    width: min(calc(100% - 40px), var(--container-max));
                    margin: 0 auto;
                }
                
                .px-section { padding: 120px 0; }
                
                /* Buttons */
                .px-btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    height: 52px; padding: 0 36px; border-radius: var(--radius-full);
                    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer; border: 1px solid transparent; white-space: nowrap;
                }
                
                .px-btn-primary {
                    background: var(--brand-900); color: white !important;
                    box-shadow: 0 12px 24px rgba(10, 28, 26, 0.15);
                }
                .px-btn-primary:hover {
                    background: var(--brand-accent);
                    box-shadow: 0 16px 32px rgba(0, 168, 156, 0.3);
                    transform: translateY(-3px);
                }
                
                .px-btn-secondary {
                    background: var(--surface-white); color: var(--text-main);
                    border-color: var(--border-thin);
                }
                .px-btn-secondary:hover {
                    color: var(--brand-accent) !important; border-color: var(--brand-accent);
                    box-shadow: var(--shadow-sm); transform: translateY(-2px);
                }
                
                .px-btn-glass {
                    background: rgba(255, 255, 255, 0.08); color: white !important;
                    backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .px-btn-glass:hover {
                    background: rgba(255, 255, 255, 0.16); transform: translateY(-2px);
                }
                
                .px-eyebrow {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 8px 16px; border-radius: var(--radius-full);
                    background: var(--brand-light); color: var(--brand-accent);
                    font-size: 12px; font-weight: 800; letter-spacing: 0.1em;
                    text-transform: uppercase; margin-bottom: 20px;
                }

                .px-section-head { text-align: center; max-width: 720px; margin: 0 auto 72px; }
                .px-section-head h2 { font-size: clamp(36px, 5vw, 64px); margin-bottom: 20px; text-wrap: balance; }
                .px-section-head p { font-size: 18px; color: var(--text-muted); font-weight: 400; text-wrap: balance; margin: 0;}

                /* Scroll Reveal */
                .px-reveal {
                    opacity: 0; transform: translateY(40px);
                    transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .px-reveal.px-reveal-active { opacity: 1; transform: translateY(0); }
                .px-delay-100 { transition-delay: 100ms; }
                .px-delay-200 { transition-delay: 200ms; }
                .px-delay-300 { transition-delay: 300ms; }

                /* Header */
                .px-header {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    background: rgba(249, 252, 251, 0.6);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid transparent; transition: all 0.4s ease;
                }
                .px-header.px-scrolled {
                    background: rgba(255, 255, 255, 0.95);
                    border-bottom: 1px solid var(--border-thin);
                    box-shadow: 0 4px 32px rgba(0,0,0,0.03);
                }
                .px-nav { height: 88px; display: flex; align-items: center; justify-content: space-between; }
                
                .px-brand { display: flex; align-items: center; gap: 14px; }
                .px-brand img { width: 48px; height: 48px; border-radius: 12px; object-fit: contain; }
                .px-brand-text { display: flex; flex-direction: column; justify-content: center; }
                .px-brand-text strong { font-size: 20px; font-weight: 800; line-height: 1.1; }
                .px-brand-text span { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand-accent); }
                
                .px-nav-links { display: flex; gap: 40px; }
                .px-nav-links a { font-size: 14px; font-weight: 600; color: var(--text-muted); position: relative; transition: color 0.3s; }
                .px-nav-links a:hover { color: var(--brand-accent); }
                .px-nav-links a::after {
                    content: ''; position: absolute; bottom: -6px; left: 0; width: 0; height: 2px;
                    background: var(--brand-accent); transition: width 0.3s ease; border-radius: 2px;
                }
                .px-nav-links a:hover::after { width: 100%; }

                .px-menu-toggle { display: none; background: none; border: none; font-size: 24px; color: var(--brand-900); cursor: pointer; }

                /* Hero */
                .px-hero {
                    position: relative; min-height: 100vh; padding-top: 88px;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden; z-index: 0;
                }
                .px-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; overflow: hidden; }
                .px-hero-video video { width: 100%; height: 100%; object-fit: cover; transform: scale(1.05); animation: kenburns 25s infinite alternate ease-in-out; }
                .px-hero-bg {
                    position: absolute; inset: 0; z-index: 2;
                    background: linear-gradient(145deg, rgba(10,28,26,0.95) 0%, rgba(10,28,26,0.7) 40%, rgba(0,168,156,0.2) 100%);
                }
                .px-hero-inner { position: relative; z-index: 3; text-align: center; color: white; max-width: 860px; padding: 40px 0; margin: 0 auto; }
                .px-hero-inner h1 { color: white; font-size: clamp(48px, 6vw, 92px); font-weight: 800; letter-spacing: -0.04em; margin-bottom: 24px; text-wrap: balance; }
                .px-hero-inner p { font-size: clamp(16px, 2vw, 20px); color: rgba(255,255,255,0.85); margin-bottom: 48px; max-width: 640px; margin-inline: auto; font-weight: 300; }
                .px-hero-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

                @keyframes kenburns { 0% { transform: scale(1.05); } 100% { transform: scale(1.15) translate(-1%, -1%); } }

                /* Split Card Intro */
                .px-intro-wrap { margin-top: -80px; position: relative; z-index: 10; padding: 0 20px; }
                .px-split-card {
                    background: var(--surface-white); border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-lg); border: 1px solid var(--border-thin);
                    display: grid; grid-template-columns: 1.1fr 1fr; overflow: hidden;
                    max-width: var(--container-max); margin: 0 auto;
                }
                .px-split-content { padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; }
                .px-split-content h3 { font-size: clamp(32px, 3.5vw, 48px); margin-bottom: 20px; text-wrap: balance; }
                .px-split-content p { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; }
                .px-split-image { background-size: cover; background-position: center; min-height: 480px; clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%); }

                /* Eval Grid */
                .px-eval-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
                .px-eval-card {
                    background: var(--surface-white); border-radius: var(--radius-xl);
                    padding: 48px 40px; border: 1px solid var(--border-thin);
                    box-shadow: var(--shadow-sm); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex; flex-direction: column; position: relative; overflow: hidden;
                }
                .px-eval-card::before {
                    content: ''; position: absolute; inset: 0; z-index: 0;
                    background: radial-gradient(circle at top right, rgba(0, 168, 156, 0.05) 0%, transparent 70%);
                    opacity: 0; transition: opacity 0.5s;
                }
                .px-eval-card:hover { transform: translateY(-12px); box-shadow: var(--shadow-hover); border-color: rgba(0, 168, 156, 0.3); }
                .px-eval-card:hover::before { opacity: 1; }
                
                .px-eval-icon {
                    width: 72px; height: 72px; border-radius: 20px;
                    background: var(--brand-light); color: var(--brand-accent);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800;
                    margin-bottom: 32px; transition: all 0.5s; position: relative; z-index: 1;
                }
                .px-eval-card:hover .px-eval-icon {
                    background: var(--brand-accent); color: white; transform: rotate(-8deg) scale(1.1);
                    box-shadow: 0 12px 24px rgba(0, 168, 156, 0.3);
                }
                
                .px-eval-card h3 { font-size: 28px; margin-bottom: 16px; position: relative; z-index: 1; }
                .px-eval-card p { color: var(--text-muted); margin-bottom: 32px; flex-grow: 1; font-size: 15px; position: relative; z-index: 1; }
                
                .px-mini-list { padding: 0; margin: 0 0 40px 0; list-style: none; display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1; }
                .px-mini-list li { display: flex; align-items: center; gap: 14px; font-size: 15px; font-weight: 600; color: var(--brand-900); }
                .px-mini-list li::before {
                    content: ''; width: 6px; height: 6px; border-radius: 50%;
                    background: var(--brand-accent); flex-shrink: 0;
                }
                .px-eval-card .px-btn { width: 100%; position: relative; z-index: 1; }
                
                .px-highlight-card { border: 2px solid var(--brand-accent); }
                .px-highlight-card .px-eval-icon { background: var(--brand-900); color: white; }

                /* Team */
                .px-bg-soft { background-color: var(--surface-muted); }
                .px-team-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
                .px-team-card {
                    background: var(--surface-white); border-radius: var(--radius-lg); overflow: hidden;
                    box-shadow: var(--shadow-sm); transition: all 0.5s; border: 1px solid var(--border-thin);
                }
                .px-team-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-md); }
                .px-team-photo { width: 100%; aspect-ratio: 4/5; background-size: cover; background-position: center; transition: transform 0.8s; }
                .px-team-card:hover .px-team-photo { transform: scale(1.08); }
                .px-team-copy { padding: 24px; display: flex; flex-direction: column; flex-grow: 1; }
                .px-team-role { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--brand-accent); margin-bottom: 8px; }
                .px-team-copy h3 { font-size: 20px; margin-bottom: 12px; }
                .px-team-copy p { font-size: 14px; color: var(--text-muted); margin: 0;}

                /* Duo Strip */
                .px-duo-card {
                    border-radius: var(--radius-2xl); overflow: hidden; min-height: 540px;
                    display: flex; align-items: flex-end; position: relative;
                    background-size: cover; background-position: center; box-shadow: var(--shadow-lg);
                }
                .px-duo-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(0deg, rgba(10,28,26,0.95) 0%, rgba(10,28,26,0.4) 50%, transparent 100%);
                }
                .px-duo-copy { position: relative; z-index: 1; padding: 60px; max-width: 600px; color: white; }
                .px-duo-copy h3 { color: white; font-size: clamp(36px, 4vw, 56px); margin-bottom: 20px; }
                .px-duo-copy p { font-size: 18px; color: rgba(255,255,255,0.8); margin: 0; }

                /* Dark Section */
                .px-dark-section { background: var(--brand-900); color: white; position: relative; overflow: hidden; }
                .px-dark-section .px-section-head h2 { color: white; }
                .px-dark-section .px-eyebrow { background: rgba(0, 168, 156, 0.15); }
                
                .px-knowledge-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
                .px-knowledge-card {
                    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: var(--radius-2xl); overflow: hidden; transition: all 0.4s;
                }
                .px-knowledge-card:hover { background: rgba(255, 255, 255, 0.06); transform: translateY(-8px); border-color: rgba(0, 168, 156, 0.3); }
                .px-knowledge-media { width: 100%; aspect-ratio: 16/10; background-size: cover; background-position: center; }
                .px-knowledge-content { padding: 48px; }
                .px-knowledge-content h3 { color: white; font-size: 32px; margin-bottom: 16px; }
                .px-knowledge-content p { font-size: 16px; color: rgba(255, 255, 255, 0.6); margin-bottom: 32px; max-width: 440px; }

                /* Footer */
                .px-footer {
                    background: #050e0d; padding: 80px 0 60px; text-align: center;
                    color: rgba(255,255,255,0.4); font-size: 14px;
                }
                .px-footer-logo { filter: grayscale(1) brightness(2); opacity: 0.3; margin: 0 auto 32px; width: 56px; }

                /* Mobile Menu */
                .px-mobile-menu-overlay {
                    position: fixed; inset: 0; background: rgba(249, 252, 251, 0.98);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    z-index: 90; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 32px;
                    opacity: 0; pointer-events: none; transition: opacity 0.4s ease;
                }
                .px-mobile-menu-overlay.px-active { opacity: 1; pointer-events: auto; }
                .px-mobile-menu-overlay a { font-family: 'Outfit', sans-serif; font-size: 36px; font-weight: 800; color: var(--brand-900); }
                
                @media (max-width: 1024px) {
                    .px-team-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
                    .px-eval-grid { grid-template-columns: 1fr; gap: 24px; }
                    .px-knowledge-grid { grid-template-columns: 1fr; gap: 24px; }
                    .px-split-card { grid-template-columns: 1fr; }
                    .px-split-image { clip-path: none; min-height: 320px; }
                    .px-duo-copy { padding: 40px; }
                }
                @media (max-width: 768px) {
                    .px-nav-links, .px-nav-cta { display: none; }
                    .px-menu-toggle { display: block; z-index: 100; position: relative; }
                    .px-section { padding: 80px 0; }
                    .px-hero-inner h1 { font-size: 44px; }
                    .px-team-grid { grid-template-columns: 1fr; }
                    .px-split-content { padding: 40px 24px; }
                    .px-intro-wrap { padding: 0 16px; margin-top: -40px; }
                }
            `}} />

            {/* HEADER HAS BEEN MOVED OUT TO NAVBAR */}

            <main id="top">
                {/* HERO SECTION */}
                <section className="px-hero">
                    <div className="px-hero-video" style={{ pointerEvents: 'none' }}>
                        <video autoPlay={true} muted={true} loop={true} playsInline={true}>
                            <source src={videoBg} type="video/mp4" />
                        </video>
                    </div>
                    <div className="px-hero-bg"></div>
                    
                    <div className="px-container">
                        <div className="px-hero-inner px-reveal">
                            <h1>Tratamientos y terapias para personas que quieren cambiar su vida</h1>
                            <p>Evaluación inicial para entender cómo estás funcionando hoy y definir la intervención más pertinente.</p>
                            <div className="px-hero-actions">
                                <a className="px-btn px-btn-primary" href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')} style={{ backgroundColor: 'var(--brand-accent)' }}>Agendar evaluación</a>
                                <a className="px-btn px-btn-glass" href="#pensamiento" onClick={(e) => handleLinkClick(e, 'pensamiento')}>Propuesta</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INTRO SPLIT CARD */}
                <div className="px-intro-wrap px-reveal px-delay-100">
                    <article className="px-split-card">
                        <div className="px-split-content">
                            <span className="px-eyebrow">Primer Paso Clínico</span>
                            <h3>Define con claridad qué necesitas hoy</h3>
                            <p>Haz la evaluación para precisar el funcionamiento actual, ordenar el caso clínico y definir la estrategia de intervención más pertinente y eficaz para tu bienestar.</p>
                            <div>
                                <a className="px-btn px-btn-primary" href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')}>Comenzar Evaluación Inicial</a>
                            </div>
                        </div>
                        <div className="px-split-image" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/2.png')" }}></div>
                    </article>
                </div>

                {/* EVALUATION GRID */}
                <section id="evaluacion" className="px-section">
                    <div className="px-container">
                        <div className="px-section-head px-reveal">
                            <span className="px-eyebrow">Evaluación Clínica</span>
                            <h2>Lecturas precisas para resultados efectivos</h2>
                            <p>Nuestra primera evaluación estructural permite ordenar el caso, precisar el malestar y estructurar de inmediato la indicación terapéutica correcta.</p>
                        </div>

                        <div className="px-eval-grid">
                            <article className="px-eval-card px-highlight-card px-reveal">
                                <div className="px-eval-icon">01</div>
                                <h3>Evaluación Ejecutiva</h3>
                                <p>Sesión clínica inicial de alta precisión para ordenar tus síntomas y plantear una hoja de ruta.</p>
                                <ul className="px-mini-list">
                                    <li>Lectura del funcionamiento actual</li>
                                    <li>Hipótesis clínica inicial</li>
                                    <li>Definición de plan estratégico</li>
                                </ul>
                                <Link to="/test-rfai" className="px-btn px-btn-primary">Agendar Sesión Ahora</Link>
                            </article>

                            <article className="px-eval-card px-reveal px-delay-100">
                                <div className="px-eval-icon">02</div>
                                <h3>Foco en Síntomas</h3>
                                <p>Comprensión clínica profunda del malestar actual para abordar la raíz real del problema.</p>
                                <ul className="px-mini-list">
                                    <li>Ansiedad persistente y desregulada</li>
                                    <li>Sobrecarga emocional sostenida</li>
                                    <li>Desregulación o bloqueos diarios</li>
                                </ul>
                                <a className="px-btn px-btn-secondary" href="#">Entender el foco</a>
                            </article>

                            <article className="px-eval-card px-reveal px-delay-200">
                                <div className="px-eval-icon">03</div>
                                <h3>Acción Terapéutica</h3>
                                <p>Implementación de la indicación clínica con acceso directo a tus recursos.</p>
                                <ul className="px-mini-list">
                                    <li>Módulos semanales guiados</li>
                                    <li>Biofeedback y neurociencia</li>
                                    <li>Cuestionarios y seguimiento</li>
                                </ul>
                                <a className="px-btn px-btn-secondary" href="https://login.clinicaequilibrar.cl">Ingresar a Portal PAC</a>
                            </article>
                        </div>
                    </div>
                </section>

                {/* TEAM SQUAD */}
                <section id="equipo" className="px-section px-bg-soft">
                    <div className="px-container">
                        <div className="px-section-head px-reveal">
                            <span className="px-eyebrow">Equipo Clínico Multi-disciplinario</span>
                            <h2>Dirección articulada por Especialidades</h2>
                            <p>El equipo se organiza desde una filosofía clínica común, articulando distintas especialidades para sostener la evaluación y la intervención integral.</p>
                        </div>

                        <div className="px-team-grid">
                            <article className="px-team-card px-reveal flex flex-col">
                                <div className="px-team-photo" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5750.jpg')" }}></div>
                                <div className="px-team-copy">
                                    <div className="px-team-role">Psicología clínica</div>
                                    <h3>Claudio Reyes</h3>
                                    <p className="mb-4">Evaluación clínica, definición de estrategia terapéutica y conducción del sistema clínico del centro.</p>
                                    <Link className="px-btn px-btn-secondary mt-auto" to="/equipo/claudio-reyes" style={{ height: '40px', fontSize: '13px', width: '100%' }}>Saber más</Link>
                                </div>
                            </article>

                            <article className="px-team-card px-reveal px-delay-100 flex flex-col">
                                <div className="px-team-photo" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5728.jpg')" }}></div>
                                <div className="px-team-copy">
                                    <div className="px-team-role">Neurociencia</div>
                                    <h3>Carlos Carrasco</h3>
                                    <p className="mb-4">Aplicación de neurociencia al bienestar, regulación emocional y cambio conductual.</p>
                                    <Link className="px-btn px-btn-secondary mt-auto" to="/equipo/carlos-carrasco" style={{ height: '40px', fontSize: '13px', width: '100%' }}>Saber más</Link>
                                </div>
                            </article>

                            <article className="px-team-card px-reveal px-delay-200 flex flex-col">
                                <div className="px-team-photo" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5664.jpg')" }}></div>
                                <div className="px-team-copy">
                                    <div className="px-team-role">Trabajo corporal</div>
                                    <h3>Valentín Keller</h3>
                                    <p className="mb-4">Intervención corporal, trabajo somático y regulación fisiológica aplicada al proceso terapéutico.</p>
                                    <Link className="px-btn px-btn-secondary mt-auto" to="/equipo/valentin-keller" style={{ height: '40px', fontSize: '13px', width: '100%' }}>Saber más</Link>
                                </div>
                            </article>

                            <article className="px-team-card px-reveal px-delay-300 flex flex-col">
                                <div className="px-team-photo" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/alan-v2.png')", backgroundPosition: "center top" }}></div>
                                <div className="px-team-copy">
                                    <div className="px-team-role">Psiquiatría</div>
                                    <h3>Alan Lama</h3>
                                    <p className="mb-4">Evaluación psiquiátrica y apoyo médico integrados al criterio clínico general del centro.</p>
                                    <Link className="px-btn px-btn-secondary mt-auto" to="/equipo/alan-lama" style={{ height: '40px', fontSize: '13px', width: '100%' }}>Saber más</Link>
                                </div>
                            </article>

                            <article className="px-team-card px-reveal px-delay-100 flex flex-col">
                                <div className="px-team-photo" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/Captura-de-Pantalla-2026-04-19-a-las-08.15.09.png')", backgroundPosition: "center top" }}></div>
                                <div className="px-team-copy">
                                    <div className="px-team-role">Análisis sistémico</div>
                                    <h3>Daniela Baeza</h3>
                                    <p className="mb-4">Lectura de patrones relacionales profundos y reorganización de dinámicas que sostienen el malestar.</p>
                                    <Link className="px-btn px-btn-secondary mt-auto" to="/equipo/daniela-baeza" style={{ height: '40px', fontSize: '13px', width: '100%' }}>Saber más</Link>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* SOMATIC DUO STRIP */}
                <section className="px-section">
                    <div className="px-container">
                        <article className="px-duo-card px-reveal" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/valentin-taichi.png')" }}>
                            <div className="px-duo-overlay"></div>
                            <div className="px-duo-copy">
                                <span className="px-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', marginBottom: '24px' }}>
                                    Enfoque Fisiológico
                                </span>
                                <h3>El cuerpo también es parte estructural del tratamiento</h3>
                                <p>Nuestra regulación fisiológica permite intervenir allí donde el síntoma puro se expresa como tensión crónica, hiperactivación y pérdida de base somática.</p>
                            </div>
                        </article>
                    </div>
                </section>

                {/* KNOWLEDGE & PODCAST (DARK SECTION) */}
                <section id="pensamiento" className="px-section px-dark-section">
                    <div className="px-container">
                        <div className="px-section-head px-reveal">
                            <span className="px-eyebrow">Pensamiento Clínico del Centro</span>
                            <h2>Línea teórica que orienta la práctica</h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)' }}>El podcast y nuestro blog desarrollan ideas, modelos e hipótesis que amplían tu comprensión clínica.</p>
                        </div>

                        <div className="px-knowledge-grid">
                            <article className="px-knowledge-card px-reveal">
                                <div className="px-knowledge-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/9.png')" }}></div>
                                <div className="px-knowledge-content">
                                    <span className="px-eyebrow">Podcast Oficial</span>
                                    <h3>Arquitectura Evolutiva de la Consciencia</h3>
                                    <p>Un espacio inmersivo de elaboración clínica sobre regulación nerviosa, experiencia subjetiva, dinámicas de cambio y funcionamiento integral.</p>
                                    <a className="px-btn px-btn-glass" href="https://open.spotify.com/show/5qVcMLQ7yffuS7VA3jA6Sh" target="_blank" rel="noopener noreferrer">Escuchar en Spotify</a>
                                </div>
                            </article>

                            <article className="px-knowledge-card px-reveal px-delay-100">
                                <div className="px-knowledge-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/10.png')" }}></div>
                                <div className="px-knowledge-content">
                                    <span className="px-eyebrow">Blog y Artículos</span>
                                    <h3>Una clínica que piensa constantemente su práctica</h3>
                                    <p>Explora contenidos escritos de alto impacto para abordar el malestar, el dolor emocional y estructurar formas de recuperar tu equilibrio.</p>
                                    <Link className="px-btn px-btn-glass" to="#">Visitar el Blog de Estudio</Link>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="px-footer">
                <div className="px-container">
                    <img src="https://www.origamis.cl/wp-content/uploads/2026/03/logo-clinica-equilibrar.png" alt="Clínica Equilibrar" className="px-footer-logo" />
                    <p>Clínica Equilibrar © 2026<br />Evaluación clínica inicial · Intervenciones precisas de alto impacto · Regulación transdisciplinaria</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
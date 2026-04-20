import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLinkClick = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        setIsMenuOpen(false);
        
        if (location.pathname !== '/') {
            navigate(`/#${targetId}`);
        } else {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .px-header {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    background: rgba(249, 252, 251, 0.6);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid transparent; transition: all 0.4s ease;
                }
                .px-header.px-scrolled {
                    background: rgba(255, 255, 255, 0.95);
                    border-bottom: 1px solid var(--border-thin, rgba(23,50,45,0.1));
                    box-shadow: 0 4px 32px rgba(0,0,0,0.03);
                }
                .px-nav { height: 88px; display: flex; align-items: center; justify-content: space-between; max-width: 1240px; margin: 0 auto; padding: 0 20px;}
                
                .px-brand { display: flex; align-items: center; gap: 14px; text-decoration: none; }
                .px-brand img { width: 48px; height: 48px; border-radius: 12px; object-fit: contain; }
                .px-brand-text { display: flex; flex-direction: column; justify-content: center; }
                .px-brand-text strong { font-size: 20px; font-weight: 800; line-height: 1.1; color: var(--text-main, #14211f); font-family: 'Outfit', sans-serif;}
                .px-brand-text span { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand-accent, #00A89C); font-family: 'Outfit', sans-serif;}
                
                .px-nav-links { display: flex; gap: 40px; }
                .px-nav-links a { font-size: 14px; font-weight: 600; color: var(--text-muted, #5f736d); position: relative; transition: color 0.3s; text-decoration: none; font-family: 'Montserrat', sans-serif;}
                .px-nav-links a:hover { color: var(--brand-accent, #00A89C); }
                .px-nav-links a::after {
                    content: ''; position: absolute; bottom: -6px; left: 0; width: 0; height: 2px;
                    background: var(--brand-accent, #00A89C); transition: width 0.3s ease; border-radius: 2px;
                }
                .px-nav-links a:hover::after { width: 100%; }

                .px-menu-toggle { display: none; background: none; border: none; font-size: 24px; color: var(--brand-900, #0a1c1a); cursor: pointer; }
                
                .px-nav-cta .px-btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    height: 52px; padding: 0 36px; border-radius: 9999px;
                    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer; border: 1px solid transparent; white-space: nowrap;
                    text-decoration: none;
                }
                .px-nav-cta .px-btn-primary {
                    background: var(--brand-900, #0a1c1a); color: white !important;
                    box-shadow: 0 12px 24px rgba(10, 28, 26, 0.15);
                }
                .px-nav-cta .px-btn-primary:hover {
                    background: var(--brand-accent, #00A89C);
                    box-shadow: 0 16px 32px rgba(0, 168, 156, 0.3);
                    transform: translateY(-3px);
                }

                .px-mobile-menu-overlay {
                    position: fixed; inset: 0; background: rgba(249, 252, 251, 0.98);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    z-index: 90; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 32px;
                    opacity: 0; pointer-events: none; transition: opacity 0.4s ease;
                }
                .px-mobile-menu-overlay.px-active { opacity: 1; pointer-events: auto; }
                .px-mobile-menu-overlay a { font-family: 'Outfit', sans-serif; font-size: 36px; font-weight: 800; color: var(--brand-900, #0a1c1a); text-decoration: none;}
                
                @media (max-width: 768px) {
                    .px-nav-links, .px-nav-cta { display: none; }
                    .px-menu-toggle { display: block; z-index: 100; position: relative; }
                }
            `}} />

            {/* HEADER */}
            <header id="header" className={`px-header ${scrolled ? 'px-scrolled' : ''}`}>
                <div className="px-nav">
                    <Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="px-brand">
                        <img src="https://www.origamis.cl/wp-content/uploads/2026/03/logo-clinica-equilibrar.png" alt="Logo Clínica Equilibrar" />
                        <div className="px-brand-text">
                            <strong>Clínica Equilibrar</strong>
                            <span>Salud mental transdisciplinaria</span>
                        </div>
                    </Link>

                    <nav className="px-nav-links">
                        <a href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')}>Evaluación</a>
                        <a href="#equipo" onClick={(e) => handleLinkClick(e, 'equipo')}>Equipo</a>
                        <a href="#pensamiento" onClick={(e) => handleLinkClick(e, 'pensamiento')}>Propuesta</a>
                        <Link to="/blog">Blog</Link>
                    </nav>

                    <div className="px-nav-cta">
                        <a href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')} className="px-btn px-btn-primary">Agendar evaluación</a>
                    </div>

                    <button className="px-menu-toggle" onClick={toggleMenu} aria-label="Menu">
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </header>

            {/* MOBILE MENU */}
            <div className={`px-mobile-menu-overlay ${isMenuOpen ? 'px-active' : ''}`}>
                <a href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')}>Evaluación</a>
                <a href="#equipo" onClick={(e) => handleLinkClick(e, 'equipo')}>Equipo Clínico</a>
                <a href="#pensamiento" onClick={(e) => handleLinkClick(e, 'pensamiento')}>Propuesta</a>
                <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <a href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')} className="px-btn px-btn-primary mt-4" style={{ fontSize: '18px', padding: '0 40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '52px', borderRadius: '9999px', background: '#0a1c1a', color: 'white' }}>Agendar ahora</a>
            </div>
        </>
    );
};

export default Navbar;

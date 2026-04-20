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
                header {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    background: rgba(249, 252, 251, 0.6);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid transparent; transition: all 0.4s ease;
                }
                header.scrolled {
                    background: rgba(255, 255, 255, 0.95);
                    border-bottom: 1px solid rgba(23,50,45,0.1);
                    box-shadow: 0 4px 32px rgba(0,0,0,0.03);
                }
                .container.nav { height: 88px; display: flex; align-items: center; justify-content: space-between; max-width: 1240px; margin: 0 auto; padding: 0 20px;}
                
                .brand { display: flex; align-items: center; gap: 14px; text-decoration: none; }
                .brand img { width: 44px; height: 44px; border-radius: 12px; object-fit: contain; }
                .brand span { display: flex; flex-direction: column; gap: 2px; }
                .brand strong { font-size: 20px; font-weight: 800; line-height: 1.1; color: #14211f; font-family: 'Outfit', sans-serif;}
                .brand span > span { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #00A89C; font-family: 'Outfit', sans-serif;}
                
                .nav-links { display: flex; gap: 40px; }
                .nav-links a { font-size: 14px; font-weight: 600; color: #5f736d; position: relative; transition: color 0.3s; text-decoration: none; font-family: 'Montserrat', sans-serif;}
                .nav-links a:hover { color: #00A89C; }
                .nav-links a::after {
                    content: ''; position: absolute; bottom: -6px; left: 0; width: 0; height: 2px;
                    background: #00A89C; transition: width 0.3s ease; border-radius: 2px;
                }
                .nav-links a:hover::after { width: 100%; }

                .menu-toggle { display: none; background: none; border: none; font-size: 24px; color: #0a1c1a; cursor: pointer; }
                
                .nav-cta .btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    height: 52px; padding: 0 36px; border-radius: 9999px;
                    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer; border: 1px solid transparent; white-space: nowrap;
                    text-decoration: none;
                }
                .nav-cta .btn-primary {
                    background: #0a1c1a; color: white !important;
                    box-shadow: 0 12px 24px rgba(10, 28, 26, 0.15);
                }
                .nav-cta .btn-primary:hover {
                    background: #00A89C;
                    box-shadow: 0 16px 32px rgba(0, 168, 156, 0.3);
                    transform: translateY(-3px);
                }

                .mobile-menu {
                    position: fixed; inset: 0; background: rgba(249, 252, 251, 0.98);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    z-index: 90; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 32px;
                    opacity: 0; pointer-events: none; transition: opacity 0.4s ease;
                }
                .mobile-menu.active { opacity: 1; pointer-events: auto; }
                .mobile-menu a { font-family: 'Outfit', sans-serif; font-size: 36px; font-weight: 800; color: #0a1c1a; text-decoration: none;}
                
                @media (max-width: 768px) {
                    .nav-links, .nav-cta .desktop-only { display: none; }
                    .menu-toggle { display: block; z-index: 100; position: relative; }
                }
            `}} />

            {/* HEADER */}
            <header className={scrolled ? 'scrolled' : ''}>
                <div className="container nav">
                    <Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="brand" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                        <img src="https://www.origamis.cl/wp-content/uploads/2026/03/logo-clinica-equilibrar.png" alt="Logo Clínica Equilibrar" style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '12px' }} />
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <strong>Clínica Equilibrar</strong>
                            <span>Salud mental transdisciplinaria</span>
                        </span>
                    </Link>

                    <nav className="nav-links">
                        <a href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')}>Evaluación</a>
                        <a href="#equipo" onClick={(e) => handleLinkClick(e, 'equipo')}>Equipo</a>
                        <a href="#pensamiento" onClick={(e) => handleLinkClick(e, 'pensamiento')}>Propuesta</a>
                        <Link to="/blog">Blog</Link>
                    </nav>

                    <div className="nav-cta">
                        <button className="menu-toggle" aria-label="Abrir menú" onClick={toggleMenu}>
                            {isMenuOpen ? '✕' : '☰'}
                        </button>
                        <a className="btn btn-primary desktop-only" href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')}>Agendar evaluación ejecutiva</a>
                    </div>

                    <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                        <a href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')}>Evaluación</a>
                        <a href="#equipo" onClick={(e) => handleLinkClick(e, 'equipo')}>Equipo clínico</a>
                        <a href="#pensamiento" onClick={(e) => handleLinkClick(e, 'pensamiento')}>Propuesta</a>
                        <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                        <a href="#evaluacion" onClick={(e) => handleLinkClick(e, 'evaluacion')} className="btn btn-primary mt-4" style={{ fontSize: '18px', padding: '0 40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '52px', borderRadius: '9999px', background: '#0a1c1a', color: 'white' }}>Agendar ahora</a>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;

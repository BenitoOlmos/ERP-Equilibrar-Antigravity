import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, HeartPulse, Building2, User } from 'lucide-react';
import logo from '../assets/images/logo.png';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 800); // Wait for fade out animation
    }, 2500); // Show splash for 2.5s
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] bg-brand-surface flex items-center justify-center transition-opacity duration-1000 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center">
        <div className="relative w-56 h-56 md:w-72 md:h-72 mb-8 animate-pulse-slow">
          <img src={logo} alt="Equilibrar Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-sm font-bold tracking-[0.4em] uppercase text-brand-heading animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Equilibrar
        </span>
        <span className="text-[10px] text-brand-gold tracking-[0.2em] uppercase mt-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Clinical Luxury
        </span>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cmsUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:3005';

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, path: string, hash?: string) => {
    setIsOpen(false);

    // If it's a hash link to the home page (e.g., #about)
    if (path === '/' && hash) {
      e.preventDefault();

      const scrollToElement = () => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(scrollToElement, 100);
      } else {
        // Already on home, just scroll
        scrollToElement();
      }
    }
  };

  const navLinks = [
    { name: 'Nosotros', path: '/', hash: '#about' },
    { name: 'Psiquiatría', path: '/psiquiatria' },
    { name: 'Psicología', path: '/psicologia' },
  ];

  return (
    <>
      {/* Navbar Container: Glass effect on Mobile by default or when scrolled */}
      <nav className={`fixed w-full z-[60] transition-all duration-700 ease-in-out ${scrolled || isOpen ? 'bg-white/95 backdrop-blur-xl shadow-luxury py-3 md:py-4' : 'bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none py-4 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center relative h-16 md:h-20">

            {/* Desktop Navigation Left (General & Services) */}
            <div className="hidden md:flex flex-1 justify-start space-x-6">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleLinkClick(e, link.path, link.hash)}
                  className="text-sm tracking-wide text-brand-text hover:text-brand-primary transition-colors font-medium hover:translate-y-1 transform duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Centered Logo */}
            <div className="flex-shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-50">
              <Link to="/" className="flex flex-col items-center group" onClick={() => setIsOpen(false)}>
                <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center mb-1 transition-transform duration-500 group-hover:scale-105">
                  <img src={logo} alt="Equilibrar" className="w-full h-full object-contain drop-shadow-sm" />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Right (Actions) */}
            <div className="hidden md:flex flex-1 justify-end space-x-4 items-center">
              <a
                href={cmsUrl}
                target="_blank"
                rel="noreferrer"
                title="Acceso CMS"
                className="text-brand-primary bg-brand-primary/10 hover:bg-brand-primary hover:text-white p-2.5 transition-all duration-300 rounded-full flex items-center justify-center shadow-sm transform hover:-translate-y-0.5"
              >
                <User size={20} strokeWidth={2.5} />
              </a>
              <Link
                to="/test-rfai"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold tracking-widest uppercase text-white bg-brand-heading hover:bg-brand-primary px-5 py-2.5 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-md flex items-center"
              >
                Test Reprogramación
              </Link>
              <a
                href="https://api.whatsapp.com/send/?phone=56930179724&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold tracking-widest uppercase text-brand-heading border border-brand-sand bg-white hover:bg-brand-sand/30 hover:border-brand-primary px-5 py-2.5 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-sm flex items-center"
              >
                Contacto
              </a>
            </div>

            {/* Mobile Menu Button - Enhanced for Visibility */}
            <div className="md:hidden absolute right-0 z-[70] top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <a
                href={cmsUrl}
                target="_blank"
                rel="noreferrer"
                title="Acceso CMS"
                className={`p-2.5 rounded-full transition-all duration-300 shadow-sm ${scrolled || isOpen ? 'bg-brand-primary/10 text-brand-primary' : 'bg-white/50 text-brand-heading'}`}
              >
                <User size={20} strokeWidth={2.5} />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 rounded-full transition-all duration-300 active:scale-95 shadow-sm ${isOpen ? 'bg-brand-primary text-white rotate-90' : 'bg-white text-brand-heading border border-gray-100'}`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay - High Contrast */}
        <div className={`fixed inset-0 bg-white z-[55] transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} md:hidden flex flex-col pt-32 pb-10 px-6 overflow-y-auto`}>
          <div className="flex flex-col space-y-6 items-center text-center w-full max-w-sm mx-auto">

            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Menú Principal</p>

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-xl font-serif text-slate-900 border-b border-gray-50 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-all duration-300 text-left px-4"
            >
              Inicio
            </Link>

            <Link
              to="/"
              onClick={(e) => handleLinkClick(e, '/', '#about')}
              className="w-full py-4 text-xl font-serif text-slate-900 border-b border-gray-50 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-all duration-300 text-left px-4"
            >
              Nosotros
            </Link>

            {/* SEPARATOR & SERVICES */}
            <div className="w-full pt-4 pb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 text-left">Servicios Clínicos</p>
            </div>

            {navLinks.slice(1, 3).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path, link.hash)}
                className="w-full py-3 text-lg font-medium text-slate-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-all duration-300 text-left px-4 pl-6 border-l-2 border-transparent hover:border-brand-primary"
              >
                {link.name}
              </Link>
            ))}

            {/* SEPARATOR & PROGRAMS */}
            <div className="w-full pt-4 pb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 text-left">Evaluación Activa</p>
            </div>

            <Link
              to="/test-rfai"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-lg font-medium text-slate-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-all duration-300 text-left px-4 pl-6 border-l-2 border-transparent hover:border-brand-primary"
            >
              Test Reprogramación
            </Link>

            <a
              href={cmsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-lg font-medium text-slate-700 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-all duration-300 text-left px-4 pl-6 border-l-2 border-transparent hover:border-brand-primary flex items-center gap-3"
            >
              <User size={20} /> Acceso CMS
            </a>

            <div className="pt-8 w-full space-y-4 mt-auto">
              <p className="text-xs text-brand-gold uppercase tracking-widest font-bold">Atención Preferencial</p>
              <button
                onClick={() => window.open('https://wa.me/56930179724', '_blank')}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold tracking-wide shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <MessageCircle size={20} /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-sand/30 text-brand-text pt-20 md:pt-32 pb-12 border-t border-brand-primary/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-5 text-center md:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto md:mx-0 mb-6 flex items-center justify-center">
              <img src={logo} alt="Equilibrar" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm leading-7 text-gray-500 max-w-sm mx-auto md:mx-0 font-light text-justify md:text-left">
              Somos un ecosistema clínico diseñado para la restauración humana. Integramos psiquiatría de precisión, psicología vincular y neurociencia afectiva para guiar procesos de transformación profunda y sostenible.
            </p>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 text-center md:text-left">
            <h4 className="font-serif text-lg mb-6 text-brand-heading">Contacto</h4>
            <ul className="space-y-4 text-sm text-brand-text font-medium">
              <li>
                <a href="https://wa.me/56930179724" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  WhatsApp: +56 9 3017 9724
                </a>
              </li>
              <li>
                <span className="opacity-80">contacto@centroequilibrar.cl</span>
              </li>
              <li>
                <span className="opacity-80">Atención 100% Online</span>
              </li>
            </ul>
          </div>

          {/* Reembolso & Aviso */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="font-serif text-lg mb-6 text-brand-heading">Cobertura & Activación</h4>

            <div className="mb-6">
              <div className="flex gap-4 opacity-80 hover:opacity-100 transition-opacity justify-center md:justify-end">
                <div className="flex items-center gap-1 border border-brand-primary/10 px-3 py-1.5 rounded-sm bg-white shadow-sm">
                  <Building2 size={14} className="text-brand-primary" /> <span className="text-[10px] font-bold">ISAPRES</span>
                </div>
                <div className="flex items-center gap-1 border border-brand-primary/10 px-3 py-1.5 rounded-sm bg-white shadow-sm">
                  <HeartPulse size={14} className="text-brand-primary" /> <span className="text-[10px] font-bold">SEGUROS</span>
                </div>
              </div>
              <p className="text-[10px] text-brand-gold mt-2 font-medium uppercase tracking-wide">
                Boletas Reembolsables
              </p>
            </div>

            <div className="bg-white/50 p-4 rounded-sm border border-brand-primary/5 max-w-xs backdrop-blur-sm">
              <p className="text-xs leading-5 text-slate-500 font-light">
                <strong className="block text-brand-heading mb-1">Activación Inmediata</strong>
                Tras tu compra, activa tus credenciales enviando tu comprobante a nuestro WhatsApp de soporte clínico.
              </p>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-primary/10 text-[10px] text-gray-400 uppercase tracking-widest gap-4">
          <p>© 2026 Centro Clínico Equilibrar®</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Términos</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingWhatsApp: React.FC = () => {
  return (
    <button
      onClick={() => window.open('https://wa.me/56930179724', '_blank')}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-luxury hover:scale-110 transition-transform duration-300 group active:scale-90 animate-fade-in-down"
      style={{ animationDelay: '1.5s' }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={2} className="group-hover:rotate-12 transition-transform" />
    </button>
  )
}

const Layout: React.FC<LayoutProps & { showFooter?: boolean }> = ({ children, showFooter = true }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <FloatingWhatsApp />
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
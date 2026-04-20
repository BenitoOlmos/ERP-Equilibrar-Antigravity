import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, HeartPulse, Building2, User } from 'lucide-react';
import logo from '../assets/images/logo.png';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
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

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
      </div>
    </div>
  );
};

export default Layout;
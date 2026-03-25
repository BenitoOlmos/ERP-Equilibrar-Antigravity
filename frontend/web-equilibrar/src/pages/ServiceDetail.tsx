import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Service } from '../types';

import logo from '../assets/images/logo.png';
import serviceDetailPsychiatry from '../assets/images/service-detail-psychiatry.jpg';
import serviceDetailPsychology from '../assets/images/service-detail-psychology.jpg';

interface ServiceDetailProps {
  slug?: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  // Priority: propSlug (from App.tsx) > paramSlug (from URL)
  const slug = propSlug || paramSlug;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to map backend image filenames to local imports
  const resolveImage = (slug?: string) => {
    if (slug === 'psiquiatria') return serviceDetailPsychiatry;
    if (slug === 'psicologia') return serviceDetailPsychology;
    return serviceDetailPsychology; // Fallback
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await api.getServiceBySlug(slug);
        setService(data);
      } catch (error) {
        console.error("Error hydrating service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleBooking = (message: string) => {
    window.open(`https://wa.me/56930179724?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white text-[#0097b2]">
        <div className="animate-pulse flex flex-col items-center">
          <img src={logo} alt="Loading" className="w-20 h-20 object-contain mb-4 animate-spin-slow" />
          <div className="tracking-widest uppercase font-bold text-sm">Cargando Servicio...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white text-gray-500">
        <p className="mb-4">Servicio no encontrado.</p>
        <Link to="/" className="text-[#0097b2] underline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-white min-h-screen">

      {/* Editorial Header */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-32 bg-brand-sand/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="block text-brand-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 animate-fade-in-down">Especialidad Clínica</span>
          <h1 className="text-3xl md:text-6xl font-serif text-brand-heading mb-4 md:mb-6 leading-tight animate-fade-in-down" style={{ animationDelay: '0.1s' }}>{service.title}</h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light italic font-serif px-2 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
            {service.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 -mt-8 md:-mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 bg-white shadow-luxury p-6 md:p-12 rounded-sm border-t border-brand-primary/5 md:border-none animate-fade-in-down" style={{ animationDelay: '0.4s' }}>

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="aspect-video lg:aspect-[3/4] overflow-hidden rounded-sm relative shadow-md">
              <img src={resolveImage(slug)} alt={service.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-brand-heading/5"></div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-serif text-brand-heading mb-6 md:mb-8">Enfoque Terapéutico</h2>
            <div className="prose prose-base md:prose-lg text-slate-600 mb-8 md:mb-10 font-light leading-relaxed">
              <p>{service.description}</p>
            </div>

            <div className="mb-10 md:mb-12">
              <h3 className="text-xs font-bold tracking-widest uppercase text-brand-heading mb-4 md:mb-6">Áreas de Intervención</h3>
              <ul className="grid grid-cols-1 gap-3 md:gap-4">
                {service.interventionPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border border-gray-100 rounded-sm hover:border-brand-primary/30 transition-colors bg-brand-sand/30">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-brand-light flex items-center justify-center shrink-0 text-brand-primary mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-slate-600 font-medium text-sm md:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 border-t border-brand-primary/10 pt-6 md:pt-8">
              <button
                onClick={() => handleBooking(service.ctaMessage)}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-brand-primary hover:bg-brand-dark text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-cyan-200 text-sm md:text-base transform active:scale-95"
              >
                <MessageCircle size={20} />
                {service.ctaText}
              </button>
              <span className="text-[10px] md:text-xs text-slate-400 italic text-center sm:text-left">
                * Coordinación directa con secretaría vía WhatsApp.
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Spacer */}
      <div className="h-20 md:h-32"></div>

    </div>
  );
};

export default ServiceDetail;
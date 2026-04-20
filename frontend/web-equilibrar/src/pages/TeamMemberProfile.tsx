import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const teamData: Record<string, { name: string, role: string, image: string }> = {
    'claudio-reyes': {
        name: 'Claudio Reyes',
        role: 'Psicología clínica',
        image: 'https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5750.jpg'
    },
    'carlos-carrasco': {
        name: 'Carlos Carrasco',
        role: 'Neurociencia',
        image: 'https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5728.jpg'
    },
    'valentin-keller': {
        name: 'Valentín Keller',
        role: 'Trabajo corporal',
        image: 'https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5664.jpg'
    },
    'alan-lama': {
        name: 'Alan Lama',
        role: 'Psiquiatría',
        image: 'https://www.origamis.cl/wp-content/uploads/2026/04/alan-v2.png'
    },
    'daniela-baeza': {
        name: 'Daniela Baeza',
        role: 'Análisis sistémico',
        image: 'https://www.origamis.cl/wp-content/uploads/2026/04/Captura-de-Pantalla-2026-04-19-a-las-08.15.09.png'
    }
};

const TeamMemberProfile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const member = slug && teamData[slug] ? teamData[slug] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!member) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f9fcfb] text-gray-700 font-inter">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Especialista no encontrado</h2>
                    <Link to="/" className="text-[#00A89C] underline hover:text-[#0a1c1a]">Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in bg-[#f9fcfb] min-h-screen font-inter text-[#14211f]">
            
            {/* Header Placeholder Estético */}
            <div className="w-full bg-[#102e29] pt-32 pb-24 px-6 text-center text-white relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#e0f6f4]/10 text-[#00A89C] text-xs font-bold tracking-[0.15em] uppercase mb-6 uppercase">
                        {member.role}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {member.name}
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto italic font-light">
                        Perfil clínico en construcción.
                    </p>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20 pb-24">
                <div className="bg-white rounded-[24px] shadow-xl border border-[#00A89C]/10 overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Imagen Lateral */}
                    <div className="w-full md:w-5/12 h-[450px] md:h-auto bg-gray-100">
                        <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                            style={{ objectPosition: "center top" }}
                        />
                    </div>

                    {/* Contenido */}
                    <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0a1c1a] mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Acerca de {member.name.split(' ')[0]}
                        </h2>
                        
                        <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
                            <p className="bg-[#f1f5f4] p-6 rounded-2xl border border-gray-200 text-sm">
                                <strong>Nota Interna:</strong> Esta página ha sido generada automáticamente como plantilla estructural. 
                                Envíame el contenido exacto (experiencia, enfoque terapéutico, formación, etc.) de este especialista para inyectarlo aquí.
                            </p>
                        </div>

                        <div className="mt-auto pt-8 border-t border-gray-100 flex gap-4">
                            <Link to="/" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-[#0a1c1a] hover:bg-[#00A89C] text-white font-bold text-[15px] transition-all" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Volver a Equipo
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default TeamMemberProfile;

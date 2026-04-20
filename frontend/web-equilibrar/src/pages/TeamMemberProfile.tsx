import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './specialists.css';

import ClaudioReyes from './specialists/ClaudioReyes';
import CarlosCarrasco from './specialists/CarlosCarrasco';
import ValentinKeller from './specialists/ValentinKeller';
import AlanLama from './specialists/AlanLama';
import DanielaBaeza from './specialists/DanielaBaeza';

const TeamMemberProfile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    switch (slug) {
        case 'claudio-reyes': return <ClaudioReyes />;
        case 'carlos-carrasco': return <CarlosCarrasco />;
        case 'valentin-keller': return <ValentinKeller />;
        case 'alan-lama': return <AlanLama />;
        case 'daniela-baeza': return <DanielaBaeza />;
        default:
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#f9fcfb] text-gray-700 font-inter">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Especialista no encontrado</h2>
                        <Link to="/" className="text-[#00A89C] underline hover:text-[#0a1c1a]">Volver al inicio</Link>
                    </div>
                </div>
            );
    }
};

export default TeamMemberProfile;

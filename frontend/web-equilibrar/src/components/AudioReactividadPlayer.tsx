import React, { useState } from 'react';
import './HypnosisPlayer.css';
import logo from '../assets/images/logo.png';
import audioFile from '../assets/audio/Hipnosis RFAI Reactivo FINAL.mp3';

const AudioReactividadPlayer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleGuia = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="reproductor-hipnosis">
                    <img src={logo} alt="Logo Clínica Equilibrar" className="reproductor-logo" />

                    <h2>Hipnosis para la Reprogramación de la reactividad emocional</h2>
                    <p className="text-sm uppercase tracking-widest font-bold text-brand-primary mt-2">
                        AUDIO Y GUÍA CREADA IMPLEMENTAR LA CAPACIDAD DE REGULAR LA EXPERIENCIA
                    </p>

                    <audio controls controlsList="nodownload" className="mt-8">
                        <source src={audioFile} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>

                    <div className="reproductor-footer">
                        <span className="pulse-icon"></span>
                        FORTALECE TU INTERIOR
                        <span className="pulse-icon"></span>
                    </div>
                </div>

                <div className="guia-contenedor">
                    <div className="guia-toggle" onClick={toggleGuia}>
                        {isOpen ? "- Cerrar Guía" : "+ Leer Guía de Acompañamiento"}
                    </div>

                    <div className={`guia-contenido ${isOpen ? 'guia-abierta' : ''}`}>
                        <h3>Consideraciones previas</h3>

                        <div className="guia-seccion">
                            Esta sesión de <strong>hipnosis clínica y PNL</strong> está diseñada para ampliar el espacio entre el estímulo y la respuesta, fortaleciendo tu capacidad de pausa consciente.
                        </div>

                        <div className="guia-seccion">
                            Este proceso no busca eliminar tu rapidez mental ni tu capacidad de reacción, sino transformar la urgencia automática en respuesta elegida. No pierdes el control en ningún momento; se trata de un estado de relajación profunda que permite que tu sistema aprenda a regular velocidad sin perder eficacia. Aquí no se frena la mente; se introduce una pausa que amplía tus posibilidades.
                        </div>

                        <h4>Recomendaciones de uso:</h4>
                        <ul className="recomendaciones-lista">
                            <li>Escucha en un espacio seguro y libre de interrupciones.</li>
                            <li>Adopta una postura cómoda, sin forzar el cuerpo.</li>
                            <li><strong>No utilices este audio mientras conduces</strong> o realizas actividades que requieran atención externa.</li>
                            <li>Permite que la experiencia fluya sin exigirte "hacerlo bien".</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AudioReactividadPlayer;

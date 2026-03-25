import React, { useState } from 'react';
import './HypnosisPlayer.css'; // Importing shared styles
import logo from '../assets/images/logo.png';
import audioFile from '../assets/audio/hipnosis-culpa.mp3';

const HypnosisCulpaPlayer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleGuia = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="reproductor-hipnosis">
                    <img src={logo} alt="Logo Clínica Equilibrar" className="reproductor-logo" />

                    <h2>Hipnosis para la Reprogramación</h2>
                    <p>Audio y Guía creada para reprogramar las emociones</p>

                    <audio controls controlsList="nodownload">
                        <source src={audioFile} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>

                    <div className="reproductor-footer">
                        <span className="pulse-icon"></span>
                        ENCUENTRA TU EQUILIBRIO
                        <span className="pulse-icon"></span>
                    </div>
                </div>

                <div className="guia-contenedor">
                    <div className="guia-toggle" onClick={toggleGuia}>
                        {isOpen ? "- Cerrar Guía" : "+ Leer Guía de Acompañamiento"}
                    </div>

                    <div className={`guia-contenido ${isOpen ? 'guia-abierta' : ''}`}>
                        <h3>Guía de Acompañamiento Terapéutico</h3>

                        <div className="guia-seccion">
                            Esta sesión de <strong>hipnosis clínica y PNL</strong> está diseñada para diferenciar la culpa adaptativa (la que nos ayuda a reparar errores) de la <strong>culpa no adaptativa</strong>, aquella que se manifiesta como un autojuicio constante que erosiona la autoestima.
                        </div>

                        <div className="guia-seccion">
                            Este proceso no busca eliminar tu responsabilidad, sino transformar la violencia interna en una <strong>autorregulación amable y realista</strong>. No pierdes el control en ningún momento; se trata de un estado de relajación profunda y atención focalizada.
                        </div>

                        <h4>Recomendaciones de uso:</h4>
                        <ul className="recomendaciones-lista">
                            <li>Escucha en un espacio seguro y libre de interrupciones.</li>
                            <li>Adopta una postura cómoda, sin forzar el cuerpo.</li>
                            <li><strong>No utilices este audio mientras conduces</strong> o realizas actividades que requieran atención externa.</li>
                            <li>Permite que la experiencia fluya sin exigirte "hacerlo bien".</li>
                        </ul>

                        <div className="guia-seccion" style={{ fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '30px', fontSize: '14px' }}>
                            "Reducir la culpa no adaptativa no significa dejar de hacerse cargo, sino aprender a hacerlo sin violencia interna."
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HypnosisCulpaPlayer;

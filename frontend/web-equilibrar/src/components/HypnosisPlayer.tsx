import React, { useState } from 'react';
import './HypnosisPlayer.css';
import logo from '../assets/images/logo.png';
import audioFile from '../assets/audio/autoestima-y-amor-propio.mp3';

const HypnosisPlayer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleGuia = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="reproductor-hipnosis">
                    <img src={logo} alt="Logo Clínica Equilibrar" className="reproductor-logo" />

                    <h2>Autoestima y Amor Propio</h2>
                    <p>Audio Subliminal de Reprogramación</p>

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
                            Esta sesión de <strong>reprogramación subliminal y PNL</strong> está diseñada para fortalecer los pilares del amor propio y transformar el autojuicio crítico —que muchas veces erosiona nuestra valía— en una voz interna de validación y seguridad.
                        </div>

                        <div className="guia-seccion">
                            El propósito de este audio no es fomentar una visión egocéntrica, sino facilitar una <strong>aceptación profunda, amable y realista</strong> de quién eres. A través de este proceso, buscamos revisar aprendizajes del pasado para construir nuevas formas de autorregulación emocional y confianza personal.
                        </div>

                        <div className="guia-seccion">
                            Se trata de un estado de atención focalizada y apertura mental, donde mantienes el control en todo momento, permitiendo que las afirmaciones nutran tu autoconcepto de manera natural.
                        </div>

                        <h4>Recomendaciones de uso:</h4>
                        <ul className="recomendaciones-lista">
                            <li><strong>Entorno:</strong> Escucha el audio en un espacio seguro, tranquilo y libre de interrupciones.</li>
                            <li><strong>Postura:</strong> Adopta una posición cómoda que invite a la relajación, sin forzar el cuerpo.</li>
                            <li><strong>Seguridad:</strong> No utilices este audio mientras conduces, trabajas o realizas actividades que requieran de tu atención externa.</li>
                            <li><strong>Fluidez:</strong> Permite que la experiencia sea tal como es, sin exigirte “hacerlo bien” o analizar cada mensaje.</li>
                        </ul>

                        <div className="guia-seccion">
                            Es fundamental recordar que fortalecer el amor propio no es un acto de egoísmo, sino un compromiso con tu bienestar integral. Reducir la autocrítica no significa volverse irresponsable, sino aprender a evolucionar y hacerse cargo de la propia vida sin violencia interna.
                        </div>

                        <div className="guia-seccion" style={{ fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '30px', fontSize: '14px', textAlign: 'center' }}>
                            "Amarse a uno mismo no es un destino, es la práctica diaria de habitar tu propia vida con dignidad, respeto y compasión."
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HypnosisPlayer;

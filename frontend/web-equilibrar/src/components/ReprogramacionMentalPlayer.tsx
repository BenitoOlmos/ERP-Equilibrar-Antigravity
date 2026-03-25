import React, { useState } from 'react';
import './HypnosisPlayer.css'; // Reusing the shared CSS
import logo from '../assets/images/logo.png';
import audioFile from '../assets/audio/Reprogramacion-mental.mp3';

const ReprogramacionMentalPlayer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleGuia = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="reproductor-hipnosis">
                    <img src={logo} alt="Logo Clínica Equilibrar" className="reproductor-logo" />

                    <h2>Reprogramación Mental</h2>
                    <p>Sesión de Actualización Cognitiva</p>

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
                            Este proceso de <strong>reprogramación mental</strong> está diseñado como una herramienta de intervención profunda para actualizar los patrones de pensamiento, creencias y respuestas automáticas que ya no sirven a tu bienestar actual.
                        </div>

                        <div className="guia-seccion">
                            Utilizando principios de la neuroplasticidad y la Programación Neurolingüística (PNL), buscamos crear nuevas rutas mentales que favorezcan el equilibrio y la salud emocional. No se trata de "borrar" tu historia, sino de reestructurar la manera en que tu mente procesa la información para convertirte en el arquitecto de tu nueva mentalidad.
                        </div>

                        <h4>Recomendaciones de uso:</h4>
                        <ul className="recomendaciones-lista">
                            <li><strong>Espacio de introspección:</strong> Escucha la sesión en un entorno libre de distracciones que te permita conectar contigo mismo.</li>
                            <li><strong>Apertura y curiosidad:</strong> Permite que las nuevas ideas se asienten sin necesidad de analizarlas lógicamente de inmediato.</li>
                            <li><strong>Consistencia:</strong> La reprogramación se fortalece con la repetición; la constancia consolidará tus nuevos circuitos neuronales.</li>
                            <li><strong>Seguridad absoluta:</strong> No escuches este audio mientras conduces o realizas actividades que demanden atención alerta.</li>
                        </ul>

                        <div className="guia-seccion" style={{ fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '30px', fontSize: '14px', textAlign: 'center' }}>
                            "La reprogramación mental no es cambiar quién eres, es liberar quién eres de las creencias que te limitan."
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReprogramacionMentalPlayer;

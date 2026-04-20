import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ValentinKeller: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sp-page-wrap">
      <div className="sp-hero">
        <div className="sp-container">
          <div className="sp-hero-card">
            <div className="sp-hero-copy">
              <span className="sp-eyebrow">Trabajo corporal · Regulación fisiológica</span>
              <h1>Valentín Keller</h1>
              <p>Facilitador de trabajo corporal orientado a la regulación fisiológica del sistema. Su intervención aborda el malestar desde el cuerpo: tensión, activación, respiración y pérdida de base.</p>
              <div className="sp-hero-actions">
                <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Valentín</a>
                <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
              </div>
              <div className="sp-hero-note">El cuerpo no es un complemento; participa activamente del proceso terapéutico.</div>
            </div>
            <div className="sp-hero-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5664.jpg')" }}></div>
          </div>
        </div>
      </div>

      <section className="sp-section sp-soft">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Enfoque</span>
            <h3>Trabajo corporal, regulación fisiológica y reorganización somática</h3>
            <p>El cuerpo no es complementario, es parte del problema y también de la solución. Su trabajo permite intervenir cuando la regulación no se logra solo a nivel cognitivo o emocional.</p>
          </article>

          <article className="sp-card">
            <span className="sp-tag">Cuándo conviene agendar</span>
            <h3>Motivos frecuentes de consulta</h3>
            <ul className="sp-mini-list">
              <li>Cuando el síntoma se expresa físicamente</li>
              <li>Cuando hay dificultad para bajar el nivel de activación</li>
              <li>Cuando se necesita recuperar base y estabilidad corporal</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-container">
          <div className="sp-section-head">
            <span className="sp-eyebrow">Formas de intervención dentro del proceso clínico</span>
            <h2>Cómo interviene dentro de la propuesta clínica</h2>
            <p>La página amplía el rol de cada profesional dentro de la lógica del centro: evaluar, indicar e intervenir con criterio.</p>
          </div>
          <div className="sp-grid-3">
            <article className="sp-card">
              <span className="sp-tag">Intervención corporal</span>
              <h3>Shiatsu clínico</h3>
              <p>Trabajo directo sobre el cuerpo para intervenir tensión, rigidez o sobrecarga y facilitar una mejor regulación.</p>
              <ul className="sp-mini-list">
                <li>Disminuir tensión acumulada</li>
                <li>Mejorar respiración</li>
                <li>Recuperar sensación de base</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Regulación</span>
              <h3>Trabajo somático y respiración</h3>
              <p>Espacio orientado a reconocer estados internos, detectar desregulación y desarrollar mayor autorregulación.</p>
              <ul className="sp-mini-list">
                <li>Conciencia corporal</li>
                <li>Ritmo y pausa</li>
                <li>Intervención temprana del desborde</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Entrenamiento</span>
              <h3>Tai Chi y Chi Kung</h3>
              <p>Práctica guiada para integrar atención, movimiento, coordinación y regulación del esfuerzo.</p>
              <ul className="sp-mini-list">
                <li>Regulación en movimiento</li>
                <li>Estabilidad y presencia</li>
                <li>Desarrollo de base corporal</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="sp-section sp-soft2">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Rol dentro del centro</span>
            <h3>Trabajo corporal dentro del sistema clínico</h3>
            <ul className="sp-mini-list">
              <li>Interviene la dimensión corporal del síntoma</li>
              <li>Facilita procesos de regulación fisiológica</li>
              <li>Complementa intervenciones clínicas cuando el cuerpo está comprometido</li>
            </ul>
          </article>

          <article className="sp-card" id="agendar">
            <span className="sp-tag">Agendamiento</span>
            <h3>Dos formas de comenzar</h3>
            <p>Puedes agendar directamente una hora con este profesional si ya tienes claridad sobre lo que buscas, o partir por la evaluación ejecutiva para ordenar el caso e indicar el mejor camino.</p>
            <div className="sp-hero-actions mt-4 flex gap-2">
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Valentín</a>
              <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Agendar evaluación ejecutiva</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-container">
          <article className="sp-wide-cta">
            <div>
              <span className="sp-eyebrow" style={{ background: 'rgba(255,255,255,.10)', color: '#fff' }}>Siguiente paso</span>
              <h2 style={{ margin: 0, maxWidth: '11ch', fontSize: 'clamp(34px, 4.8vw, 64px)', lineHeight: 0.96, letterSpacing: '-.06em' }}>Agenda una hora o parte por la evaluación ejecutiva</h2>
              <p>La página de cada profesional amplía su enfoque, pero la puerta de entrada sigue siendo la misma: definir con claridad qué necesita hoy cada persona.</p>
            </div>
            <div className="sp-hero-actions">
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Valentín</a>
              <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ValentinKeller;

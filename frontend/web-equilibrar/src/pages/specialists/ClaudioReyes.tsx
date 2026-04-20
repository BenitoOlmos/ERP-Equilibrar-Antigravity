import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClaudioReyes: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sp-page-wrap">
      <div className="sp-hero">
        <div className="sp-container">
          <div className="sp-hero-card">
            <div className="sp-hero-copy">
              <span className="sp-eyebrow">Psicología clínica · Dirección terapéutica</span>
              <h1>Claudio Reyes</h1>
              <p>Psicólogo clínico orientado a la evaluación del caso y la definición de la estrategia terapéutica dentro del sistema clínico de Equilibrar. Su trabajo no se centra en intervenir síntomas aislados, sino en comprender cómo está funcionando hoy la persona y qué sostiene ese funcionamiento.</p>
              <div className="sp-hero-actions">
                <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Claudio</a>
                <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
              </div>
              <div className="sp-hero-note">La evaluación ejecutiva permite ordenar el caso y decidir la intervención inicial.</div>
            </div>
            <div className="sp-hero-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5750.jpg')" }}></div>
          </div>
        </div>
      </div>

      <section className="sp-section sp-soft">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Enfoque</span>
            <h3>Lectura clínica, dirección terapéutica y precisión diagnóstica funcional</h3>
            <p>La intervención parte por una lectura clínica precisa: qué se está repitiendo, qué está desregulado y qué tipo de intervención resulta más pertinente en este momento.</p>
          </article>

          <article className="sp-card">
            <span className="sp-tag">Cuándo conviene agendar</span>
            <h3>Motivos frecuentes de consulta</h3>
            <ul className="sp-mini-list">
              <li>Cuando el malestar ya afecta la vida cotidiana</li>
              <li>Cuando hay múltiples factores y no está claro por dónde empezar</li>
              <li>Cuando se necesita una definición clínica clara del problema</li>
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
              <span className="sp-tag">Evaluación</span>
              <h3>Evaluación ejecutiva</h3>
              <p>Sesión clínica inicial para ordenar el caso y definir la estrategia más pertinente.</p>
              <ul className="sp-mini-list">
                <li>Lectura del funcionamiento actual</li>
                <li>Hipótesis clínica inicial</li>
                <li>Definición de estrategia terapéutica</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Intervención</span>
              <h3>Sesiones clínicas individuales</h3>
              <p>Espacio terapéutico orientado a comprender e intervenir dificultades emocionales, relacionales y conductuales.</p>
              <ul className="sp-mini-list">
                <li>Ansiedad y desregulación</li>
                <li>Duelos, crisis y vínculos</li>
                <li>Trabajo clínico individual</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Método focal</span>
              <h3>RFAI</h3>
              <p>Proceso estructurado orientado a modificar patrones emocionales, cognitivos y conductuales de alto impacto en la vida cotidiana.</p>
              <ul className="sp-mini-list">
                <li>Proceso breve y guiado</li>
                <li>Audios personalizados</li>
                <li>Seguimiento durante 30 días</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="sp-section sp-soft2">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Rol dentro del centro</span>
            <h3>Dirección terapéutica dentro del sistema clínico</h3>
            <ul className="sp-mini-list">
              <li>Conduce la evaluación ejecutiva</li>
              <li>Define la dirección terapéutica</li>
              <li>Articula el trabajo con otras especialidades cuando el caso lo requiere</li>
            </ul>
          </article>

          <article className="sp-card" id="agendar">
            <span className="sp-tag">Agendamiento</span>
            <h3>Dos formas de comenzar</h3>
            <p>Puedes agendar directamente una hora con este profesional si ya tienes claridad sobre lo que buscas, o partir por la evaluación ejecutiva para ordenar el caso e indicar el mejor camino.</p>
            <div className="sp-hero-actions mt-4 flex gap-2">
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Claudio</a>
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
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Claudio</a>
              <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ClaudioReyes;

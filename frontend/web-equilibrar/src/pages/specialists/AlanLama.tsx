import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AlanLama: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sp-page-wrap">
      <div className="sp-hero">
        <div className="sp-container">
          <div className="sp-hero-card">
            <div className="sp-hero-copy">
              <span className="sp-eyebrow">Psiquiatría</span>
              <h1>Alan Lama</h1>
              <p>Psiquiatra orientado a integrar evaluación médica y criterio farmacológico dentro de una estrategia clínica mayor. Su intervención no es aislada, sino articulada con el resto del equipo.</p>
              <div className="sp-hero-actions">
                <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Alan</a>
                <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
              </div>
              <div className="sp-hero-note">La evaluación psiquiátrica se integra al criterio clínico general del centro.</div>
            </div>
            <div className="sp-hero-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/alan-v2.png')" }}></div>
          </div>
        </div>
      </div>

      <section className="sp-section sp-soft">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Enfoque</span>
            <h3>Evaluación psiquiátrica integrada a una estrategia clínica mayor</h3>
            <p>La indicación farmacológica se evalúa como un recurso dentro del proceso, no como una solución en sí misma.</p>
          </article>

          <article className="sp-card">
            <span className="sp-tag">Cuándo conviene agendar</span>
            <h3>Motivos frecuentes de consulta</h3>
            <ul className="sp-mini-list">
              <li>Cuando los síntomas requieren evaluación médica</li>
              <li>Cuando hay dudas respecto a tratamiento farmacológico</li>
              <li>Cuando se necesita mayor estabilidad para sostener el proceso</li>
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
              <h3>Consulta psiquiátrica inicial</h3>
              <p>Espacio para evaluar síntomas, antecedentes y necesidad de intervención médica especializada.</p>
              <ul className="sp-mini-list">
                <li>Lectura médica del caso</li>
                <li>Criterio farmacológico si corresponde</li>
                <li>Coordinación con el proceso clínico</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Seguimiento</span>
              <h3>Control y ajuste terapéutico</h3>
              <p>Acompañamiento psiquiátrico orientado a revisar evolución, respuesta al tratamiento y necesidad de ajustes.</p>
              <ul className="sp-mini-list">
                <li>Seguimiento clínico</li>
                <li>Ajuste de indicaciones</li>
                <li>Mayor estabilidad del proceso</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Integración</span>
              <h3>Trabajo articulado con el equipo</h3>
              <p>La intervención psiquiátrica se comprende como parte de una estrategia más amplia, no como una atención aislada.</p>
              <ul className="sp-mini-list">
                <li>Coherencia terapéutica</li>
                <li>Comunicación con el equipo</li>
                <li>Evitar fragmentación del caso</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="sp-section sp-soft2">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Rol dentro del centro</span>
            <h3>Psiquiatría dentro del sistema clínico</h3>
            <ul className="sp-mini-list">
              <li>Realiza evaluación psiquiátrica del caso</li>
              <li>Define si es necesario apoyo farmacológico</li>
              <li>Coordina su intervención con el equipo clínico</li>
            </ul>
          </article>

          <article className="sp-card" id="agendar">
            <span className="sp-tag">Agendamiento</span>
            <h3>Dos formas de comenzar</h3>
            <p>Puedes agendar directamente una hora con este profesional si ya tienes claridad sobre lo que buscas, o partir por la evaluación ejecutiva para ordenar el caso e indicar el mejor camino.</p>
            <div className="sp-hero-actions mt-4 flex gap-2">
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Alan</a>
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
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Alan</a>
              <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AlanLama;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CarlosCarrasco: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sp-page-wrap">
      <div className="sp-hero">
        <div className="sp-container">
          <div className="sp-hero-card">
            <div className="sp-hero-copy">
              <span className="sp-eyebrow">Neurociencia aplicada</span>
              <h1>Carlos Carrasco</h1>
              <p>Biólogo y doctor en neurociencias orientado a traducir conocimiento científico en herramientas aplicables al funcionamiento cotidiano. Su trabajo permite comprender y regular estados de activación, atención y comportamiento desde una base neurobiológica.</p>
              <div className="sp-hero-actions">
                <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Carlos</a>
                <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
              </div>
              <div className="sp-hero-note">La neurociencia aplicada permite entender mejor activación, hábitos y respuesta al estrés.</div>
            </div>
            <div className="sp-hero-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5728.jpg')" }}></div>
          </div>
        </div>
      </div>

      <section className="sp-section sp-soft">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Enfoque</span>
            <h3>Neurociencia aplicada al bienestar, la regulación y el cambio</h3>
            <p>No se trata de explicar el cerebro, sino de intervenir sobre cómo está operando: activación, foco, hábitos y respuesta al estrés.</p>
          </article>

          <article className="sp-card">
            <span className="sp-tag">Cuándo conviene agendar</span>
            <h3>Motivos frecuentes de consulta</h3>
            <ul className="sp-mini-list">
              <li>Cuando hay estrés sostenido o fatiga mental</li>
              <li>Cuando cuesta sostener hábitos o foco</li>
              <li>Cuando se requiere mayor comprensión y regulación del sistema nervioso</li>
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
              <span className="sp-tag">Sesión individual</span>
              <h3>Acompañamiento en bienestar y regulación</h3>
              <p>Espacio orientado a comprender y regular estados emocionales y conductuales desde evidencia científica aplicada.</p>
              <ul className="sp-mini-list">
                <li>Estrés y sobrecarga</li>
                <li>Foco atencional y claridad</li>
                <li>Cambio de hábitos</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Programa</span>
              <h3>Regulación y bienestar basado en neurociencias</h3>
              <p>Proceso breve para desarrollar autorregulación, comprensión cognitivo-emocional y hábitos más estables.</p>
              <ul className="sp-mini-list">
                <li>Plan personalizado</li>
                <li>Seguimiento entre sesiones</li>
                <li>Herramientas prácticas</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Formación</span>
              <h3>Talleres y cursos</h3>
              <p>Instancias de aprendizaje aplicadas a estrés, hábitos, aprendizaje y toma de decisiones.</p>
              <ul className="sp-mini-list">
                <li>Estrés y regulación</li>
                <li>Atención y hábitos</li>
                <li>Liderazgo y decisiones</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="sp-section sp-soft2">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Rol dentro del centro</span>
            <h3>Neurociencia como marco aplicado dentro del centro</h3>
            <ul className="sp-mini-list">
              <li>Aporta una lectura neurobiológica del funcionamiento actual</li>
              <li>Traduce evidencia en herramientas concretas</li>
              <li>Complementa procesos clínicos cuando es necesario trabajar regulación y hábitos</li>
            </ul>
          </article>

          <article className="sp-card" id="agendar">
            <span className="sp-tag">Agendamiento</span>
            <h3>Dos formas de comenzar</h3>
            <p>Puedes agendar directamente una hora con este profesional si ya tienes claridad sobre lo que buscas, o partir por la evaluación ejecutiva para ordenar el caso e indicar el mejor camino.</p>
            <div className="sp-hero-actions mt-4 flex gap-2">
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Carlos</a>
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
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Carlos</a>
              <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default CarlosCarrasco;

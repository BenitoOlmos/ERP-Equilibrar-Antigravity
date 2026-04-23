import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DanielaBaeza: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sp-page-wrap">
      <div className="sp-hero">
        <div className="sp-container">
          <div className="sp-hero-card">
            <div className="sp-hero-copy">
              <span className="sp-eyebrow">Análisis sistémico</span>
              <h1>Daniela Baeza</h1>
              <p>Profesional orientada al análisis de dinámicas vinculares y procesos relacionales. Su trabajo permite comprender movimientos no visibles que influyen en el presente y favorecen el bienestar y el equilibrio emocional.</p>
              <div className="sp-hero-actions">
                <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Daniela</a>
                <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
              </div>
              <div className="sp-hero-note">El análisis sistémico permite observar aquello que no siempre aparece a simple vista y que influye en nuestra forma de vincularnos.</div>
            </div>
            <div className="sp-hero-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/Captura-de-Pantalla-2026-04-19-a-las-08.15.09.png')" }}></div>
          </div>
        </div>
      </div>

      <section className="sp-section sp-soft">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Enfoque</span>
            <h3>Análisis sistémico y reorganización de patrones profundos</h3>
            <p>No trabaja sobre el síntoma inmediato, sino sobre las estructuras que lo organizan: vínculos, repeticiones y configuraciones profundas.</p>
          </article>

          <article className="sp-card">
            <span className="sp-tag">Cuándo conviene agendar</span>
            <h3>Motivos frecuentes de consulta</h3>
            <ul className="sp-mini-list">
              <li>Cuando hay situaciones que se repiten sin explicación clara</li>
              <li>Cuando el malestar está vinculado a relaciones o historia personal</li>
              <li>Cuando se necesita una lectura más profunda del problema</li>
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
              <span className="sp-tag">Intervención</span>
              <h3>Intervención sistémica personal</h3>
              <p>Espacio terapéutico orientado a identificar y reorganizar dinámicas relacionales profundas que influyen en la experiencia actual.</p>
              <ul className="sp-mini-list">
                <li>Patrones repetitivos</li>
                <li>Orden interno</li>
                <li>Procesos estancados</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Módulo breve</span>
              <h3>Regulación emocional sistémica</h3>
              <p>Intervención breve orientada a trabajar emociones específicas desde una mirada integradora.</p>
              <ul className="sp-mini-list">
                <li>Rabia, tristeza o miedo</li>
                <li>Menos respuestas automáticas</li>
                <li>Mayor autorregulación</li>
              </ul>
            </article>
            <article className="sp-card">
              <span className="sp-tag">Programa</span>
              <h3>Proceso de orden personal</h3>
              <p>Proceso que articula trabajo clínico y sistémico dentro de una lógica más integral.</p>
              <ul className="sp-mini-list">
                <li>Mirada relacional profunda</li>
                <li>Articulación con otros recursos</li>
                <li>Seguimiento del proceso</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="sp-section sp-soft2">
        <div className="sp-container sp-grid-2">
          <article className="sp-card">
            <span className="sp-tag">Rol dentro del centro</span>
            <h3>Análisis sistémico dentro del sistema clínico</h3>
            <ul className="sp-mini-list">
              <li>Amplía la comprensión del caso</li>
              <li>Hace visibles patrones relacionales invisibles</li>
              <li>Complementa procesos clínicos cuando el problema no se resuelve desde lo evidente</li>
            </ul>
          </article>

          <article className="sp-card" id="agendar">
            <span className="sp-tag">Agendamiento</span>
            <h3>Dos formas de comenzar</h3>
            <p>Puedes agendar directamente una hora con este profesional si ya tienes claridad sobre lo que buscas, o partir por la evaluación ejecutiva para ordenar el caso e indicar el mejor camino.</p>
            <div className="sp-hero-actions mt-4 flex gap-2">
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Daniela</a>
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
              <a className="sp-btn sp-btn-primary" href="https://wa.me/56930179724" target="_blank" rel="noreferrer">Agendar con Daniela</a>
              <Link className="sp-btn sp-btn-secondary" to="/#evaluacion">Ir a evaluación ejecutiva</Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default DanielaBaeza;

import React from 'react';
import { Link } from 'react-router-dom';

import logoImg from '../assets/images/logo-clinica-equilibrar.png';
import rfai1Img from '../assets/images/RFAI-1.png';
import mujer5Img from '../assets/images/mujer-5.png'; // Nueva imagen del HTML

const LandingRFAI: React.FC = () => {
    return (
        <div className="rfai-wrapper">
            <style dangerouslySetInnerHTML={{
                __html: `
        .rfai-wrapper {
          --primary:#0f97b9;
          --primary-dark:#0a7f9a;
          --primary-soft:#eaf7fb;
          --text:#22343a;
          --text-soft:#667982;
          --line:#dfecef;
          --bg:#ffffff;
          --bg-soft:#f6fbfc;
          --white:#ffffff;
          --shadow:0 18px 40px rgba(16, 69, 82, 0.08);
          --radius-xl:32px;
          --radius-lg:24px;
          --radius-md:18px;
          --max:1180px;

          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.55;
        }

        .rfai-wrapper * {
          box-sizing:border-box;
          margin:0;
          padding:0;
        }

        .rfai-wrapper html {
          scroll-behavior:smooth;
        }

        .rfai-wrapper img, .rfai-wrapper video {
          display:block;
          max-width:100%;
        }

        .rfai-wrapper img {
          object-fit:cover;
        }

        .rfai-wrapper a {
          text-decoration:none;
          color:inherit;
        }

        .rfai-container {
          width:min(92%, var(--max));
          margin:0 auto;
        }

        .rfai-topbar {
          position:sticky;
          top:0;
          z-index:50;
          background:rgba(255,255,255,.92);
          backdrop-filter: blur(12px);
          border-bottom:1px solid rgba(34,52,58,.06);
        }

        .rfai-header {
          min-height:84px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
        }

        .rfai-brand {
          display:flex;
          align-items:center;
          gap:14px;
          min-width:0;
        }

        .rfai-brand img {
          width:54px;
          height:54px;
          object-fit:contain;
          flex-shrink:0;
        }

        .rfai-brand-copy strong {
          display:block;
          color:var(--text);
          font-size:1rem;
          line-height:1.05;
        }

        .rfai-brand-copy span {
          display:block;
          margin-top:3px;
          color:var(--text-soft);
          font-size:.84rem;
        }

        .rfai-nav {
          display:flex;
          align-items:center;
          gap:26px;
        }

        .rfai-nav a {
          color:var(--text-soft);
          font-size:.95rem;
          transition:.2s ease;
        }

        .rfai-nav a:hover {
          color:var(--primary-dark);
        }

        .rfai-header-actions {
          display:flex;
          align-items:center;
          gap:12px;
        }

        .rfai-btn {
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-height:50px;
          padding:0 22px;
          border-radius:999px;
          font-weight:600;
          font-size:.95rem;
          transition:.2s ease;
          border:1px solid transparent;
          cursor:pointer;
          white-space:nowrap;
        }

        .rfai-btn-primary {
          background:linear-gradient(135deg, var(--primary), var(--primary-dark));
          color:#fff;
          box-shadow:0 12px 26px rgba(15,151,185,.22);
        }

        .rfai-btn-primary:hover {
          transform:translateY(-1px);
        }

        .rfai-btn-secondary {
          background:#fff;
          color:var(--primary-dark);
          border-color:rgba(15,151,185,.20);
        }

        .rfai-btn-secondary:hover {
          background:var(--primary-soft);
        }

        .rfai-hero {
          padding:54px 0 72px;
          background:
            radial-gradient(circle at top left, rgba(15,151,185,.08), transparent 24%),
            linear-gradient(180deg, #ffffff 0%, #f9fcfd 100%);
        }

        .rfai-hero-grid {
          display:grid;
          grid-template-columns:1.02fr .98fr;
          gap:50px;
          align-items:center;
        }

        .rfai-eyebrow {
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 14px;
          border-radius:999px;
          background:var(--primary-soft);
          color:var(--primary-dark);
          font-size:.88rem;
          font-weight:700;
          margin-bottom:18px;
        }

        .rfai-hero h1 {
          font-size:clamp(2.7rem, 6vw, 4.8rem);
          line-height:.96;
          letter-spacing:-.05em;
          max-width:10ch;
          margin-bottom:18px;
        }

        .rfai-hero p {
          font-size:1.06rem;
          color:var(--text-soft);
          max-width:56ch;
        }

        .rfai-hero-actions {
          display:flex;
          gap:14px;
          flex-wrap:wrap;
          margin-top:28px;
        }

        .rfai-hero-media {
          border-radius:var(--radius-xl);
          overflow:hidden;
          border:1px solid var(--line);
          background:#fff;
          box-shadow:var(--shadow);
          min-height:540px;
          position:relative;
        }

        .rfai-hero-media img {
          width:100%;
          height:100%;
        }

        .rfai-hero-media::after {
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.08)),
            linear-gradient(135deg, rgba(15,151,185,.04), rgba(15,151,185,.01));
          pointer-events:none;
        }

        .rfai-section {
          padding:84px 0;
        }

        .rfai-section-head {
          max-width:760px;
          margin-bottom:32px;
        }

        .rfai-section-head h2 {
          font-size:clamp(2rem, 4vw, 3.2rem);
          line-height:1.02;
          letter-spacing:-.04em;
          margin-bottom:14px;
        }

        .rfai-section-head p {
          color:var(--text-soft);
          font-size:1.03rem;
          max-width:60ch;
        }

        .rfai-cards-3 {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:22px;
        }

        .rfai-card {
          background:#fff;
          border:1px solid var(--line);
          border-radius:26px;
          padding:28px;
          box-shadow:var(--shadow);
          min-height:220px;
        }

        .rfai-card .rfai-step {
          width:42px;
          height:42px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:var(--primary-soft);
          color:var(--primary-dark);
          font-weight:700;
          margin-bottom:18px;
        }

        .rfai-card h3 {
          font-size:1.1rem;
          margin-bottom:10px;
        }

        .rfai-card p {
          color:var(--text-soft);
          font-size:.98rem;
        }

        .rfai-split {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:56px;
          align-items:center;
        }

        .rfai-photo {
          min-height:520px;
          border-radius:var(--radius-xl);
          overflow:hidden;
          border:1px solid var(--line);
          background:#fff;
          box-shadow:var(--shadow);
          position:relative;
        }

        .rfai-photo img {
          width:100%;
          height:100%;
        }

        .rfai-photo::after {
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(0,0,0,.01), rgba(0,0,0,.06)),
            linear-gradient(135deg, rgba(15,151,185,.03), rgba(15,151,185,.01));
          pointer-events:none;
        }

        .rfai-simple-list {
          display:grid;
          gap:12px;
          margin-top:22px;
        }

        .rfai-simple-item {
          background:#fff;
          border:1px solid var(--line);
          border-radius:18px;
          padding:16px 18px;
          box-shadow:var(--shadow);
          color:var(--primary-dark);
          font-weight:600;
          font-size:.96rem;
        }

        .rfai-soft-band {
          background:var(--bg-soft);
          border-top:1px solid var(--line);
          border-bottom:1px solid var(--line);
        }

        .rfai-soft-band-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:18px;
          padding:28px 0;
        }

        .rfai-soft-band-item {
          background:#fff;
          border:1px solid var(--line);
          border-radius:20px;
          padding:20px;
          box-shadow:var(--shadow);
        }

        .rfai-soft-band-item strong {
          display:block;
          margin-bottom:6px;
          font-size:1rem;
          color:var(--text);
        }

        .rfai-soft-band-item span {
          color:var(--text-soft);
          font-size:.94rem;
        }

        .rfai-profiles-grid {
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:18px;
          margin-top:24px;
        }

        .rfai-profile-card {
          background:#fff;
          border:1px solid var(--line);
          border-radius:22px;
          padding:22px;
          box-shadow:var(--shadow);
          min-height:200px;
        }

        .rfai-profile-card h3 {
          font-size:1rem;
          margin-bottom:10px;
          color:var(--primary-dark);
        }

        .rfai-profile-card p {
          color:var(--text-soft);
          font-size:.94rem;
        }

        .rfai-footer {
          padding:28px 0 40px;
          border-top:1px solid rgba(34,52,58,.06);
          background:#fff;
        }

        .rfai-footer-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:18px;
          flex-wrap:wrap;
        }

        .rfai-footer-row p,
        .rfai-footer-row a {
          color:var(--text-soft);
          font-size:.94rem;
        }

        .rfai-footer-links {
          display:flex;
          gap:16px;
          flex-wrap:wrap;
        }

        @media (max-width: 1080px){
          .rfai-hero-grid,
          .rfai-split {
            grid-template-columns:1fr;
          }

          .rfai-cards-3,
          .rfai-soft-band-grid,
          .rfai-profiles-grid {
            grid-template-columns:1fr 1fr;
          }

          .rfai-hero-media,
          .rfai-photo {
            min-height:auto;
          }
        }

        @media (max-width: 760px){
          .rfai-nav {
            display:none;
          }

          .rfai-cards-3,
          .rfai-soft-band-grid,
          .rfai-profiles-grid {
            grid-template-columns:1fr;
          }

          .rfai-hero-actions,
          .rfai-header-actions {
            flex-direction:column;
            align-items:stretch;
          }

          .rfai-btn {
            width:100%;
          }

          .rfai-hero {
            padding-top:30px;
          }

          .rfai-hero h1 {
            max-width:none;
          }
        }
        `
            }} />

            <div className="rfai-topbar">
                <header className="rfai-container rfai-header">
                    <Link to="/" className="rfai-brand" aria-label="Centro Clínico Equilibrar">
                        <img src={logoImg} alt="Logo Centro Clínico Equilibrar" />
                        <div className="rfai-brand-copy">
                            <strong>Centro Clínico Equilibrar</strong>
                            <span>Psicología clínica y modelo RFAI</span>
                        </div>
                    </Link>

                    <nav className="rfai-nav">
                        <Link to="/#test">Test</Link>
                        <Link to="/#rfai">RFAI</Link>
                        <Link to="/#podcast">Podcast</Link>
                        <Link to="/#equipo">Equipo</Link>
                        <Link to="/#contacto">Contacto</Link>
                    </nav>

                    <div className="rfai-header-actions">
                        <Link className="rfai-btn rfai-btn-primary" to="/test-rfai">Hacer test</Link>
                    </div>
                </header>
            </div>

            <main>
                <section className="rfai-hero">
                    <div className="rfai-container rfai-hero-grid">
                        <div>
                            <div className="rfai-eyebrow">Test RFAI</div>

                            <h1>Una primera lectura clínica de tu patrón emocional</h1>

                            <p>
                                Un punto de partida claro para observar cómo está funcionando tu mente hoy
                                y comenzar con mayor orientación.
                            </p>

                            <div className="rfai-hero-actions">
                                <Link className="rfai-btn rfai-btn-primary" to="/test-rfai">Comenzar test</Link>
                                <a className="rfai-btn rfai-btn-secondary" href="#recibes">Qué recibirás</a>
                            </div>
                        </div>

                        <div className="rfai-hero-media">
                            <img src={rfai1Img} alt="Test RFAI" />
                        </div>
                    </div>
                </section>

                <section className="rfai-soft-band">
                    <div className="rfai-container rfai-soft-band-grid">
                        <div className="rfai-soft-band-item">
                            <strong>Breve</strong>
                            <span>Una experiencia simple y fácil de responder.</span>
                        </div>
                        <div className="rfai-soft-band-item">
                            <strong>Clara</strong>
                            <span>Una lectura inicial más comprensible de lo que estás viviendo.</span>
                        </div>
                        <div className="rfai-soft-band-item">
                            <strong>Útil</strong>
                            <span>Un punto de partida para saber si RFAI puede ayudarte.</span>
                        </div>
                    </div>
                </section>

                <section className="rfai-section">
                    <div className="rfai-container">
                        <div className="rfai-section-head">
                            <h2>Qué observa</h2>
                            <p>
                                El test fue diseñado para mirar de forma simple cómo se organiza hoy tu experiencia emocional.
                            </p>
                        </div>

                        <div className="rfai-cards-3">
                            <article className="rfai-card">
                                <div className="rfai-step">1</div>
                                <h3>Activación emocional</h3>
                                <p>
                                    Cómo se movilizan tus emociones frente al estrés, las relaciones o situaciones que te desafían.
                                </p>
                            </article>

                            <article className="rfai-card">
                                <div className="rfai-step">2</div>
                                <h3>Activación racional</h3>
                                <p>
                                    Cuánto predomina el control mental, la sobreinterpretación o la necesidad de entenderlo todo.
                                </p>
                            </article>

                            <article className="rfai-card">
                                <div className="rfai-step">3</div>
                                <h3>Activación fisiológica</h3>
                                <p>
                                    Cómo responde tu cuerpo al estrés: tensión, cansancio, alerta o agotamiento.
                                </p>
                            </article>

                            <article className="rfai-card">
                                <div className="rfai-step">4</div>
                                <h3>Capacidad de regulación</h3>
                                <p>
                                    Evaluamos tu capacidad de volver al equilibrio. El test integra activación y regulación para identificar el equilibrio que necesitas desarrollar.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="rfai-section" id="recibes">
                    <div className="rfai-container rfai-split">
                        <div>
                            <div className="rfai-section-head" style={{ marginBottom: 0 }}>
                                <h2>Qué recibirás</h2>
                                <p>
                                    Solo lo esencial: una lectura inicial para que puedas entender mejor tu forma de funcionamiento actual.
                                </p>
                            </div>

                            <div className="rfai-simple-list">
                                <div class="rfai-simple-item">Una lectura breve de tu perfil emocional.</div>
                                <div class="rfai-simple-item">Una orientación sobre cómo estás respondiendo al estrés.</div>
                                <div class="rfai-simple-item">Una referencia inicial sobre si RFAI puede ayudarte.</div>
                            </div>

                            <div className="rfai-hero-actions">
                                <Link className="rfai-btn rfai-btn-primary" to="/test-rfai">Comenzar test</Link>
                            </div>
                        </div>

                        <div className="rfai-photo">
                            <img src={mujer5Img} alt="Resultado y orientación inicial del Test RFAI" />
                        </div>
                    </div>
                </section>

                <section className="rfai-section">
                    <div className="rfai-container">
                        <div className="rfai-section-head">
                            <h2>Los perfiles que orientan tu resultado</h2>
                            <p>
                                El test puede mostrar distintas formas de funcionamiento. La idea no es etiquetarte, sino ayudarte a reconocer el patrón que hoy está organizando tu experiencia.
                            </p>
                        </div>

                        <div className="rfai-profiles-grid">
                            <article className="rfai-profile-card">
                                <h3>Hiper regulado</h3>
                                <p>Mucho control, alta exigencia interna y dificultad para soltar o bajar la tensión.</p>
                            </article>

                            <article className="rfai-profile-card">
                                <h3>Hiper reactivo</h3>
                                <p>Alta impulsividad o descontrol de respuestas emocionales frente a lo que ocurre.</p>
                            </article>

                            <article className="rfai-profile-card">
                                <h3>Inhibido</h3>
                                <p>Baja energía, desconexión, dificultad para movilizarse y sensación de estancamiento.</p>
                            </article>

                            <article className="rfai-profile-card">
                                <h3>Sobre adaptado</h3>
                                <p>Tendencia a ajustarse excesivamente al entorno, postergando las propias necesidades.</p>
                            </article>

                            <article className="rfai-profile-card">
                                <h3>Evaluación más profunda</h3>
                                <p>Cuando el resultado no encaja de forma clara en una categoría, se requiere una lectura más especializada.</p>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="rfai-section">
                    <div className="rfai-container">
                        <div className="rfai-section-head">
                            <h2>Antes de empezar</h2>
                            <p>
                                No busca etiquetarte ni reemplazar una evaluación clínica completa. Busca darte una lectura inicial con mayor claridad.
                            </p>
                        </div>

                        <div className="rfai-cards-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                            <article className="rfai-card">
                                <h3>Sin respuestas correctas</h3>
                                <p>Responde desde cómo te sientes y funcionas hoy.</p>
                            </article>

                            <article className="rfai-card">
                                <h3>Sin preparación previa</h3>
                                <p>No necesitas hacer nada especial antes de responder.</p>
                            </article>

                            <article className="rfai-card">
                                <h3>Con orientación concreta</h3>
                                <p>Al finalizar tendrás un punto de partida más claro para decidir tus próximos pasos.</p>
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="rfai-footer">
                <div className="rfai-container rfai-footer-row">
                    <p>© 2026 Centro Clínico Equilibrar</p>
                    <div className="rfai-footer-links">
                        <Link to="/#test">Test</Link>
                        <Link to="/#rfai">RFAI</Link>
                        <Link to="/#podcast">Podcast</Link>
                        <Link to="/#equipo">Equipo</Link>
                        <Link to="/#contacto">Contacto</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingRFAI;

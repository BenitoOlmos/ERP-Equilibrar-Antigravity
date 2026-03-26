import React from 'react';

import logoImg from '../assets/images/logo-clinica-equilibrar.png';
import rfai1Img from '../assets/images/RFAI-1.png';
import homeVideo from '../assets/images/home-equilibrar.mp4';
import claudioImg from '../assets/images/claudio-reyes.png';
import carlosImg from '../assets/images/carlos-carrasco.png';
import valentinImg from '../assets/images/valentin-keller.png';
import alanImg from '../assets/images/alan-lama.png';
import rfai2Img from '../assets/images/RFAI-2.png';

const Home: React.FC = () => {
   const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
         const topOffset = element.getBoundingClientRect().top + window.scrollY - 86; // accounting for 86px fixed topbar
         window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
   };

   return (
      <div className="home-wrapper">
         <style dangerouslySetInnerHTML={{
            __html: `
        .home-wrapper {
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
          padding-top: 90px;
        }

        .home-wrapper * {
          box-sizing:border-box;
          margin:0;
          padding:0;
        }

        .home-wrapper img, .home-wrapper video {
          display:block;
          max-width:100%;
        }

        .home-wrapper img {
          object-fit:cover;
        }

        .home-wrapper a {
          color:inherit;
          text-decoration:none;
        }

        .home-wrapper html {
          scroll-behavior:smooth;
        }

        .home-container {
          width:min(92%, var(--max));
          margin:0 auto;
        }

        .home-topbar {
          position:fixed;
          top:0;
          left:0;
          width:100%;
          z-index:999;
          background:rgba(10,20,24,.75);
          backdrop-filter: blur(14px);
          border-bottom:1px solid rgba(255,255,255,.08);
        }

        .home-header {
          min-height:86px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
        }

        .home-brand {
          display:flex;
          align-items:center;
          gap:14px;
          min-width:0;
        }

        .home-brand img {
          width:54px;
          height:54px;
          object-fit:contain;
          flex-shrink:0;
        }

        .home-brand-copy strong {
          display:block;
          color:#ffffff;
          font-size:1rem;
          line-height:1.05;
        }

        .home-brand-copy span {
          display:block;
          margin-top:3px;
          color:rgba(255,255,255,.82);
          font-size:.84rem;
        }

        .home-nav {
          display:flex;
          align-items:center;
          gap:26px;
        }

        .home-nav a {
          color:rgba(255,255,255,.88);
          font-size:.95rem;
          transition:.2s ease;
        }

        .home-nav a:hover {
          color:#ffffff;
        }

        .home-header-actions {
          display:flex;
          align-items:center;
          gap:12px;
        }

        .home-btn {
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

        .home-btn-primary {
          background:#ffffff;
          color:var(--primary-dark);
          box-shadow:0 12px 26px rgba(0,0,0,.12);
        }

        .home-btn-primary:hover {
          transform:translateY(-1px);
        }

        .home-btn-secondary {
          background:var(--primary);
          color:#ffffff;
          border-color:transparent;
        }

        .home-btn-secondary:hover {
          background:var(--primary-dark);
        }

        .home-hero {
          position:relative;
          min-height:100vh;
          display:flex;
          align-items:flex-end;
          overflow:hidden;
          background:#0b1518;
        }

        .home-hero-video {
          position:absolute;
          inset:0;
          z-index:1;
        }

        .home-hero-video video {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .home-hero-overlay {
          position:absolute;
          inset:0;
          z-index:2;
          background:
            linear-gradient(180deg, rgba(7,17,21,.46) 0%, rgba(7,17,21,.34) 26%, rgba(7,17,21,.62) 72%, rgba(7,17,21,.84) 100%),
            linear-gradient(90deg, rgba(7,17,21,.55) 0%, rgba(7,17,21,.20) 50%, rgba(7,17,21,.28) 100%);
        }

        .home-hero-content {
          position:relative;
          z-index:3;
          width:100%;
          padding:150px 0 72px;
        }

        .home-hero-inner {
          max-width:760px;
        }

        .home-hero h1 {
          font-size:clamp(3rem, 7vw, 6rem);
          line-height:.94;
          letter-spacing:-.06em;
          max-width:10ch;
          margin-bottom:18px;
          color:#ffffff;
        }

        .home-hero p {
          font-size:1.12rem;
          color:rgba(255,255,255,.88);
          max-width:58ch;
        }

        .home-hero-actions {
          display:flex;
          gap:14px;
          flex-wrap:wrap;
          margin-top:30px;
        }

        .home-section {
          padding:90px 0;
        }

        .home-section-head {
          max-width:760px;
          margin-bottom:34px;
        }

        .home-section-head h2 {
          font-size:clamp(2rem, 4vw, 3.4rem);
          line-height:1.02;
          letter-spacing:-.04em;
          margin-bottom:14px;
        }

        .home-section-head p {
          color:var(--text-soft);
          font-size:1.04rem;
          max-width:60ch;
        }

        .home-band {
          background:var(--bg-soft);
          border-top:1px solid var(--line);
          border-bottom:1px solid var(--line);
        }

        .home-band-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:18px;
          padding:28px 0;
        }

        .home-band-item {
          background:#fff;
          border:1px solid var(--line);
          border-radius:20px;
          padding:20px;
          box-shadow:var(--shadow);
        }

        .home-band-item strong {
          display:block;
          margin-bottom:6px;
          color:var(--text);
          font-size:1rem;
        }

        .home-band-item span {
          color:var(--text-soft);
          font-size:.94rem;
        }

        .home-how-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:22px;
        }

        .home-how-card {
          background:#fff;
          border:1px solid var(--line);
          border-radius:26px;
          padding:28px;
          box-shadow:var(--shadow);
          min-height:220px;
        }

        .home-step {
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

        .home-how-card h3 {
          font-size:1.12rem;
          margin-bottom:10px;
        }

        .home-how-card p {
          color:var(--text-soft);
          font-size:.98rem;
        }

        .home-split {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:56px;
          align-items:center;
        }

        .home-photo {
          min-height:540px;
          border-radius:var(--radius-xl);
          overflow:hidden;
          border:1px solid var(--line);
          background:#fff;
          box-shadow:var(--shadow);
          position:relative;
        }

        .home-photo img {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .home-photo::after {
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(0,0,0,.01), rgba(0,0,0,.06)),
            linear-gradient(135deg, rgba(15,151,185,.03), rgba(15,151,185,.01));
          pointer-events:none;
        }

        .home-rfai-badge {
          display:inline-flex;
          padding:10px 14px;
          border-radius:16px;
          background:var(--primary-soft);
          color:var(--primary-dark);
          font-weight:700;
          margin-top:16px;
          margin-bottom:20px;
          font-size:.95rem;
        }

        .home-rfai-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:22px;
          margin-top:28px;
        }

        .home-rfai-card {
          background:#fff;
          border:1px solid var(--line);
          border-radius:24px;
          padding:26px;
          box-shadow:var(--shadow);
          min-height:210px;
        }

        .home-rfai-card h3 {
          font-size:1.08rem;
          margin-bottom:10px;
        }

        .home-rfai-card p {
          color:var(--text-soft);
          font-size:.98rem;
        }

        .home-podcast-box {
          display:grid;
          grid-template-columns:.9fr 1.1fr;
          gap:28px;
          align-items:center;
          background:#fff;
          border:1px solid var(--line);
          border-radius:32px;
          padding:26px;
          box-shadow:var(--shadow);
        }

        .home-podcast-embed {
          min-height:auto;
          border-radius:24px;
          overflow:hidden;
          border:1px solid var(--line);
          background:#f8fbfc;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:14px;
        }

        .home-podcast-embed iframe {
          width:100%;
          height:232px;
          border:0;
          border-radius:16px;
        }

        .home-podcast-copy h2 {
          font-size:clamp(2rem, 4vw, 3rem);
          line-height:1.02;
          letter-spacing:-.04em;
          margin-bottom:14px;
        }

        .home-podcast-copy p {
          color:var(--text-soft);
          font-size:1.02rem;
          margin-bottom:14px;
          max-width:54ch;
        }

        .home-bullet-list {
          display:grid;
          gap:12px;
          margin:22px 0 28px;
        }

        .home-bullet {
          background:var(--bg-soft);
          border:1px solid var(--line);
          border-radius:16px;
          padding:14px 16px;
          color:var(--primary-dark);
          font-weight:600;
          font-size:.96rem;
        }

        .home-team-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:20px;
          margin-top:26px;
        }

        .home-team-card {
          background:#fff;
          border:1px solid var(--line);
          border-radius:26px;
          overflow:hidden;
          box-shadow:var(--shadow);
          min-height:420px;
          display:flex;
          flex-direction:column;
          transition:.2s ease;
        }

        .home-team-card:hover {
          transform:translateY(-3px);
        }

        .home-team-photo {
          aspect-ratio: 4 / 4.3;
          overflow:hidden;
          background:#eef7f9;
        }

        .home-team-photo img {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .home-team-body {
          padding:22px;
          display:flex;
          flex-direction:column;
          gap:10px;
          flex:1;
        }

        .home-team-card h3 {
          font-size:1.08rem;
          line-height:1.1;
        }

        .home-team-role {
          display:block;
          color:var(--primary-dark);
          font-size:.94rem;
          font-weight:700;
        }

        .home-team-card p {
          color:var(--text-soft);
          font-size:.96rem;
        }

        .home-wrapper details {
          margin-top:auto;
          border-top:1px solid rgba(34,52,58,.08);
          padding-top:14px;
        }

        .home-wrapper summary {
          cursor:pointer;
          list-style:none;
          color:var(--primary-dark);
          font-weight:600;
          font-size:.95rem;
        }

        .home-wrapper summary::-webkit-details-marker {
          display:none;
        }

        .home-team-more {
          margin-top:12px;
          display:grid;
          gap:10px;
        }

        .home-team-more p {
          color:var(--text-soft);
          font-size:.95rem;
        }

        .home-testimonials {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;
        }

        .home-quote {
          background:#fff;
          border:1px solid var(--line);
          border-radius:24px;
          padding:24px;
          box-shadow:var(--shadow);
        }

        .home-quote p {
          color:var(--text);
          margin-bottom:10px;
          font-size:1rem;
        }

        .home-quote span {
          color:var(--text-soft);
          font-size:.92rem;
        }

        .home-cta {
          padding:94px 0;
        }

        .home-cta-box {
          background:linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius:34px;
          padding:0;
          color:#fff;
          box-shadow:0 24px 60px rgba(12, 80, 96, 0.18);
          overflow:hidden;
          position:relative;
        }

        .home-cta-grid {
          display:grid;
          grid-template-columns:1.05fr .95fr;
          gap:0;
          align-items:stretch;
        }

        .home-cta-copy {
          padding:46px;
        }

        .home-cta-copy h2 {
          font-size:clamp(2rem, 4vw, 3.6rem);
          line-height:.98;
          letter-spacing:-.04em;
          max-width:10ch;
          margin-bottom:14px;
        }

        .home-cta-copy p {
          color:rgba(255,255,255,.92);
          max-width:56ch;
          font-size:1.04rem;
          margin-bottom:26px;
        }

        .home-cta-actions {
          display:flex;
          flex-wrap:wrap;
          gap:14px;
        }

        .home-cta-box .home-btn-primary {
          background:#fff;
          color:var(--primary-dark);
          box-shadow:none;
        }

        .home-cta-box .home-btn-secondary {
          background:transparent;
          color:#fff;
          border-color:rgba(255,255,255,.34);
        }

        .home-cta-box .home-btn-secondary:hover {
          background:rgba(255,255,255,.1);
        }

        .home-cta-image {
          min-height:100%;
          background:#0a7f9a;
        }

        .home-cta-image img {
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        }

        .home-footer {
          padding:28px 0 40px;
          border-top:1px solid rgba(34,52,58,.06);
          background:#fff;
        }

        .home-footer-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:18px;
          flex-wrap:wrap;
        }

        .home-footer-row p,
        .home-footer-row a {
          color:var(--text-soft);
          font-size:.94rem;
        }

        .home-footer-links {
          display:flex;
          gap:16px;
          flex-wrap:wrap;
        }

        @media (max-width: 1080px){
          .home-hero-grid,
          .home-split,
          .home-podcast-box,
          .home-cta-grid {
            grid-template-columns:1fr;
          }

          .home-band-grid,
          .home-how-grid,
          .home-rfai-grid,
          .home-team-grid,
          .home-testimonials {
            grid-template-columns:1fr 1fr;
          }

          .home-hero-media,
          .home-photo,
          .home-podcast-embed {
            min-height:auto;
          }

          .home-cta-image {
            min-height:360px;
          }
        }

        @media (max-width: 760px){
          .home-nav {
            display:none;
          }

          .home-band-grid,
          .home-how-grid,
          .home-rfai-grid,
          .home-team-grid,
          .home-testimonials {
            grid-template-columns:1fr;
          }

          .home-hero-actions,
          .home-cta-actions,
          .home-header-actions {
            flex-direction:column;
            align-items:stretch;
          }

          .home-btn {
            width:100%;
          }

          .home-hero {
            min-height:auto;
            padding-top:110px;
          }

          .home-hero h1 {
            max-width:none;
          }

          .home-brand-copy span {
            display:none;
          }

          .home-cta-copy {
            padding:28px;
          }
        }
        `
         }} />

         <div className="home-topbar">
            <header className="home-container home-header">
               <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }} className="home-brand" aria-label="Centro Clínico Equilibrar">
                  <img src={logoImg} alt="Logo Centro Clínico Equilibrar" />
                  <div className="home-brand-copy">
                     <strong>Centro Clínico Equilibrar</strong>
                     <span>Psicología clínica y modelo RFAI</span>
                  </div>
               </a>

               <nav className="home-nav">
                  <a href="#test" onClick={(e) => handleScrollTo(e, 'test')}>Test</a>
                  <a href="#rfai" onClick={(e) => handleScrollTo(e, 'rfai')}>RFAI</a>
                  <a href="#podcast" onClick={(e) => handleScrollTo(e, 'podcast')}>Podcast</a>
                  <a href="#equipo" onClick={(e) => handleScrollTo(e, 'equipo')}>Equipo</a>
                  <a href="#contacto" onClick={(e) => handleScrollTo(e, 'contacto')}>Contacto</a>
               </nav>

               <div className="home-header-actions" style={{ display: 'flex', gap: '10px' }}>
                  <a className="home-btn" style={{ backgroundColor: 'var(--bg-soft)', color: 'var(--primary-dark)', border: '1px solid var(--line)', padding: '0 16px', fontSize: '0.92rem' }} href="https://login.clinicaequilibrar.cl/" target="_blank" rel="noopener noreferrer">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                     Intranet
                  </a>
                  <a className="home-btn home-btn-primary" href="#/test-rfai">Hacer test</a>
               </div>
            </header>
         </div>

         <main id="top">
            <section className="home-hero">
               <div className="home-hero-video">
                  <video
                     autoPlay
                     muted
                     loop
                     playsInline
                     preload="metadata"
                     poster={rfai1Img}
                  >
                     <source src={homeVideo} type="video/mp4" />
                  </video>
               </div>

               <div className="home-hero-overlay"></div>

               <div className="home-hero-content">
                  <div className="home-container">
                     <div className="home-hero-inner">
                        <h1>Comprende tu patrón emocional con mayor claridad</h1>

                        <p>
                           Una primera lectura clínica para entender cómo está funcionando tu mente hoy,
                           identificar la lógica de tu malestar actual y conocer si RFAI puede ayudarte.
                        </p>

                        <div className="home-hero-actions">
                           <a className="home-btn home-btn-primary" href="#/test-rfai">Hacer test</a>
                           <a className="home-btn home-btn-secondary" href="#/rfai">Conocer RFAI</a>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <section className="home-band">
               <div className="home-container home-band-grid">
                  <div className="home-band-item">
                     <strong>Una forma simple de evaluar</strong>
                     <span>Una manera clara de comenzar a comprender lo que estás viviendo.</span>
                  </div>
                  <div className="home-band-item">
                     <strong>Lectura inicial</strong>
                     <span>Una síntesis breve de tu patrón emocional actual.</span>
                  </div>
                  <div className="home-band-item">
                     <strong>Modelo RFAI</strong>
                     <span>Una metodología clínica orientada al cambio profundo.</span>
                  </div>
                  <div className="home-band-item">
                     <strong>Acompañamiento integral</strong>
                     <span>Un enfoque sostenido por un equipo transdisciplinario.</span>
                  </div>
               </div>
            </section>

            <section className="home-section" id="test">
               <div className="home-container">
                  <div className="home-section-head">
                     <h2>Cómo funciona</h2>
                     <p>
                        La experiencia fue pensada para que puedas comenzar con claridad, sin presión y con una orientación inicial realmente útil.
                     </p>
                  </div>

                  <div className="home-how-grid">
                     <article className="home-how-card">
                        <div className="home-step">1</div>
                        <h3>Haz el test</h3>
                        <p>
                           Responde una evaluación breve que observa activación emocional, activación racional, activación fisiológica y regulación.
                        </p>
                     </article>

                     <article className="home-how-card">
                        <div className="home-step">2</div>
                        <h3>Recibe una lectura inicial</h3>
                        <p>
                           Conoce cómo está funcionando tu patrón emocional actual y obtén una primera orientación más clara.
                        </p>
                     </article>

                     <article className="home-how-card">
                        <div className="home-step">3</div>
                        <h3>Descubre si RFAI puede ayudarte</h3>
                        <p>
                           Accede a una propuesta clínica orientada a intervenir patrones automáticos y abrir nuevas formas de respuesta.
                        </p>
                     </article>
                  </div>
               </div>
            </section>

            <section className="home-section" id="rfai">
               <div className="home-container home-split">
                  <div>
                     <div className="home-section-head" style={{ marginBottom: 0 }}>
                        <h2>RFAI es una metodología clínica orientada al cambio profundo</h2>
                        <p>
                           RFAI organiza el proceso terapéutico para intervenir patrones emocionales automáticos,
                           comprender su origen y facilitar nuevas formas de regulación y respuesta.
                        </p>
                     </div>

                     <div className="home-rfai-badge">RFAI = Reprogramación Focalizada de Alto Impacto</div>

                     <div className="home-hero-actions" style={{ marginTop: '22px' }}>
                        <a className="home-btn home-btn-primary" href="#/rfai">
                           Conocer RFAI
                        </a>
                        <a className="home-btn home-btn-secondary" style={{ backgroundColor: '#0f97b9', color: '#fff', border: '1px solid transparent', backdropFilter: 'none' }} href="#/test-rfai">
                           Hacer test
                        </a>
                     </div>

                     <div className="home-rfai-grid">
                        <article className="home-rfai-card">
                           <h3>Diagnóstico</h3>
                           <p>
                              Una lectura inicial que permite observar la lógica general de tu forma de funcionamiento actual.
                           </p>
                        </article>

                        <article className="home-rfai-card">
                           <h3>Reprogramación</h3>
                           <p>
                              Un trabajo terapéutico focalizado sobre respuestas emocionales aprendidas y patrones profundos.
                           </p>
                        </article>

                        <article className="home-rfai-card">
                           <h3>Integración</h3>
                           <p>
                              Un proceso diseñado para consolidar nuevas formas de regulación, comprensión y acción.
                           </p>
                        </article>
                     </div>
                  </div>

                  <div className="home-photo">
                     <img src={rfai1Img} alt="Modelo RFAI" />
                  </div>
               </div>
            </section>

            <section className="home-section" id="podcast">
               <div className="home-container">
                  <div className="home-podcast-box">
                     <div className="home-podcast-embed">
                        <iframe
                           src="https://open.spotify.com/embed/show/5qVcMLQ7yffuS7VA3jA6Sh?utm_source=generator"
                           allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                           loading="lazy"
                           title="Podcast de Claudio Reyes en Spotify">
                        </iframe>
                     </div>

                     <div className="home-podcast-copy">
                        <h2>Escucha el podcast de Claudio Reyes</h2>
                        <p>
                           Un espacio donde se presenta el modelo de trabajo del Centro Clínico Equilibrar
                           y se profundiza en una manera más integral de comprender el malestar, los patrones emocionales y los procesos terapéuticos.
                        </p>

                        <div className="home-bullet-list">
                           <div className="home-bullet">Comprende mejor el enfoque clínico del Centro.</div>
                           <div className="home-bullet">Conoce la lógica del modelo RFAI.</div>
                           <div className="home-bullet">Escucha el podcast sin salir del sitio.</div>
                        </div>

                        <div className="home-hero-actions" style={{ marginTop: 0 }}>
                           <a
                              className="home-btn home-btn-primary"
                              href="https://open.spotify.com/show/5qVcMLQ7yffuS7VA3jA6Sh"
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              Abrir en Spotify
                           </a>

                           <a className="home-btn home-btn-secondary" style={{ backgroundColor: '#0f97b9', color: '#fff', border: '1px solid transparent', backdropFilter: 'none' }} href="#/test-rfai">
                              Hacer test
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <section className="home-section" id="equipo">
               <div className="home-container">
                  <div className="home-section-head">
                     <h2>Un equipo que sostiene el proceso</h2>
                     <p>
                        El trabajo del Centro Clínico Equilibrar se apoya en una mirada transdisciplinaria
                        que integra psicología clínica, neurociencia, trabajo somático y asesoría médica especializada.
                     </p>
                  </div>

                  <div className="home-team-grid">
                     <article className="home-team-card">
                        <div className="home-team-photo">
                           <img src={claudioImg} alt="Claudio Reyes" />
                        </div>
                        <div className="home-team-body">
                           <h3>Claudio Reyes</h3>
                           <span className="home-team-role">Psicólogo · Director Ejecutivo</span>
                           <p>
                              Psicólogo clínico y referente principal del enfoque del Centro. Lidera el desarrollo clínico del modelo RFAI.
                           </p>
                           <details>
                              <summary>Ver trayectoria</summary>
                              <div className="home-team-more">
                                 <p>
                                    Ha desarrollado una trayectoria centrada en el acompañamiento terapéutico profundo y el diseño de modelos de intervención orientados a la transformación emocional.
                                 </p>
                                 <p>
                                    Su trabajo busca ir más allá del síntoma inmediato, ayudando a comprender la lógica interna de los patrones que organizan la experiencia emocional.
                                 </p>
                              </div>
                           </details>
                        </div>
                     </article>

                     <article className="home-team-card">
                        <div className="home-team-photo">
                           <img src={carlosImg} alt="Carlos Carrasco" />
                        </div>
                        <div className="home-team-body">
                           <h3>Carlos Carrasco</h3>
                           <span className="home-team-role">Neurocientífico · Director de Investigación</span>
                           <p>
                              Aporta una mirada científica al modelo terapéutico y al desarrollo conceptual del trabajo clínico.
                           </p>
                           <details>
                              <summary>Ver trayectoria</summary>
                              <div className="home-team-more">
                                 <p>
                                    Participa en el fortalecimiento del enfoque desde la neurociencia, contribuyendo a una comprensión más rigurosa de los procesos de aprendizaje, adaptación y regulación emocional.
                                 </p>
                              </div>
                           </details>
                        </div>
                     </article>

                     <article className="home-team-card">
                        <div className="home-team-photo">
                           <img src={valentinImg} alt="Valentín Keller" />
                        </div>
                        <div className="home-team-body">
                           <h3>Valentín Keller</h3>
                           <span className="home-team-role">Terapeuta oriental · Director del área somática</span>
                           <p>
                              Integra la dimensión corporal al trabajo clínico, aportando una mirada centrada en regulación, movimiento y presencia.
                           </p>
                           <details>
                              <summary>Ver trayectoria</summary>
                              <div className="home-team-more">
                                 <p>
                                    Su enfoque incorpora herramientas de conciencia somática y autorregulación corporal, permitiendo integrar la dimensión física al proceso terapéutico.
                                 </p>
                              </div>
                           </details>
                        </div>
                     </article>

                     <article className="home-team-card">
                        <div className="home-team-photo">
                           <img src={alanImg} alt="Alan Lama" />
                        </div>
                        <div className="home-team-body">
                           <h3>Alan Lama</h3>
                           <span className="home-team-role">Psiquiatra · Asesor en medicina y psiquiatría</span>
                           <p>
                              Apoya el modelo clínico con una mirada médica especializada sobre salud mental y evaluación.
                           </p>
                           <details>
                              <summary>Ver trayectoria</summary>
                              <div className="home-team-more">
                                 <p>
                                    Su rol permite fortalecer la comprensión integral de los procesos de salud mental, aportando criterios clínicos y evaluación psiquiátrica cuando es necesario.
                                 </p>
                              </div>
                           </details>
                        </div>
                     </article>
                  </div>
               </div>
            </section>

            <section className="home-section">
               <div className="home-container">
                  <div className="home-section-head">
                     <h2>Cuando una persona entiende su patrón, algo empieza a ordenarse</h2>
                     <p>
                        A veces el alivio comienza cuando deja de pelear solo con los síntomas y logra ver la lógica interna de lo que le pasa.
                     </p>
                  </div>

                  <div className="home-testimonials">
                     <article className="home-quote">
                        <p>“Por primera vez sentí que alguien entendía cómo funciono por dentro.”</p>
                        <span>Paciente • Test RFAI</span>
                     </article>

                     <article className="home-quote">
                        <p>“No era solo ansiedad. Había una forma completa de reaccionar que yo no lograba ver.”</p>
                        <span>Paciente • Proceso clínico</span>
                     </article>

                     <article className="home-quote">
                        <p>“Ponerle nombre al patrón cambió completamente mi punto de partida.”</p>
                        <span>Paciente • Resultado por perfil</span>
                     </article>
                  </div>
               </div>
            </section>

            <section className="home-cta" id="contacto">
               <div className="home-container">
                  <div className="home-cta-box">
                     <div className="home-cta-grid">
                        <div className="home-cta-copy">
                           <h2>Haz el test y descubre tu patrón emocional</h2>
                           <p>
                              Un primer paso para comprender con mayor claridad lo que está ocurriendo en tu vida emocional y abrir un camino más orientado de transformación.
                           </p>

                           <div className="home-cta-actions">
                              <a className="home-btn home-btn-primary" href="#/test-rfai">Hacer test</a>
                              <a
                                 className="home-btn home-btn-secondary"
                                 href="https://wa.me/56930179724?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Test%20RFAI%20y%20el%20modelo%20de%20trabajo%20de%20Equilibrar."
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 Hablar por WhatsApp
                              </a>
                           </div>
                        </div>

                        <div className="home-cta-image">
                           <img src={rfai2Img} alt="Invitación a realizar el Test RFAI" />
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </main>

         <footer className="home-footer">
            <div className="home-container home-footer-row">
               <p>© 2026 Centro Clínico Equilibrar</p>
               <div className="home-footer-links">
                  <a href="#test" onClick={(e) => handleScrollTo(e, 'test')}>Test</a>
                  <a href="#rfai" onClick={(e) => handleScrollTo(e, 'rfai')}>RFAI</a>
                  <a href="#podcast" onClick={(e) => handleScrollTo(e, 'podcast')}>Podcast</a>
                  <a href="#equipo" onClick={(e) => handleScrollTo(e, 'equipo')}>Equipo</a>
                  <a href="#contacto" onClick={(e) => handleScrollTo(e, 'contacto')}>Contacto</a>
               </div>
            </div>
         </footer>
      </div>
   );
};

export default Home;
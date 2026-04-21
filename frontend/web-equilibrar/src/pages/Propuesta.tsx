import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Propuesta: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="propuesta-container">
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

                .propuesta-container {
                    --bg: #f6f8f7;
                    --soft: #eef3f1;
                    --soft2: #f1f5f4;
                    --surface: #ffffff;
                    --text: #17322d;
                    --muted: #5f736d;
                    --line: rgba(23,50,45,.10);
                    --brand: #244740;
                    --brand2: #4f7f72;
                    --shadow: 0 18px 42px rgba(23,50,45,.08);
                    --radius-xl: 34px;
                    --radius-lg: 24px;
                    --radius-md: 18px;
                    --max: 1240px;
                    
                    font-family: 'Montserrat', sans-serif;
                    background: var(--bg);
                    color: var(--text);
                    -webkit-font-smoothing: antialiased;
                    line-height: 1.5;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                
                .propuesta-container * { box-sizing: border-box; }
                .propuesta-container a { text-decoration: none; color: inherit; }
                .propuesta-container img { max-width: 100%; display: block; }
                
                /* Layout */
                .propuesta-container .p-container { width: min(calc(100% - 32px), var(--max)); margin: 0 auto; }
                .propuesta-container .p-section { padding: 76px 0; }
                .propuesta-container .p-soft { background: var(--soft); }
                .propuesta-container .p-soft2 { background: var(--soft2); }
                
                /* Header */
                .propuesta-container header {
                    position: sticky; top: 0; z-index: 40;
                    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
                    background: rgba(246,248,247,.82);
                    border-bottom: 1px solid rgba(23,50,45,.06);
                }
                .propuesta-container .p-nav {
                    min-height: 74px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
                }
                .propuesta-container .p-brand { display: flex; align-items: center; gap: 12px; }
                .propuesta-container .p-brand img { width: 44px; height: 44px; object-fit: contain; border-radius: 12px; }
                .propuesta-container .p-brand-copy { display: flex; flex-direction: column; gap: 2px; }
                .propuesta-container .p-brand-copy strong { font-size: 16px; letter-spacing: -.02em; font-family: 'Montserrat', sans-serif; margin: 0; line-height: 1.2; }
                .propuesta-container .p-brand-copy span { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
                .propuesta-container .p-nav-cta { display: flex; gap: 10px; align-items: center; }
                
                /* Buttons & Tags */
                .propuesta-container .p-btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    min-height: 50px; padding: 0 20px; border-radius: 999px;
                    font-size: 14px; font-weight: 700; border: 1px solid transparent; transition: .22s ease;
                    font-family: inherit; cursor: pointer; text-align: center;
                }
                .propuesta-container .p-btn:hover { transform: translateY(-1px); }
                .propuesta-container .p-btn-primary { background: var(--text); color: #fff; box-shadow: 0 14px 28px rgba(23,50,45,.14); }
                .propuesta-container .p-btn-primary:visited { color: #fff; }
                .propuesta-container .p-btn-secondary { background: #fff; color: var(--text); border-color: var(--line); }
                .propuesta-container .p-btn-secondary:visited { color: var(--text); }
                
                .propuesta-container .p-tag, 
                .propuesta-container .p-eyebrow {
                    display: inline-flex; width: fit-content; padding: 8px 12px; border-radius: 999px;
                    background: rgba(36,71,64,.08); color: var(--brand);
                    font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
                }
                
                /* Hero */
                .propuesta-container .p-hero { padding: 18px 0 14px; }
                .propuesta-container .p-hero-card {
                    position: relative; overflow: hidden; border-radius: 34px; min-height: 76vh;
                    box-shadow: var(--shadow); border: 1px solid var(--line);
                    background: linear-gradient(95deg, rgba(11,25,23,.82) 0%, rgba(11,25,23,.60) 36%, rgba(11,25,23,.20) 70%),
                                url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5691.jpg') center center / cover no-repeat;
                    display: flex; align-items: flex-end;
                }
                .propuesta-container .p-hero-inner {
                    position: relative; z-index: 1; padding: 34px; display: grid; gap: 18px;
                    width: min(100%, 760px); color: #fff;
                }
                .propuesta-container .p-hero-inner h1 {
                    margin: 0; font-size: clamp(42px,6vw,86px); line-height: .92; letter-spacing: -.07em;
                    max-width: 9.5ch; text-wrap: balance; font-weight: 800; font-family: inherit; color: #fff;
                }
                .propuesta-container .p-hero-inner p {
                    margin: 0; color: rgba(255,255,255,.85); font-size: 16px; max-width: 58ch; font-family: inherit; line-height: 1.5;
                }
                .propuesta-container .p-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
                .propuesta-container .p-hero-actions .p-btn-secondary {
                    background: rgba(255,255,255,.10); color: #fff; border-color: rgba(255,255,255,.18);
                }
                .propuesta-container .p-hero-actions .p-btn-secondary:visited { color: #fff; }
                
                .propuesta-container .p-hero-pills {
                    display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; max-width: 760px;
                }
                .propuesta-container .p-hero-pill {
                    padding: 14px; border-radius: 18px; background: rgba(255,255,255,.10);
                    border: 1px solid rgba(255,255,255,.16); backdrop-filter: blur(8px);
                    color: #fff; font-size: 13px; font-weight: 700; min-height: 72px; display: flex; align-items: center; justify-content: center; text-align: center;
                }
                
                /* Typography & Grid */
                .propuesta-container .p-section-head { display: grid; gap: 12px; margin-bottom: 28px; }
                .propuesta-container .p-section-head h2 {
                    margin: 0; font-size: clamp(34px,4.8vw,66px); line-height: .96; letter-spacing: -.06em;
                    text-wrap: balance; font-family: inherit; font-weight: 700; color: inherit;
                }
                .propuesta-container .p-section-head p { margin: 0; color: var(--muted); max-width: 760px; font-size: 16px; }
                
                .propuesta-container .p-grid-2, 
                .propuesta-container .p-grid-3, 
                .propuesta-container .p-feature-grid, 
                .propuesta-container .p-gallery-grid { display: grid; gap: 20px; }
                
                /* Cards */
                .propuesta-container .p-card {
                    background: var(--surface); border: 1px solid var(--line);
                    border-radius: var(--radius-lg); box-shadow: var(--shadow);
                }
                .propuesta-container .p-card-body { padding: 24px; display: grid; gap: 14px; }
                .propuesta-container .p-card h3 { margin: 0; font-size: 28px; line-height: 1.02; letter-spacing: -.04em; font-family: inherit; font-weight: 700; color: inherit; }
                .propuesta-container .p-card p { margin: 0; color: var(--muted); font-size: 16px; line-height: 1.5; }
                
                .propuesta-container .p-mini-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
                .propuesta-container .p-mini-list li { display: flex; gap: 10px; color: var(--text); font-size: 14px; font-weight: 600; align-items: flex-start; }
                .propuesta-container .p-mini-list li::before { content: '•'; color: var(--brand2); font-size: 18px; line-height: 1; }
                
                /* Features */
                .propuesta-container .p-feature-card { display: grid; gap: 0; overflow: hidden; border-radius: 30px; }
                .propuesta-container .p-feature-media { min-height: 300px; background-size: cover; background-position: center; }
                .propuesta-container .p-feature-copy { padding: 28px; display: grid; gap: 14px; background: #fff; }
                
                .propuesta-container .p-statement {
                    padding: 30px; border-radius: 30px;
                    background: linear-gradient(135deg, #17322d 0%, #244740 42%, #426b61 100%);
                    color: #fff; display: grid; gap: 14px;
                }
                .propuesta-container .p-statement h2 { margin: 0; font-size: clamp(34px,4.8vw,60px); line-height: .96; letter-spacing: -.06em; font-family: inherit; font-weight: 700; color: #fff;}
                .propuesta-container .p-statement p, 
                .propuesta-container .p-statement li { color: rgba(255,255,255,.86); font-family: inherit; }
                .propuesta-container .p-statement .p-tag { background: rgba(255,255,255,.10); color: #fff; }
                
                /* Gallery */
                .propuesta-container .p-gallery-grid .p-image-panel {
                    overflow: hidden; border-radius: 28px; border: 1px solid var(--line); box-shadow: var(--shadow); background: #fff;
                }
                .propuesta-container .p-image-panel .p-media { aspect-ratio: 16/11; background-size: cover; background-position: center; }
                .propuesta-container .p-image-panel .p-copy { padding: 18px 18px 20px; display: grid; gap: 10px; }
                .propuesta-container .p-image-panel h3 { margin: 0; font-size: 22px; letter-spacing: -.03em; font-family: inherit; font-weight: 700; color: inherit;}
                .propuesta-container .p-image-panel p { margin: 0; color: var(--muted); }
                
                /* Wide CTA */
                .propuesta-container .p-wide-cta {
                    display: grid; gap: 18px; align-items: center; padding: 30px; border-radius: 30px;
                    background: linear-gradient(135deg, #17322d 0%, #244740 42%, #426b61 100%);
                    color: #fff; border: 0;
                }
                .propuesta-container .p-wide-cta h2 { margin: 0; max-width: 11ch; font-size: clamp(34px,4.8vw,64px); line-height: .96; letter-spacing: -.06em; font-family: inherit; font-weight: 700; color: #fff; }
                .propuesta-container .p-wide-cta p { color: rgba(255,255,255,.86); }
                .propuesta-container .p-wide-cta .p-btn-secondary { background: rgba(255,255,255,.10); color: #fff; border-color: rgba(255,255,255,.16); }
                .propuesta-container .p-wide-cta .p-btn-secondary:visited { color: #fff; }
                
                /* Footer */
                .propuesta-container footer { padding: 24px 0 38px; color: var(--muted); font-size: 13px; text-align: center; margin-top: auto; }
                
                @media (min-width: 760px) {
                    .propuesta-container .p-grid-2 { grid-template-columns: 1fr 1fr; }
                    .propuesta-container .p-grid-3 { grid-template-columns: repeat(3, 1fr); }
                    .propuesta-container .p-feature-grid { grid-template-columns: 1.06fr .94fr; }
                    .propuesta-container .p-gallery-grid { grid-template-columns: 1fr 1fr; }
                    .propuesta-container .p-wide-cta { grid-template-columns: 1.05fr .95fr; }
                }
                @media (max-width: 759px) {
                    .propuesta-container .p-hero-card { min-height: 72vh; }
                    .propuesta-container .p-hero-inner { padding: 28px 20px; }
                    .propuesta-container .p-hero-pills { grid-template-columns: 1fr; }
                    .propuesta-container .p-nav-cta { display: none; }
                    .propuesta-container .p-brand-copy span { display: none; }
                }
            `}} />

            <header>
                <div className="p-container p-nav">
                    <Link to="/" className="p-brand">
                        <img src="https://www.origamis.cl/wp-content/uploads/2026/03/logo-clinica-equilibrar.png" alt="Logo Clínica Equilibrar" />
                        <span className="p-brand-copy">
                            <strong>Clínica Equilibrar</strong>
                            <span>Modelo clínico</span>
                        </span>
                    </Link>
                    <div className="p-nav-cta">
                        <Link className="p-btn p-btn-secondary" to="/">Volver al home</Link>
                        <Link className="p-btn p-btn-primary" to="/test-rfai">Agendar evaluación ejecutiva</Link>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                <section className="p-hero">
                    <div className="p-container">
                        <div className="p-hero-card">
                            <div className="p-hero-inner">
                                <span className="p-eyebrow">Modelo clínico</span>
                                <h1>Trabajo en equipo para problemas complejos</h1>
                                <p>Clínica Equilibrar no trabaja desde una lógica de servicios aislados. El modelo clínico integra evaluación, decisión terapéutica e intervención en función del funcionamiento actual de cada persona.</p>
                                <div className="p-hero-actions">
                                    <Link className="p-btn p-btn-primary" to="/test-rfai">Agendar evaluación ejecutiva</Link>
                                    <a className="p-btn p-btn-secondary" href="#sistema">Ver sistema clínico</a>
                                </div>
                                <div className="p-hero-pills">
                                    <div className="p-hero-pill">La evaluación ordena el caso antes de intervenir</div>
                                    <div className="p-hero-pill">Las decisiones terapéuticas se toman según necesidad real</div>
                                    <div className="p-hero-pill">Las especialidades se articulan dentro de una misma lógica clínica</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="p-section">
                    <div className="p-container p-feature-grid">
                        <article className="p-feature-card p-card">
                            <div className="p-feature-media" style={{backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/1-1.png')", backgroundPosition: "center"}}></div>
                            <div className="p-feature-copy">
                                <span className="p-tag">Principio central</span>
                                <h3>El síntoma no agota el problema</h3>
                                <p>Los síntomas son la expresión visible de un funcionamiento más amplio. Intervenir solo la superficie puede aliviar, pero no necesariamente modificar lo que organiza el malestar en profundidad.</p>
                            </div>
                        </article>

                        <article className="p-statement">
                            <span className="p-tag">Criterio clínico</span>
                            <h2>Intervenir el funcionamiento, no solo el signo visible</h2>
                            <p>El foco está en comprender cómo está operando hoy la persona: qué se repite, qué está desregulado y qué necesita ser intervenido.</p>
                            <ul className="p-mini-list">
                                <li>Lectura clínica del funcionamiento actual</li>
                                <li>Definición de la estrategia más pertinente</li>
                                <li>Uso articulado de recursos clínicos y complementarios</li>
                            </ul>
                        </article>
                    </div>
                </section>

                <section id="sistema" className="p-section p-soft">
                    <div className="p-container">
                        <div className="p-section-head">
                            <span className="p-eyebrow">Sistema clínico</span>
                            <h2>Evaluar, indicar e intervenir</h2>
                            <p>El trabajo clínico se organiza en tres momentos que no funcionan como piezas separadas, sino como parte de una misma arquitectura terapéutica.</p>
                        </div>

                        <div className="p-grid-3">
                            <article className="p-card">
                                <div className="p-card-body">
                                    <span className="p-tag">01</span>
                                    <h3>Evaluación</h3>
                                    <p>Lectura clínica del funcionamiento actual. Permite ordenar el caso y comprender qué está ocurriendo realmente.</p>
                                    <ul className="p-mini-list">
                                        <li>Ordena la complejidad</li>
                                        <li>Define hipótesis inicial</li>
                                        <li>Evita decisiones apresuradas</li>
                                    </ul>
                                </div>
                            </article>

                            <article className="p-card">
                                <div className="p-card-body">
                                    <span className="p-tag">02</span>
                                    <h3>Decisión terapéutica</h3>
                                    <p>Definición de la intervención más pertinente. No todas las personas necesitan lo mismo ni en el mismo momento.</p>
                                    <ul className="p-mini-list">
                                        <li>Prioriza lo necesario</li>
                                        <li>Articula especialidades</li>
                                        <li>Ordena el primer paso</li>
                                    </ul>
                                </div>
                            </article>

                            <article className="p-card">
                                <div className="p-card-body">
                                    <span className="p-tag">03</span>
                                    <h3>Intervención</h3>
                                    <p>Aplicación de recursos clínicos según necesidad: psicológico, corporal o psiquiátrico.</p>
                                    <ul className="p-mini-list">
                                        <li>Más precisión</li>
                                        <li>Menos fragmentación</li>
                                        <li>Mayor coherencia terapéutica</li>
                                    </ul>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="p-section">
                    <div className="p-container p-gallery-grid">
                        <article className="p-image-panel">
                            <div className="p-media" style={{backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/2-1.png')", backgroundPosition: "center top"}}></div>
                            <div className="p-copy">
                                <span className="p-tag">Integración</span>
                                <h3>No es una suma de servicios</h3>
                                <p>Las especialidades no funcionan de forma independiente. Se articulan en función del caso, permitiendo intervenir desde distintas dimensiones cuando es necesario.</p>
                            </div>
                        </article>

                        <article className="p-image-panel">
                            <div className="p-media" style={{backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/3-1.png')", backgroundPosition: "center"}}></div>
                            <div className="p-copy">
                                <span className="p-tag">Transdisciplina</span>
                                <h3>Una mirada más amplia del problema</h3>
                                <p>Psicología clínica, psiquiatría y trabajo corporal se integran para abordar problemas complejos desde múltiples niveles de comprensión e intervención.</p>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="p-section p-soft2">
                    <div className="p-container">
                        <div className="p-section-head">
                            <span className="p-eyebrow">Lógica de intervención</span>
                            <h2>Una clínica que decide con criterio antes de actuar</h2>
                            <p>El modelo clínico no busca impresionar por cantidad de recursos, sino por la capacidad de definir qué necesita hoy cada persona y cuál es la forma más pertinente de abordarlo.</p>
                        </div>

                        <div className="p-grid-2">
                            <article className="p-card">
                                <div className="p-card-body">
                                    <span className="p-tag">Precisión</span>
                                    <h3>Menos dispersión, más dirección</h3>
                                    <p>La evaluación reduce ensayo y error. Permite partir desde una definición clínica más clara y no desde intuiciones parciales.</p>
                                </div>
                            </article>

                            <article className="p-card">
                                <div className="p-card-body">
                                    <span className="p-tag">Coherencia</span>
                                    <h3>Una misma lógica clínica sostiene todo el proceso</h3>
                                    <p>Desde la evaluación hasta la intervención, las decisiones se ordenan dentro de un mismo marco. Esa continuidad aumenta claridad, contención y efectividad.</p>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="p-section">
                    <div className="p-container">
                        <article className="p-wide-cta">
                            <div>
                                <span className="p-eyebrow" style={{background: 'rgba(255,255,255,.10)', color: '#fff'}}>Siguiente paso</span>
                                <h2>Define con claridad qué necesitas hoy</h2>
                                <p>El modelo clínico comienza con una evaluación. A partir de ahí se define la intervención más adecuada para el caso.</p>
                            </div>
                            <div className="p-hero-actions" style={{justifyContent: 'flex-start'}}>
                                <Link className="p-btn p-btn-primary" to="/test-rfai">Agendar evaluación ejecutiva</Link>
                                <Link className="p-btn p-btn-secondary" to="/">Volver al inicio</Link>
                            </div>
                        </article>
                    </div>
                </section>
            </main>

            <footer>
                <div className="p-container">
                    Clínica Equilibrar — Modelo clínico
                </div>
            </footer>
        </div>
    );
};

export default Propuesta;

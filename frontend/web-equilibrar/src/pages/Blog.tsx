import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .bl-page-wrap {
                    font-family: 'Montserrat', sans-serif;
                    background: #f6f8f7; color: #17322d; min-height: 100vh;
                    padding-bottom: 60px;
                }
                .bl-container { width: min(1100px, 92%); margin: auto; }
                .bl-section { padding: 70px 0; }
                
                .bl-hero { padding: 100px 0 40px; }
                .bl-hero h1 { font-size: clamp(42px, 5vw, 80px); line-height: 0.95; letter-spacing: -0.06em; margin: 0; }
                .bl-hero p { color: #5f736d; font-size: 16px; margin: 16px 0 0 0; max-width: 600px;}
                
                .bl-grid { display: grid; gap: 30px; }
                .bl-posts { display: grid; grid-template-columns: repeat(1, 1fr); gap: 20px; }
                
                @media(min-width: 768px) { .bl-posts { grid-template-columns: repeat(2, 1fr); } }
                
                .bl-post {
                    background: #fff; border: 1px solid rgba(23, 50, 45, 0.10);
                    border-radius: 24px; overflow: hidden; display: grid;
                }
                .bl-post-img { height: 220px; background-size: cover; background-position: center; }
                .bl-post-body { padding: 24px; }
                .bl-post-body h2 { font-size: clamp(24px, 3vw, 32px); line-height: 1.05; margin: 8px 0; }
                .bl-post-body p { color: #5f736d; font-size: 16px; }
                
                .bl-tag { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #244740; }
                
                .bl-btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    padding: 12px 18px; border-radius: 999px; border: 1px solid rgba(23, 50, 45, 0.10);
                    font-weight: 700; background: #fff; color: #17322d; text-decoration: none; transition: 0.2s;
                }
                .bl-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .bl-btn-primary { background: #17322d; color: #fff !important; border: none; }
                .bl-btn-primary:hover { background: #0a1c1a; }
                
                .bl-cta { background: linear-gradient(135deg, #17322d, #426b61); color: #fff; border-radius: 28px; padding: 40px; }
                .bl-cta h2 { font-size: clamp(28px, 3.5vw, 46px); line-height: 1.05; margin: 0; }
                .bl-cta p { color: rgba(255, 255, 255, 0.85); font-size: 16px; }
            `}} />

            <div className="bl-page-wrap">
                {/* HERO */}
                <section className="bl-hero">
                    <div className="bl-container bl-grid">
                        <div>
                            <span className="bl-tag">Pensamiento clínico</span>
                            <h1>Una clínica que piensa su práctica</h1>
                            <p>
                                Este espacio desarrolla ideas, hipótesis y marcos que permiten comprender mejor 
                                el funcionamiento humano y los procesos de cambio.
                            </p>
                        </div>
                    </div>
                </section>

                {/* POSTS */}
                <section className="bl-section pt-0">
                    <div className="bl-container">
                        <div className="bl-posts">
                            <article className="bl-post">
                                <div className="bl-post-img" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/10.png')" }}></div>
                                <div className="bl-post-body">
                                    <span className="bl-tag">Claudio Reyes</span>
                                    <h2>Cuando el problema no es lo que sientes</h2>
                                    <p>
                                        Muchas veces intentamos cambiar emociones sin comprender qué las está generando. 
                                        El problema no es sentir, es cómo está organizado el sistema que produce eso.
                                    </p>
                                    <div style={{ marginTop: '14px' }}>
                                        <Link className="bl-btn bl-btn-primary" to="/blog/problema-no-es-sientas">Leer artículo</Link>
                                    </div>
                                </div>
                            </article>

                            <article className="bl-post">
                                <div className="bl-post-img" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/valentin-taichi.png')" }}></div>
                                <div className="bl-post-body">
                                    <span className="bl-tag">Valentín Keller</span>
                                    <h2>El cuerpo vuelve a vivir las cosas como reales</h2>
                                    <p>
                                        Hay vivencias que no se guardan únicamente como recuerdos, sino como patrones corporales. Cuando el cuerpo no baja la alerta, no basta con entender.
                                    </p>
                                    <div style={{ marginTop: '14px' }}>
                                        <Link className="bl-btn bl-btn-primary" to="/blog/el-cuerpo-vuelve">Leer artículo</Link>
                                    </div>
                                </div>
                            </article>

                            <article className="bl-post">
                                <div className="bl-post-img" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/mujer-5.png')" }}></div>
                                <div className="bl-post-body">
                                    <span className="bl-tag">Daniela Baeza</span>
                                    <h2>Cuando siempre te pasa lo mismo</h2>
                                    <p>
                                        Los patrones que se repiten no son casualidad. 
                                        Entender su lógica permite intervenir en un nivel relacional más profundo.
                                    </p>
                                    <div style={{ marginTop: '14px' }}>
                                        <Link className="bl-btn bl-btn-primary" to="/blog/siempre-pasa-lo-mismo">Leer artículo</Link>
                                    </div>
                                </div>
                            </article>

                            <article className="bl-post">
                                <div className="bl-post-img" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5656.jpg')" }}></div>
                                <div className="bl-post-body">
                                    <span className="bl-tag">Carlos Carrasco</span>
                                    <h2>Antes de pensar, ya estás decidiendo</h2>
                                    <p>
                                        El sistema neurológico y corporal están respondiendo mucho antes de que la consciencia logre una interpretación.
                                    </p>
                                    <div style={{ marginTop: '14px' }}>
                                        <Link className="bl-btn bl-btn-primary" to="/blog/antes-de-pensar">Leer artículo</Link>
                                    </div>
                                </div>
                            </article>

                            <article className="bl-post">
                                <div className="bl-post-img" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/10.png')" }}></div>
                                <div className="bl-post-body">
                                    <span className="bl-tag">Alan Lama</span>
                                    <h2>Cuando sostener deja de ser suficiente</h2>
                                    <p>
                                        Hay momentos en que el sistema pierde su capacidad de autorregulación. Ahí, la psiquiatría ofrece una herramienta táctica.
                                    </p>
                                    <div style={{ marginTop: '14px' }}>
                                        <Link className="bl-btn bl-btn-primary" to="/blog/sostener-insuficiente">Leer artículo</Link>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bl-section">
                    <div className="bl-container">
                        <div className="bl-cta">
                            <h2>Define con claridad qué necesitas hoy</h2>
                            <p>
                                El contenido permite comprender, pero el cambio comienza cuando se define 
                                una intervención adecuada para el caso.
                            </p>
                            <div style={{ marginTop: '20px' }}>
                                <Link className="bl-btn bl-btn-primary" style={{ background: '#ffffff', color: '#17322d' }} to="/#evaluacion">Agendar evaluación ejecutiva</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Blog;

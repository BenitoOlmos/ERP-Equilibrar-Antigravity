import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface BlogArticleProps {
    tag: string;
    title: string;
    subtitle: string;
    author: string;
    authorRole: string;
    date: string;
    heroImage: string;
    authorImage: string;
    content: React.ReactNode;
    quote: string;
}

const BlogArticleLayout: React.FC<BlogArticleProps> = ({
    tag, title, subtitle, author, authorRole, date, heroImage, authorImage, content, quote
}) => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-article-wrapper">
            <style dangerouslySetInnerHTML={{__html: `
                .blog-article-wrapper {
                    font-family: 'Montserrat', sans-serif;
                    background: #f6f8f7;
                    color: #17322d;
                    -webkit-font-smoothing: antialiased;
                    line-height: 1.6;
                    padding-bottom: 20px;
                }
                .blog-article-wrapper a { text-decoration: none; color: inherit; }
                .blog-article-wrapper img { max-width: 100%; display: block; }
                .ba-container { width: min(calc(100% - 32px), 1240px); margin: 0 auto; }
                .ba-article-container { width: min(calc(100% - 32px), 860px); margin: 0 auto; }
                .ba-section { padding: 64px 0; }
                .ba-soft { background: #eef3f1; }
                
                .ba-btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    min-height: 50px; padding: 0 20px; border-radius: 999px;
                    font-size: 14px; font-weight: 700; border: 1px solid transparent; transition: .22s ease;
                }
                .ba-btn:hover { transform: translateY(-1px); }
                .ba-btn-primary { background: #17322d; color: #fff; box-shadow: 0 14px 28px rgba(23,50,45,.14); }
                .ba-btn-secondary { background: #fff; color: #17322d; border-color: rgba(23,50,45,.10); }
                
                .ba-eyebrow, .ba-tag {
                    display: inline-flex; width: fit-content; padding: 8px 12px; border-radius: 999px;
                    background: rgba(36,71,64,.08); color: #244740;
                    font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
                }
                
                .ba-hero { padding: 18px 0 16px; }
                .ba-hero-card {
                    position: relative; overflow: hidden; border-radius: 34px; min-height: 68svh;
                    box-shadow: 0 18px 42px rgba(23,50,45,.08); border: 1px solid rgba(23,50,45,.10);
                    background: linear-gradient(95deg, rgba(11,25,23,.82) 0%, rgba(11,25,23,.56) 34%, rgba(11,25,23,.20) 70%),
                                url('${heroImage}') center center / cover no-repeat;
                    display: flex; align-items: flex-end;
                }
                .ba-hero-inner {
                    position: relative; z-index: 1; padding: 34px; display: grid; gap: 18px;
                    width: min(100%, 820px); color: #fff;
                }
                .ba-hero-inner h1 {
                    margin: 0; font-size: clamp(38px, 5.2vw, 78px); line-height: .93; letter-spacing: -.065em;
                    max-width: 10ch; text-wrap: balance;
                }
                .ba-hero-inner p {
                    margin: 0; color: rgba(255,255,255,.86); font-size: 17px; max-width: 58ch;
                }
                
                .ba-meta {
                    display: flex; flex-wrap: wrap; gap: 10px 12px;
                    color: rgba(255,255,255,.82); font-size: 13px; font-weight: 600;
                }
                .ba-meta span {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 8px 12px; border-radius: 999px;
                    background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.14);
                    backdrop-filter: blur(8px);
                }
                
                .ba-article-layout { display: grid; gap: 28px; }
                .ba-lead-card {
                    background: #ffffff; border: 1px solid rgba(23,50,45,.10);
                    border-radius: 26px; box-shadow: 0 18px 42px rgba(23,50,45,.08); padding: 28px;
                }
                .ba-lead-card p {
                    margin: 0; font-size: 20px; line-height: 1.65; color: #17322d; letter-spacing: -.01em;
                }
                
                .ba-article-body {
                    background: #ffffff; border: 1px solid rgba(23,50,45,.10);
                    border-radius: 26px; box-shadow: 0 18px 42px rgba(23,50,45,.08);
                    padding: 30px; display: grid; gap: 22px;
                }
                .ba-article-body h2 {
                    margin: 8px 0 0; font-size: clamp(28px, 3.2vw, 40px); line-height: 1.02; letter-spacing: -.04em;
                }
                .ba-article-body p { margin: 0; color: #5f736d; font-size: 17px; line-height: 1.8; }
                .ba-article-body strong { color: #17322d; }
                
                .ba-article-quote {
                    padding: 24px; border-left: 4px solid #244740;
                    background: linear-gradient(180deg, #f7fbf9 0%, #edf4f1 100%);
                    border-radius: 0 18px 18px 0; color: #17322d;
                    font-size: 22px; line-height: 1.5; letter-spacing: -.02em; font-style: italic;
                }
                
                .ba-author-card {
                    display: grid; gap: 18px; background: #ffffff;
                    border: 1px solid rgba(23,50,45,.10); border-radius: 26px;
                    box-shadow: 0 18px 42px rgba(23,50,45,.08); padding: 24px;
                }
                .ba-author-top { display: grid; grid-template-columns: 84px 1fr; gap: 18px; align-items: center; }
                .ba-author-photo {
                    width: 84px; height: 84px; border-radius: 22px;
                    background: url('${authorImage}') center top / cover no-repeat;
                }
                .ba-author-info h3 { margin: 0 0 4px; font-size: 24px; letter-spacing: -.03em; }
                .ba-author-info p { margin: 0; color: #5f736d; font-size: 14px; }
                
                .ba-cta-card {
                    display: grid; gap: 18px; align-items: center;
                    background: linear-gradient(135deg, #17322d 0%, #244740 42%, #426b61 100%);
                    color: #fff; border-radius: 30px; padding: 30px;
                    box-shadow: 0 18px 42px rgba(23,50,45,.08);
                }
                .ba-cta-card p { margin: 0; color: rgba(255,255,255,.86); }
                .ba-cta-actions { display: flex; flex-wrap: wrap; gap: 12px; }
                .ba-cta-card .ba-btn-secondary { background: rgba(255,255,255,.10); color: #fff; border-color: rgba(255,255,255,.16); }
                
                .ba-related-grid { display: grid; gap: 20px; }
                .ba-related-card {
                    background: #ffffff; border: 1px solid rgba(23,50,45,.10);
                    border-radius: 24px; box-shadow: 0 18px 42px rgba(23,50,45,.08);
                    overflow: hidden; display: grid; text-decoration: none; color: inherit; transition: transform 0.3s;
                }
                .ba-related-card:hover { transform: translateY(-4px); }
                .ba-related-media { aspect-ratio: 16/10; background-size: cover; background-position: center; }
                .ba-related-copy { padding: 20px; display: grid; gap: 12px; }
                .ba-related-copy h3 { margin: 0; font-size: 24px; line-height: 1.04; letter-spacing: -.03em; color: #17322d;}
                .ba-related-copy p { margin: 0; color: #5f736d; font-size: 15px; }
                
                @media (min-width: 760px) {
                    .ba-related-grid { grid-template-columns: 1fr 1fr; }
                    .ba-cta-card { grid-template-columns: 1.08fr .92fr; }
                }
                @media (max-width: 759px) {
                    .ba-hero-card { min-height: 58svh; }
                    .ba-hero-inner { padding: 28px 20px; }
                    .ba-lead-card p { font-size: 18px; }
                    .ba-article-body p { font-size: 16px; }
                }
            `}} />

            <main>

                <section className="ba-hero">
                    <div className="ba-container">
                        <div className="ba-hero-card">
                            <div className="ba-hero-inner">
                                <span className="ba-eyebrow">Artículo clínico</span>
                                <h1>{title}</h1>
                                <p>{subtitle}</p>
                                <div className="ba-meta">
                                    <span>Por {author}</span>
                                    <span>{authorRole}</span>
                                    <span>{date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ba-section">
                    <div className="ba-article-container ba-article-layout">
                        {content}

                        <div className="ba-article-quote">
                            "{quote}"
                        </div>

                        <article className="ba-author-card">
                            <div className="ba-author-top">
                                <div className="ba-author-photo"></div>
                                <div className="ba-author-info">
                                    <h3>{author}</h3>
                                    <p>{authorRole}</p>
                                </div>
                            </div>
                            <p>
                                La idea no es que el blog funcione como una biblioteca de textos sueltos, sino como una extensión del pensamiento clínico del centro. Cada artículo debe ampliar comprensión, transmitir criterio y abrir una decisión concreta: seguir leyendo, conocer un profesional o partir por la evaluación ejecutiva.
                            </p>
                        </article>

                        <article className="ba-cta-card">
                            <div>
                                <span className="ba-eyebrow" style={{ background: 'rgba(255,255,255,.10)', color: '#fff' }}>Siguiente paso</span>
                                <h2 style={{ margin: 0, fontSize: 'clamp(32px,4.2vw,60px)', lineHeight: '.96', letterSpacing: '-.06em', maxWidth: '10ch' }}>Leer aporta comprensión. La evaluación ordena el caso.</h2>
                                <p style={{ marginTop: '14px' }}>El contenido puede ayudar a pensar mejor lo que está ocurriendo, pero el primer paso clínico sigue siendo definir con claridad qué necesita hoy cada persona.</p>
                            </div>
                            <div className="ba-cta-actions">
                                <Link className="ba-btn ba-btn-primary" style={{ background: '#fff', color: '#17322d' }} to="/#evaluacion">Agendar evaluación ejecutiva</Link>
                                <Link className="ba-btn ba-btn-secondary" to="/blog">Volver al blog</Link>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="ba-section ba-soft">
                    <div className="ba-container">
                        <div style={{ marginBottom: '40px' }}>
                            <span className="ba-eyebrow">Relacionados</span>
                            <h2 style={{ fontSize: 'clamp(28px,3vw,36px)', margin: '8px 0', letterSpacing: '-.03em' }}>Más publicaciones del centro</h2>
                            <p style={{ color: '#5f736d', fontSize: '17px' }}>Continúa explorando la visión clínica de nuestro equipo de profesionales.</p>
                        </div>

                        <div className="ba-related-grid">
                            <Link to="/blog/el-cuerpo-vuelve" className="ba-related-card">
                                <div className="ba-related-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/04/valentin-taichi.png')" }}></div>
                                <div className="ba-related-copy">
                                    <span className="ba-tag">Valentín Keller</span>
                                    <h3>Cuando el cuerpo no logra bajar la intensidad</h3>
                                    <p>Una nota sobre activación fisiológica, base corporal y regulación desde el cuerpo.</p>
                                </div>
                            </Link>

                            <Link to="/blog/antes-de-pensar" className="ba-related-card">
                                <div className="ba-related-media" style={{ backgroundImage: "url('https://www.origamis.cl/wp-content/uploads/2026/03/RFAI-1.png')" }}></div>
                                <div className="ba-related-copy">
                                    <span className="ba-tag">Carlos Carrasco</span>
                                    <h3>Antes de pensar, ya estás decidiendo</h3>
                                    <p>Una publicación que aborda la neurobiología de las decisiones automáticas.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default BlogArticleLayout;

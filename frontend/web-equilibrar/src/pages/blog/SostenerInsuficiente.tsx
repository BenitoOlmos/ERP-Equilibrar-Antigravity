import React from 'react';
import BlogArticleLayout from './BlogArticleLayout';
import heroImg from '../../assets/images/blog/5-1.png';

const SostenerInsuficiente: React.FC = () => {
    const content = (
        <>
            <article className="ba-lead-card">
                <p>
                    Hay momentos en que las personas sienten que ya han hecho todo lo que estaba a su alcance. Han intentado entender lo que les pasa, han buscado distintas formas de regularse, incluso han logrado ciertos cambios. Pero aun así, algo no cede. El ánimo no se estabiliza, el sueño no se ordena o la ansiedad sigue apareciendo con una intensidad que no logra bajar.
                </p>
            </article>

            <article className="ba-article-body">
                <span className="ba-tag">Desarrollo</span>
                <h2>Cuando el sistema supera su capacidad de regulación</h2>
                <p>
                    En esos casos, lo que aparece no es falta de esfuerzo ni de comprensión. Más bien, se empieza a hacer evidente que el sistema está sosteniendo un nivel de activación que ya no logra regularse solo.
                </p>
                <p>
                    Desde la psiquiatría, ese punto es importante de reconocer. No todo malestar requiere intervención farmacológica, pero hay momentos en que sí es necesario considerar esa posibilidad. No como primera respuesta automática, ni como solución única, sino como una herramienta que puede ayudar a que el sistema recupere cierto nivel de estabilidad desde el cual sea posible trabajar.
                </p>
                
                <h2>El rol de la intervención farmacológica</h2>
                <p>
                    En la práctica, esto se ve en situaciones bastante concretas. Personas que no logran dormir de manera sostenida, que viven en un estado de ansiedad que no baja o que sienten que su energía está permanentemente desregulada. En esos casos, intentar intervenir únicamente desde lo psicológico o lo corporal puede no ser suficiente en ese momento.
                </p>
                <p>
                    La intervención farmacológica, bien indicada, no busca “anular” la experiencia de la persona, sino disminuir la intensidad con la que el sistema está funcionando. Es, en muchos casos, una forma de bajar el nivel de ruido interno para que otras intervenciones puedan tener efecto.
                </p>
                <p>
                    Eso implica también un cuidado importante. No se trata de medicar por síntomas aislados, ni de sostener tratamientos más allá de lo necesario. Parte del trabajo psiquiátrico consiste justamente en evaluar cuándo intervenir, con qué objetivo y por cuánto tiempo.
                </p>
                <p>
                    En un modelo integrado, la psiquiatría no funciona de manera independiente. Se articula con el resto del proceso clínico, entendiendo que lo que está ocurriendo no es solo biológico, ni solo psicológico, ni solo corporal. Es una combinación de distintos niveles que, en ciertos momentos, requieren apoyos distintos.
                </p>
                <p>
                    Por eso, en algunos casos, la indicación de un fármaco no marca el inicio de un tratamiento, sino un momento dentro de él. Un punto de apoyo. Una forma de estabilizar lo suficiente como para que el trabajo pueda avanzar. Desde ahí, la intervención deja de ser una respuesta aislada y pasa a formar parte de un proceso más amplio, donde lo importante no es solo reducir el síntoma, sino recuperar la capacidad del sistema para autorregularse.
                </p>
            </article>
        </>
    );

    return (
        <BlogArticleLayout 
            tag="Psiquiatría y Farmacología"
            title="Cuando sostener deja de ser suficiente"
            subtitle="Hay momentos en que el sistema pierde su capacidad de autorregulación. Ahí, la psiquiatría ofrece una herramienta táctica para devolver la estabilidad necesaria para el trabajo terapéutico."
            author="Alan Lama"
            authorRole="Psiquiatría — Evaluación e intervención farmacológica"
            date="25 abril 2026"
            heroImage={heroImg}
            authorImage="https://www.origamis.cl/wp-content/uploads/2026/04/10.png"
            content={content}
            quote="La indicación de un fármaco no marca el inicio de un tratamiento, sino un momento dentro de él."
        />
    );
};

export default SostenerInsuficiente;

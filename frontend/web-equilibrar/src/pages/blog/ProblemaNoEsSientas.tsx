import React from 'react';
import BlogArticleLayout from './BlogArticleLayout';

const ProblemaNoEsSientas: React.FC = () => {
    const content = (
        <>
            <article className="ba-lead-card">
                <p>
                    Muchas personas llegan pensando que el objetivo es dejar de sentir angustia, ansiedad o sobrecarga. Sin embargo, en clínica, lo importante no es solo el contenido de lo que se siente, sino <strong>la forma en que el sistema de la persona está produciendo, sosteniendo y repitiendo esa experiencia</strong>.
                </p>
            </article>

            <article className="ba-article-body">
                <span className="ba-tag">Desarrollo</span>
                <h2>Lo visible no siempre explica lo que está ocurriendo</h2>
                <p>
                    El malestar suele presentarse como un síntoma reconocible: ansiedad, insomnio, irritabilidad, bloqueo o sensación de agotamiento. Pero esos fenómenos, aun cuando son reales y relevantes, no agotan el problema. Muchas veces son la expresión visible de una organización interna más amplia.
                </p>
                <p>
                    A veces se instala la idea de que el objetivo es dejar de sentir ansiedad, angustia o cansancio. Sin embargo, en la práctica clínica, no siempre es ahí donde está el problema.
                </p>
                <p>
                    Es frecuente recibir personas que describen su malestar como un exceso: demasiada ansiedad, demasiada angustia, demasiado agotamiento. Y aunque esa descripción es válida, muchas veces no alcanza para explicar lo que realmente está ocurriendo. Porque no siempre es la emoción en sí misma lo que sostiene el problema, sino la forma en que aparece, se mantiene en el tiempo o vuelve una y otra vez.
                </p>
                <p>
                    Ese cambio de foco es relevante. No es lo mismo intentar "dejar de sentir ansiedad" que preguntarse qué está organizando esa ansiedad, qué función cumple o por qué persiste incluso cuando ya no resulta útil. En muchos casos, la ansiedad no es el problema principal, sino una forma de funcionamiento que el sistema ha aprendido a sostener.
                </p>
                <p>
                    Cuando se observa desde ahí, empiezan a aparecer otros elementos. Personas que viven en un estado de alerta constante sin una amenaza clara, que no logran salir del cansancio aunque descansen, o que necesitan mantener control para evitar una sensación interna de inestabilidad. En ese contexto, el síntoma deja de ser algo que hay que eliminar rápidamente y pasa a ser una señal que requiere comprensión.
                </p>
                <p>
                    Esto también modifica la forma de intervenir. Existen herramientas útiles para disminuir la intensidad emocional —respiración, distracción, regulación—, pero si no cambia la lógica que sostiene el malestar, ese alivio suele ser parcial o transitorio. El síntoma puede disminuir, pero tiende a reaparecer, a veces de la misma forma y otras en otra manifestación.
                </p>
                <p>
                    Por eso el trabajo clínico no se centra únicamente en lo que la persona siente, sino en cómo está funcionando. Y eso implica asumir que no existe una única vía de intervención. Hay momentos en que es necesario ordenar el caso y definir con claridad el problema, otros en que se interviene directamente el síntoma, y otros en que el foco se desplaza hacia el cuerpo, cuando la regulación no se logra solo desde lo cognitivo o lo emocional.
                </p>
                <p>
                    En ese punto, el trabajo deja de ser individual en términos técnicos y pasa a ser articulado. No como una suma de especialistas, sino como distintas formas de leer un mismo fenómeno. Algunas respuestas surgen desde lo psicológico, otras desde lo corporal o desde la regulación biológica, y en ciertos casos se requiere ampliar la comprensión porque lo evidente no logra explicar completamente lo que ocurre.
                </p>
                <p>
                    El cuerpo, en particular, suele mostrar con claridad aquello que no está logrando regularse. Y no siempre basta con entenderlo. En algunos casos, el cambio aparece cuando la experiencia se modifica directamente, más allá de la explicación.
                </p>
                <p>
                    La ciencia ha permitido avanzar de manera importante en la comprensión de estos procesos, pero también tiene límites. No todo puede resolverse únicamente desde lo que se logra explicar. Esto abre la posibilidad de explorar otras formas de comprensión, manteniendo el rigor, pero sin restringirse únicamente a lo que ya está completamente definido.
                </p>
                <p>
                    En ese sentido, el problema no es solo el síntoma que aparece, sino la forma en que ese síntoma logra instalarse, repetirse y, en algunos casos, organizar la experiencia de la persona. Y eso no siempre cambia eliminándolo, sino entendiendo mejor cómo funciona y, desde ahí, interviniendo con mayor precisión.
                </p>
            </article>
        </>
    );

    return (
        <BlogArticleLayout 
            tag="Regulación emocional"
            title="Cuando el problema no es lo que sientes"
            subtitle="Muchas personas llegan pensando que el objetivo es dejar de sentir angustia. Sin embargo, lo importante es la forma en que el sistema sostiene la experiencia."
            author="Claudio Reyes"
            authorRole="Psicólogo y Director Clínico"
            date="19 abril 2026"
            heroImage="https://www.origamis.cl/wp-content/uploads/2026/04/10.png"
            authorImage="https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5750.jpg"
            content={content}
            quote="El problema no es solo el síntoma que aparece, sino la forma en que ese síntoma logra instalarse, repetirse y, en algunos casos, organizar la experiencia de la persona."
        />
    );
};

export default ProblemaNoEsSientas;

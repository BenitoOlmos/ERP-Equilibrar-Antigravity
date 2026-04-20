import React from 'react';
import BlogArticleLayout from './BlogArticleLayout';

const SiemprePasaLoMismo: React.FC = () => {
    const content = (
        <>
            <article className="ba-lead-card">
                <p>
                    Hay algo que muchas personas dicen en consulta, a veces con cierta frustración, a veces con resignación: <strong>“no entiendo por qué siempre me pasa lo mismo”</strong>. Se repiten relaciones que no funcionan, situaciones laborales que terminan de forma similar o conflictos que parecen distintos, pero que en el fondo se sienten iguales. Cambian las personas, cambian los contextos, pero la experiencia vuelve.
                </p>
            </article>

            <article className="ba-article-body">
                <span className="ba-tag">Desarrollo</span>
                <h2>Más allá de la casualidad relacional</h2>
                <p>
                    Y eso, con el tiempo, empieza a generar una sensación difícil de explicar. Como si hubiera algo que uno no está viendo. Algo que se repite, pero no se alcanza a entender del todo. En esos casos, el problema no suele estar solo en lo que ocurre en el presente. Muchas veces tiene que ver con la forma en que se han ido organizando ciertas relaciones a lo largo del tiempo, y cómo esas dinámicas siguen influyendo, incluso sin que uno lo note.
                </p>
                <p>
                    No siempre es evidente. Son patrones que no están a simple vista, pero que aparecen en la manera de vincularse, en las decisiones que se toman o en las posiciones que una persona tiende a ocupar frente a otros.
                </p>
                <p>
                    Por ejemplo, personas que constantemente se hacen cargo de más de lo que les corresponde, o que les cuesta poner límites, aunque sepan que deberían hacerlo, o que terminan en relaciones donde sienten que tienen que sostener al otro.
                </p>

                <h2>El sentido tras la repetición</h2>
                <p>
                    No es falta de voluntad. Tampoco es que “no hayan aprendido”. Muchas veces es una forma de organización que tiene sentido en su historia, pero que en el presente empieza a generar costo. Desde ahí, el trabajo no pasa solo por entender la situación actual, sino por poder ver el patrón. Ponerlo en perspectiva, reconocer cómo se repite, y, sobre todo, empezar a diferenciar qué parte de eso sigue siendo necesaria y qué parte ya no.
                </p>
                <p>
                    Cuando eso ocurre, aparece algo que suele ser bastante significativo: cierto orden. No necesariamente una solución inmediata, pero sí una forma distinta de mirar lo que está pasando. Y desde ahí, empiezan a abrirse otras posibilidades de respuesta.
                </p>
                <p>
                    A veces eso implica hacer algo distinto, veces implica dejar de hacer algo que siempre se hacía y, otras veces, simplemente poder elegir desde otro lugar.
                </p>
                <p>
                    En ese sentido, la intervención no busca cambiar a la persona, sino ayudar a que pueda ver con más claridad cómo se está organizando su experiencia en relación con otros. Porque hay cosas que no cambian aunque uno las entienda. Pero sí pueden cambiar cuando se logra ver el lugar desde donde se repiten.
                </p>
            </article>
        </>
    );

    return (
        <BlogArticleLayout 
            tag="Dinámicas relacionales"
            title="Cuando siempre te pasa lo mismo… no es casualidad"
            subtitle="Cambian las personas y los contextos, pero la experiencia vuelve. Los patrones vinculares repetitivos esconden una lógica que es necesario desentrañar."
            author="Daniela Baeza"
            authorRole="Análisis sistémico y dinámicas relacionales"
            date="21 abril 2026"
            heroImage="https://www.origamis.cl/wp-content/uploads/2026/04/mujer-5.png"
            authorImage="https://www.origamis.cl/wp-content/uploads/2026/04/mujer-5.png"
            content={content}
            quote="Lo que se repite no siempre se elige… pero puede empezar a verse."
        />
    );
};

export default SiemprePasaLoMismo;

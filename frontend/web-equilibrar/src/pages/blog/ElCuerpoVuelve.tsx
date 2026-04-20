import React from 'react';
import BlogArticleLayout from './BlogArticleLayout';

const ElCuerpoVuelve: React.FC = () => {
    const content = (
        <>
            <article className="ba-lead-card">
                <p>
                    Hay personas que dicen algo que, cuando uno las escucha con atención, es bastante preciso: entienden lo que les ocurrió, pueden explicarlo con claridad, pero su cuerpo no logra calmarse. No es que no sepan lo que pasó. Es que, de alguna manera, <strong>el cuerpo sigue reaccionando como si todavía estuviera ahí</strong>.
                </p>
            </article>

            <article className="ba-article-body">
                <span className="ba-tag">Desarrollo</span>
                <h2>La memoria somática y la regulación nerviosa</h2>
                <p>
                    En la práctica, eso se nota rápido. Aparece en la tensión que no se suelta, en la respiración que no baja, en ese estado de alerta que no desaparece del todo. También en cosas más específicas: jaquecas que se activan sin una causa clara, un tinnitus que se intensifica en momentos de estrés, o una incomodidad corporal que cuesta describir, pero que está siempre presente.
                </p>
                <p>
                    Durante mucho tiempo se pensó que el cambio venía principalmente por entender mejor lo vivido. Y eso ayuda, sin duda. Pero hay experiencias que no se ordenan solo desde lo que uno puede pensar o explicar. Quedan registradas de otra forma.
                </p>
                <p>
                    Autores como Van der Kolk han mostrado que ciertas vivencias no se guardan únicamente como recuerdos, sino también como patrones corporales. Y cuando uno lo observa en el trabajo clínico, eso se vuelve bastante evidente: el cuerpo reacciona antes, y a veces incluso independiente de lo que la persona entiende.
                </p>
                
                <h2>Ahí es donde el trabajo cambia de lugar</h2>
                <p>
                    En el shiatsu, por ejemplo, muchas veces no es necesario hablar demasiado para notar lo que está ocurriendo. El cuerpo muestra zonas de tensión, de bloqueo, de exceso de activación. Y a través del tacto, de la presión, de la respiración compartida, empieza a pasar algo distinto. No es inmediato, pero es claro. El cuerpo empieza a soltar un poco. La respiración cambia. La intensidad baja.
                </p>
                <p>
                    En personas con jaquecas, por ejemplo, no siempre desaparece el dolor en una sesión, pero sí cambia la forma en que se activa. En el caso del tinnitus, lo que se modifica no es solo el sonido, sino la relación que la persona tiene con esa sensación constante. Y en estados de ansiedad más sostenidos, muchas veces lo primero que cambia no es el pensamiento, sino el nivel de activación corporal.
                </p>
                <p>
                    Eso tiene bastante sentido si se mira desde la regulación del sistema nervioso. La teoría polivagal plantea que el cuerpo está evaluando constantemente si hay seguridad o amenaza, muchas veces sin que nos demos cuenta. Y si esa evaluación se mantiene en alerta, el sistema sigue funcionando desde ahí, aunque la situación ya haya pasado.
                </p>
                <p>
                    Por eso, en ciertos casos, no alcanza con intentar pensar distinto. No porque esté mal, sino porque el cuerpo todavía no lo registra como una experiencia segura.
                </p>
                <p>
                    El trabajo corporal apunta justamente a eso: no a forzar un cambio, sino a generar condiciones en las que el sistema pueda empezar a sentirse distinto. A través del movimiento, del tacto, de la respiración o simplemente de estar en un espacio donde el cuerpo no tenga que sostener tanta tensión.
                </p>
                <p>
                    Con el tiempo, eso va modificando algo más profundo. No solo baja la intensidad del síntoma, sino que cambia la forma en que aparece. Desde ahí, lo corporal deja de ser un complemento. Pasa a ser una vía directa de intervención. Porque hay cosas que no cambian cuando uno las entiende. Cambian cuando el cuerpo, de a poco, deja de reaccionar como si todo siguiera pasando.
                </p>
            </article>
        </>
    );

    return (
        <BlogArticleLayout 
            tag="Regulación Nerviosa"
            title="El cuerpo vuelve a vivir las cosas como reales"
            subtitle="Hay vivencias que no se guardan únicamente como recuerdos, sino también como patrones corporales. Cuando el cuerpo no baja la alerta, no basta con intentar entender."
            author="Valentín Keller"
            authorRole="Terapeuta somático e Instructor de Taichi"
            date="20 abril 2026"
            heroImage="https://www.origamis.cl/wp-content/uploads/2026/04/valentin-taichi.png"
            authorImage="https://www.origamis.cl/wp-content/uploads/2026/04/valentin-taichi.png"
            content={content}
            quote="Hay cosas que no cambian cuando uno las entiende. Cambian cuando el cuerpo, de a poco, comienza a funcionar distinto a su forma automática."
        />
    );
};

export default ElCuerpoVuelve;

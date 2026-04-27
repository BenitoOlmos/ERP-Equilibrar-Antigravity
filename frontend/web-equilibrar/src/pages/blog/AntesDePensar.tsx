import React from 'react';
import BlogArticleLayout from './BlogArticleLayout';
import heroImg from '../../assets/images/blog/4-1.png';

const AntesDePensar: React.FC = () => {
    const content = (
        <>
            <article className="ba-lead-card">
                <p>
                    En salud mental solemos asumir que primero entendemos y después actuamos. Que el cambio depende de pensar distinto, interpretar mejor o tomar decisiones más conscientes. Sin embargo, buena parte de la evidencia en neurociencias apunta en otra dirección.
                </p>
            </article>

            <article className="ba-article-body">
                <span className="ba-tag">Desarrollo</span>
                <h2>El cuerpo anticipa antes que la mente</h2>
                <p>
                    Uno de los trabajos más citados en este ámbito es el de Antonio Damasio, quien estudió pacientes con daño en áreas del cerebro asociadas a la emoción. A pesar de conservar intactas sus capacidades cognitivas —podían razonar, analizar e incluso explicar correctamente una situación—, tenían una dificultad significativa para tomar decisiones simples en la vida cotidiana.
                </p>
                <p>
                    El problema no estaba en que no entendieran, sino en que <strong>no lograban sentir</strong>.
                </p>
                <p>
                    En tareas como el Wisconsin Card Sorting Test, o en experimentos posteriores como el Iowa Gambling Task, se observó algo consistente: el cuerpo anticipa antes que la mente. Cambios fisiológicos —pequeñas variaciones en la conductancia de la piel, por ejemplo— aparecían antes de que la persona pudiera explicar qué estaba ocurriendo. Es decir, el sistema ya estaba respondiendo antes de que la interpretación consciente apareciera.
                </p>
                
                <h2>Las implicancias para el cambio clínico</h2>
                <p>
                    Esto tiene implicancias importantes. Si las decisiones no se construyen únicamente desde lo racional, entonces el cambio tampoco puede depender solo de entender. Se vuelve necesario intervenir en un nivel más amplio: en los hábitos, en las respuestas automáticas y en los patrones que el sistema ha ido consolidando en el tiempo.
                </p>
                <p>
                    La neuroplasticidad permite justamente eso. No se trata solo de adquirir nueva información, sino de modificar la forma en que el cerebro y el cuerpo responden de manera habitual. Y eso ocurre a través de la repetición, la experiencia y el ajuste progresivo de la conducta, más que desde la comprensión puntual de una idea.
                </p>
                <p>
                    Por eso muchas personas entienden perfectamente lo que les ocurre y, aun así, no logran cambiar. No es falta de claridad. Es que el sistema sigue funcionando de la misma manera.
                </p>
                <p>
                    Desde una perspectiva clínica, esto obliga a ampliar el foco. No basta con interpretar mejor el problema. Es necesario intervenir en cómo se expresa, en cómo se activa y en cómo se regula en el día a día.
                </p>
                <p>
                    Ahí es donde los hábitos, la exposición gradual y ciertos cambios conductuales empiezan a tener un rol central. No como recetas, sino como formas de reentrenar el sistema. Porque, en la práctica, el cambio no ocurre solo cuando uno entiende algo distinto, sino cuando empieza a responder distinto.
                </p>
            </article>
        </>
    );

    return (
        <BlogArticleLayout 
            tag="Neurociencias"
            title="Antes de pensar, ya estás decidiendo"
            subtitle="Las decisiones no se construyen únicamente desde la razón cognitiva. El sistema neurológico y corporal están respondiendo mucho antes de que la consciencia logre una interpretación."
            author="Carlos Carrasco"
            authorRole="Neurocientífico - Director de Formación"
            date="23 abril 2026"
            heroImage={heroImg}
            authorImage="https://www.origamis.cl/wp-content/uploads/2026/04/DSC_5656.jpg"
            content={content}
            quote="Las personas toman decisiones antes de que la mente logre explicarlo."
        />
    );
};

export default AntesDePensar;

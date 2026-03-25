export interface ProfileData {
    id: string;
    title: string;
    lead: string;
    promise: string;
    quotes: { text: string; who: string }[];
    translation: string;
    protocolSteps: string[];
    benefitsTitle: string;
    benefitsSub: string;
    videoSub: string;
    videoUrl: string;
    closingP1: string;
    paymentUrl: string;
}

export const profilesData: Record<string, ProfileData> = {
    "Desbordado": {
        id: "Desbordado",
        title: "DESREGULADO",
        lead: "Tu sistema nervioso <strong>tiende a activarse con facilidad</strong> y a veces puede costar volver a una base de calma. Esto no significa que “estés mal”: suele aparecer cuando el cuerpo ha tenido que adaptarse a estrés sostenido, exigencia emocional o contextos impredecibles.",
        promise: "<strong>Promesa del protocolo:</strong> en 30 días entrenamos respuestas de regulación para que tu cuerpo empiece a recuperar estabilidad, claridad y sensación de seguridad interna <span class=\"muted\">(paso a paso, sin forzarte).</span>",
        quotes: [
            { text: "“Me enciendo rápido. Después me cuesta mucho volver a la calma, incluso cuando ya pasó.”", who: "Perfil desregulado · experiencia frecuente" },
            { text: "“Siento el cuerpo en alerta: pecho apretado, respiración corta o tensión… como si algo fuera a pasar.”", who: "Perfil desregulado · experiencia frecuente" },
            { text: "“Mi mente se acelera y se me va a escenarios. Sé que no ayuda… pero se activa igual.”", who: "Perfil desregulado · experiencia frecuente" }
        ],
        translation: "<strong>Traducción clínica:</strong> a veces no basta con “calmarse” o “pensar positivo”. El cuerpo puede seguir respondiendo en automático. Por eso el foco está en entrenar regulación desde el sistema nervioso, de forma guiada y medible.",
        protocolSteps: [
            "Exploramos tu patrón, gatillantes y objetivos. Se traza tu ruta de reprogramación.",
            "Audios terapéuticos para practicar calma y seguridad interna (gradual y sostenida).",
            "Ejercicios breves para bajar activación y reforzar regulación día a día.",
            "Seguimiento y ajustes finos para que el cambio se consolide sin sobreesfuerzo.",
            "Evaluación comparativa: regulación, activación y bienestar general.",
            "Herramientas de estabilización para crisis de ansiedad/sobrecarga."
        ],
        benefitsTitle: "Lo que muchas personas notan cuando recuperan regulación",
        benefitsSub: "Con el avance del proceso, muchas personas reportan: menos alerta interna, más claridad, respiración más estable, mejor descanso y una sensación más consistente de seguridad en el cuerpo.",
        videoSub: "Explico cómo se forma la desregulación, por qué se mantiene y cómo RFAI entrena regulación desde el sistema nervioso.",
        videoUrl: "https://www.youtube.com/embed/SU_K-Qt4tf8",
        closingP1: "Si hoy tu cuerpo se activa rápido, eso no habla de “debilidad”. Suele hablar de un sistema nervioso que ha estado sosteniendo demasiado tiempo en alerta. Y lo que el cuerpo aprendió, también puede reentrenarse.",
        paymentUrl: "https://mpago.la/23c42on"
    },
    "Hiper Regulado": {
        id: "Hiper Regulado",
        title: "HIPER REGULADO",
        lead: "Tu mente <strong>tiende a intentar mantener el control de las cosas</strong> para sentirse más segura. Muchas veces eso te ayuda a funcionar bien hacia afuera, pero por dentro puede sentirse como tensión, alerta silenciosa y dificultad para soltar.",
        promise: "<strong>Promesa del protocolo:</strong> en 30 días entrenamos nuevas respuestas para que tu cerebro empiece a recuperar una base más estable de calma <span class=\"muted\">(sin depender tanto de la fuerza de voluntad).</span>",
        quotes: [
            { text: "“Me dicen que lo hago bien… pero por dentro siento que estoy apretado casi todo el día.”", who: "Perfil hiper regulado · experiencia frecuente" },
            { text: "“Descanso, pero no recupero del todo. Es como si mi cuerpo siguiera encendido.”", who: "Perfil hiper regulado · experiencia frecuente" },
            { text: "“Entiendo lo que me pasa… y aun así termino reaccionando en automático.”", who: "Perfil hiper regulado · experiencia frecuente" }
        ],
        translation: "<strong>Traducción clínica:</strong> a veces no basta con entenderlo; el cuerpo puede seguir respondiendo en automático. Por eso el foco está en entrenar la respuesta del sistema nervioso, de forma guiada y medible.",
        protocolSteps: [
            "Exploramos tu patrón, gatillantes y objetivos. Se traza tu ruta de reprogramación.",
            "Audios terapéuticos para practicar estados de calma y seguridad desde atención focalizada.",
            "Ejercicios breves para consolidar cambios y reforzar conexiones nuevas.",
            "Seguimiento y ajustes finos para asegurar que el cambio se vuelva estable.",
            "Evaluación comparativa: regulación, activación y bienestar general.",
            "Herramientas para ansiedad/sobrecarga. Útiles durante y después del programa."
        ],
        benefitsTitle: "Lo que muchas personas notan cuando el patrón se reorganiza",
        benefitsSub: "Con el avance del proceso, muchas personas reportan: más calma interna, mejor descanso, menos tensión y una forma más liviana de sostener el día a día.",
        videoSub: "Explico cómo se forma el patrón hiper regulado, por qué se mantiene y cómo RFAI trabaja sobre la respuesta automática del sistema nervioso.",
        videoUrl: "https://www.youtube.com/embed/X7v43d7U4io",
        closingP1: "Es posible que hayas aprendido a sostener mucho, a cumplir, a controlarte, a seguir adelante incluso cuando por dentro era pesado. Eso tuvo un sentido. Y también es posible aprender otra forma: más amable, más regulada, más liviana.",
        paymentUrl: "https://mpago.la/1oGPijS"
    },
    "Hiper Reactivo": {
        id: "Hiper Reactivo",
        title: "HIPER REACTIVIDAD",
        lead: "En este perfil, tu sistema nervioso <strong>tiende a reaccionar rápido e intenso</strong>. A veces se siente como si la emoción “se adelantara” a la mente, y puede aparecer <strong>impulsividad</strong>: respuestas rápidas, descontrol de impulsos, decir o hacer cosas “en caliente”, y después arrepentirse o quedar agotado. Esto no es “falta de carácter”: suele ser un circuito aprendido para sobrevivir a estrés, conflicto o exigencia emocional.",
        promise: "<strong>Promesa del protocolo:</strong> en 30 días entrenamos regulación para que puedas <strong>pausar antes de reaccionar</strong>, recuperar claridad y responder con más control interno <span class=\"muted\">(sin apagar tus emociones).</span>",
        quotes: [
            { text: "“Me pasa algo y reacciono al tiro… después pienso ‘¿por qué hice eso?’.”", who: "Perfil hiper reactivo · experiencia frecuente" },
            { text: "“Siento que no alcanzo a frenar: hablo fuerte, me enojo, me acelero… y luego me agoto.”", who: "Perfil hiper reactivo · experiencia frecuente" },
            { text: "“En el momento se siente urgente. Después me doy cuenta que fue la activación la que tomó el mando.”", who: "Perfil hiper reactivo · experiencia frecuente" }
        ],
        translation: "<strong>Traducción clínica:</strong> el descontrol de impulsos rara vez se resuelve “solo con voluntad”. Cuando el sistema nervioso se activa, el cuerpo prioriza supervivencia y la respuesta sale en automático. Por eso el foco está en entrenar regulación y pausa, de forma guiada y medible.",
        protocolSteps: [
            "Exploramos gatillantes, impulsos frecuentes y objetivos. Se traza tu ruta de pausa y regulación.",
            "Audios terapéuticos para entrenar calma y “micro-pausas” antes de reaccionar.",
            "Ejercicios breves para bajar activación, frenar impulsividad y elegir respuesta.",
            "Seguimiento y ajustes finos para consolidar autocontrol sin rigidez.",
            "Evaluación comparativa: reactividad, regulación y estabilidad cotidiana.",
            "Herramientas para crisis: escalada emocional, ataques de rabia/ansiedad o sobrecarga."
        ],
        benefitsTitle: "Lo que muchas personas notan cuando recuperan pausa y control interno",
        benefitsSub: "Con el avance del proceso, muchas personas reportan: más capacidad de detenerse antes de reaccionar, menos impulsividad, mejor comunicación, menos culpa posterior y más estabilidad emocional en el día a día.",
        videoSub: "Explico cómo se forma la hiper reactividad, por qué aparece la impulsividad y cómo RFAI entrena pausa y regulación.",
        videoUrl: "https://www.youtube.com/embed/Ke5JnAlBe7Y",
        closingP1: "Si hoy te cuesta frenar impulsos, eso no habla de “ser malo” o “ser débil”. Suele hablar de un sistema nervioso que aprendió a reaccionar rápido para protegerte. Y lo que el cuerpo aprendió, también puede reentrenarse.",
        paymentUrl: "https://mpago.la/2fyyjrJ"
    },
    "Inhibido": {
        id: "Inhibido",
        title: "INHIBIDO",
        lead: "En este perfil, tu sistema nervioso <strong>tiende a apagarse o “bajar volumen”</strong> para mantenerte a salvo. Muchas personas lo viven como <strong>falta de motivación</strong>, pérdida de sentido, dificultad para iniciar cosas, sensación de estar <strong>estancado</strong> o de “estar viendo la vida desde afuera”. No es flojera ni falta de ganas: suele ser un circuito aprendido cuando en algún momento fue más seguro <strong>no sentir tanto</strong>, no molestar, no pedir, o sostenerse en modo automático.",
        promise: "<strong>Promesa del protocolo:</strong> en 30 días entrenamos reactivación suave y regulación, para recuperar energía, claridad y sentido, sin forzarte ni exigirte más.",
        quotes: [
            { text: "“No es que no quiera… es que no encuentro energía. Me cuesta empezar, incluso cosas que antes me gustaban.”", who: "Perfil inhibido · experiencia frecuente" },
            { text: "“Siento que estoy estancado. Hago lo mínimo y el día pasa… pero no siento sentido.”", who: "Perfil inhibido · experiencia frecuente" },
            { text: "“Me cuesta emocionarme. Estoy como en automático, como si algo estuviera apagado.”", who: "Perfil inhibido · experiencia frecuente" }
        ],
        translation: "<strong>Traducción clínica:</strong> la falta de motivación muchas veces no es “mental”. Puede ser un cuerpo que aprendió a inhibirse para no sufrir o no colapsar. Por eso el foco está en reactivar con seguridad y recuperar regulación, de forma guiada y medible.",
        protocolSteps: [
            "Exploramos tu sensación de estancamiento, pérdida de sentido y objetivos. Trazamos tu ruta de reactivación segura.",
            "Audios para reconectar con calma, presencia y vitalidad (sin exigirte “energía” de golpe).",
            "Ejercicios breves para recuperar iniciativa, sentido y conexión con lo que te importa.",
            "Ajustes finos para que el avance se consolide sin presión ni autoexigencia.",
            "Evaluación comparativa: energía, motivación, regulación y bienestar cotidiano.",
            "Herramientas para momentos de caída, apatía intensa o bloqueo emocional."
        ],
        benefitsTitle: "Lo que muchas personas notan cuando recuperan sentido y vitalidad",
        benefitsSub: "Con el avance del proceso, muchas personas reportan: más energía disponible, más claridad, más motivación para iniciar, sensación de “volver a habitar su vida” y mayor conexión con lo que importa.",
        videoSub: "Explico cómo se forma la inhibición, por qué aparece la pérdida de sentido y cómo RFAI trabaja para reactivar con seguridad.",
        videoUrl: "https://www.youtube.com/embed/liHSg0FOT9g",
        closingP1: "Si hoy sientes que estás estancado, sin motivación o sin sentido, no significa que hayas “perdido tu esencia”. Muchas veces es un sistema nervioso que aprendió a apagarse para protegerte. Y lo que el cuerpo aprendió, también puede reentrenarse.",
        paymentUrl: "https://mpago.la/2TXMsQo"
    },
    "Sobre Adaptado": {
        id: "Sobre Adaptado",
        title: "SOBRE ADAPTADO",
        lead: "En este perfil, tu mente y tu cuerpo <strong>tienden a acomodarse demasiado</strong> a lo que el entorno espera. Te vuelves experto en leer a otros, anticiparte, cumplir, sostener, evitar conflictos y mantener la armonía, incluso cuando por dentro hay cansancio o incomodidad. Muchas personas lo viven como <strong>hiper-responsabilidad</strong>, dificultad para poner límites, culpa al decir “no”, y una sensación de que te vas perdiendo a ti mismo en el camino. No es “ser débil”: suele ser un circuito aprendido cuando adaptarse fue la forma más segura de pertenecer.",
        promise: "<strong>Promesa del protocolo:</strong> en 30 días entrenamos regulación y reconexión contigo, para recuperar límites, claridad y autenticidad sin romper vínculos ni vivir en alerta.",
        quotes: [
            { text: "“Me adapto a todo… pero después me doy cuenta que no sé qué quiero yo.”", who: "Perfil sobre adaptado · experiencia frecuente" },
            { text: "“Digo que sí por compromiso, por culpa, por no incomodar… y termino agotado.”", who: "Perfil sobre adaptado · experiencia frecuente" },
            { text: "“Siempre estoy pendiente de los demás. Me cuesta poner límites sin sentir que voy a perder el vínculo.”", who: "Perfil sobre adaptado · experiencia frecuente" }
        ],
        translation: "<strong>Traducción clínica:</strong> sobre-adaptarse no suele ser una “decisión consciente”. Es un circuito de protección: pertenecer y mantener paz puede haber sido más importante que expresar necesidades. Por eso el foco está en reentrenar límites y autoescucha, de forma guiada y medible.",
        protocolSteps: [
            "Identificamos tus patrones de complacencia, culpa y límites. Definimos objetivos claros y sostenibles.",
            "Audios para reprogramar seguridad interna y permitirte decir “no” sin entrar en alerta.",
            "Ejercicios breves para autoescucha, límites y autenticidad (sin romper vínculos).",
            "Ajustes finos para sostener cambios sin caer en autoexigencia o complacencia automática.",
            "Evaluación comparativa: límites, regulación y bienestar en tus relaciones.",
            "Herramientas para momentos de culpa, miedo al conflicto o sobrecarga relacional."
        ],
        benefitsTitle: "Lo que muchas personas notan cuando dejan de sobre-adaptarse",
        benefitsSub: "Con el avance del proceso, muchas personas reportan: más claridad para elegir, límites más sanos, menos culpa al priorizarse, mejor descanso y relaciones más auténticas.",
        videoSub: "Explico cómo se forma la sobre-adaptación, por qué se mantiene y cómo RFAI trabaja límites y autoescucha sin generar alerta.",
        videoUrl: "https://www.youtube.com/embed/8rIIp-15huw",
        closingP1: "Si hoy sientes que te adaptas demasiado, recuerda esto: muchas veces fue la forma más inteligente de tu sistema nervioso para sostener vínculos y seguridad. Pero no tienes que vivir así para siempre. Y lo que el cuerpo aprendió, también puede reentrenarse.",
        paymentUrl: "https://mpago.la/1UCQXap"
    },
    "Indeterminado": {
        id: "Indeterminado",
        title: "REVISIÓN ESPECIALISTA",
        lead: "Tus respuestas en el test muestran componentes mixtos que <strong>requieren una lectura más profunda</strong>. No calzas de forma automática en un solo perfil estructurado, lo cual es muy común. Para evitar entregarte información inexacta, tu evaluación ha pasado a revisión directa.",
        promise: "El equipo evaluará la combinación exacta de tus variables: reactividad, regulación y marcadores emocionales para derivarte a la ruta clínica o programa adecuado.",
        quotes: [
            { text: "“Siento que me pasan diferentes cosas a la vez, a veces estoy alerta y otras veces sin energía.”", who: "Experiencia frecuente" },
            { text: "“Las herramientas generales nunca me terminan de encajar, necesito algo que explique mi situación completa.”", who: "Experiencia frecuente" },
            { text: "“Tengo momentos de control, pero cuando hay caída, es todo muy desorganizado y me confunde.”", who: "Experiencia frecuente" }
        ],
        translation: "Los algoritmos detectan cuando un patrón se repite constantemente, pero a veces nuestro sistema nervioso fluctúa entre la sobrecarga y el apagado. Evaluar estas variaciones personalmente garantiza que intervengamos en tu causa raíz real y no solo en los síntomas temporales.",
        protocolSteps: [
            "Revisamos línea por línea tus respuestas del test en detalle.",
            "Cruzamos tus índices de activación con tus capacidades base de regulación.",
            "Determinamos qué circuito biológico primario está causando tus síntomas.",
            "Elaboramos tu diagnóstico dimensional detallado y ruta de solución de 30 días.",
            "Definimos qué protocolo se aplicará, si uno específico o un mapeo mixto.",
            "Te enviamos por WhatsApp o Email tu revisión personal en un máximo de 48 hrs."
        ],
        benefitsTitle: "Lo que lograrás con un análisis a medida",
        benefitsSub: "En lugar de recomendaciones masivas, entenderás de manera hiper individualizada qué áreas de tu vida están agotando recursos neuronales y cómo iniciar el verdadero cambio consolidable.",
        videoSub: "Explico por qué el sistema nervioso puede arrojar síntomas mixtos y la importancia de no auto diagnosticarse erróneamente.",
        videoUrl: "https://www.youtube.com/embed/Ke5JnAlBe7Y",
        closingP1: "Tranquilo/a, esto no significa que tienes algo grave. Simplemente indica que tu sistema nervioso está intentando protegerte usando distintas estrategias a la vez. Analizarlas en contexto nos permitirá ayudarte con total exactitud.",
        paymentUrl: "#"
    }
};

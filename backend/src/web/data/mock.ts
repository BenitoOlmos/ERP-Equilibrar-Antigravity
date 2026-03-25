import { Program, Service, Author } from '../types';

const claudioReyes: Author = {
    name: "Claudio Reyes Vera",
    role: "Psicólogo Clínico Transdisciplinario",
    imageUrl: "claudio-reyes.jpg" // Frontend should map this or server should serve static
};

export const programs: Program[] = [
    {
        id: "p_angustia",
        slug: "programa-angustia",
        title: "Redefinir la Angustia",
        subtitle: "Reprogramación Emocional",
        price: 250000,
        shortDescription: "Un proceso clínico para resignificar el miedo a la pérdida y restaurar el vínculo interno.",
        longDescription: "La angustia no es enemiga; es una señal de desconexión profunda. Vivir en estado de alerta constante erosiona tu capacidad de confiar. Transita desde la parálisis hacia la seguridad interna.",
        problemTitle: "¿El miedo decide por ti?",
        problemPoints: [
            "Hipervigilancia constante.",
            "Sensación inminente de catástrofe.",
            "Incapacidad para habitar el presente."
        ],
        solutionGrid: [
            { title: "Neurociencia", description: "Regulación vagal." },
            { title: "Vínculo", description: "Seguridad interna." },
            { title: "Cuerpo", description: "Habitar la calma." },
            { title: "Mente", description: "Claridad cognitiva." }
        ],
        structure: [
            { title: "Semanas 1-2", description: "Desactivar Alerta: Protocolos de seguridad." },
            { title: "Semanas 3-4", description: "Restauración: Construir confianza básica." }
        ],
        duration: "4 Semanas",
        isOnline: true,
        imageUrl: "program-angustia.png",
        author: claudioReyes
    },
    {
        id: "p_culpa",
        slug: "programa-culpa",
        title: "Redefinir la Culpa",
        subtitle: "Reprogramación Cognitiva",
        price: 250000,
        shortDescription: "Transformar el castigo en responsabilidad soberana y desactivar el autoataque.",
        longDescription: "La culpa tóxica es un mecanismo de control interno que drena nuestra vitalidad. Aprende a distinguir entre la culpa neurótica y la responsabilidad ética para recuperar tu paz.",
        problemTitle: "¿Te castigas por existir?",
        problemPoints: [
            "Rumiación mental obsesiva.",
            "Sensación de no ser suficiente.",
            "Autoexigencia destructiva."
        ],
        solutionGrid: [
            { title: "Ética", description: "Responsabilidad real." },
            { title: "Compasión", description: "Cese del fuego." },
            { title: "Dignidad", description: "Soberanía personal." },
            { title: "Acción", description: "Reparación efectiva." }
        ],
        structure: [
            { title: "Semanas 1-2", description: "Culpa vs Responsabilidad: Distinciones." },
            { title: "Semanas 3-4", description: "Desactivar Autoataque: Paz interna." }
        ],
        duration: "4 Semanas",
        isOnline: true,
        imageUrl: "program-culpa.png",
        author: claudioReyes
    },
    {
        id: "p_irritabilidad",
        slug: "programa-irritabilidad",
        title: "Redefinir la Irritabilidad",
        subtitle: "Reprogramación Focalizada",
        price: 250000,
        shortDescription: "Un proceso profundo para resignificar la irritabilidad desde el amor propio.",
        longDescription: "La discrepancia entre la realidad y nuestras expectativas genera una fricción sistémica. La irritabilidad mantiene al sistema nervioso en alerta constante, erosionando tu vitalidad.",
        problemTitle: "¿Cuándo deja de ser una señal?",
        problemPoints: [
            "Tensión corporal acumulada.",
            "Erosión de la energía vital.",
            "Debilitamiento de vínculos."
        ],
        solutionGrid: [
            { title: "Neurociencia", description: "Calma fisiológica." },
            { title: "Presencia", description: "Habitar sin lucha." },
            { title: "Reprogramar", description: "PNL y juicios." },
            { title: "Amor Propio", description: "Autocompasión." }
        ],
        structure: [
            { title: "Semanas 1-2", description: "Descomprimir: reactividad y seguridad." },
            { title: "Semanas 3-4", description: "Reorganizar: identidad y amor propio." }
        ],
        duration: "4 Semanas",
        isOnline: true,
        imageUrl: "program-irritabilidad.jpg",
        author: claudioReyes
    }
];

export const services: Service[] = [
    {
        id: "s_psiquiatria",
        slug: "psiquiatria",
        title: "Psiquiatría y Diagnóstico",
        subtitle: "Enfoque Transdisciplinario y Neurociencia Afectiva",
        description: "En Equilibrar, la psiquiatría trasciende la prescripción convencional.",
        interventionPoints: [
            "Diagnóstico transdisciplinario integral.",
            "Neurociencia afectiva aplicada a la clínica.",
            "Integración con medicina oriental.",
            "Farmacología consciente y supervisada."
        ],
        imageUrl: "service-detail-psychiatry.jpg",
        ctaText: "Agendar sesión vía WhatsApp",
        ctaMessage: "Hola, me interesa agendar una hora de Psiquiatría/Diagnóstico."
    },
    {
        id: "s_psicologia",
        slug: "psicologia",
        title: "Psicología Clínica",
        subtitle: "Regulación Somática y Vínculo Terapéutico",
        description: "La sanación real ocurre en el contexto de un vínculo seguro.",
        interventionPoints: [
            "Terapia centrada en la regulación somática.",
            "Fortalecimiento del vínculo terapéutico.",
            "Desarrollo de resiliencia emocional.",
            "Enfoque en trauma y apego."
        ],
        imageUrl: "service-detail-psychology.jpg",
        ctaText: "Agendar sesión vía WhatsApp",
        ctaMessage: "Hola, quisiera consultar por disponibilidad para Psicología Clínica."
    }
];

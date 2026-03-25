import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, HeartPulse, UserCircle2, ArrowRight, ShieldCheck, ArrowLeft, CheckCircle2, BarChart3, PlayCircle } from 'lucide-react';
import { profilesData } from '../data/testRFAIProfiles';
import logoImg from '../assets/images/logo-clinica-equilibrar.png';

// Video URLs (YouTube Embeds)
const vDesbordado = 'https://www.youtube.com/embed/SU_K-Qt4tf8';
const vSobreAdaptado = 'https://www.youtube.com/embed/8rIIp-15huw';
const vHiperRegulado = 'https://www.youtube.com/embed/X7v43d7U4io';
const vInhibido = 'https://www.youtube.com/embed/liHSg0FOT9g';
const vHiperReactivo = 'https://www.youtube.com/embed/Ke5JnAlBe7Y';

const questions = [
    // ACTIVACIÓN FISIOLÓGICA (1-7)
    "1. Siento tensión muscular constantemente.",
    "2. Me cuesta conciliar el sueño o me despierto con sobresaltos en la noche.",
    "3. Me doy cuenta que suspiro seguido o que mi respiración está acelerada.",
    "4. Mi cuerpo se siente presionado a diario.",
    "5. Siento como si funcionara de manera acelerada, sin motivo claro.",
    "6. Cuando intento relajar el cuerpo me aparece dolor de cuello u hombros.",
    "7. Tengo síntomas de alteraciones digestivas/estomacales de manera recurrente.",

    // ACTIVACIÓN MENTAL (8-14)
    "8. Mi mente se obsesiona con algunos temas y no deja de analizarlos.",
    "9. Mi mente tiende a crear escenarios negativos o catastróficos.",
    "10. No paro de pensar en todo el día.",
    "11. Me critico internamente con dureza.",
    "12. Me cuesta desconectarme de lo que pienso al intentar dormir.",
    "13. Sobre analizo las situaciones, buscando estar preparado/a para lo que venga.",
    "14. Tiendo a tener mi atención puesta en el futuro y/o el pasado.",

    // ACTIVACIÓN EMOCIONAL (15-21)
    "15. Me irrito con facilidad.",
    "16. Siento frecuentemente emociones intensas en el pecho.",
    "17. Siento culpa por las cosas que ocurren en mi vida.",
    "18. Mis emociones se intensifican de manera abrupta.",
    "19. Me cuesta tolerar frustraciones.",
    "20. Me siento incapaz de procesar lo que siento en estos días.",
    "21. Los períodos de calma tienden a durar poco tiempo.",

    // REGULACIÓN (22-28)
    "22. Noto cuándo mi cuerpo se acelera y puedo calmarlo.",
    "23. Soy capaz de volver a sentirme seguro/a cuando pierdo la calma.",
    "24. Mi diálogo interno es positivo y me trato internamente como si fuera mi mejor amigo/a.",
    "25. Tengo la capacidad de dejar de pensar en lo que podría pasar.",
    "26. Sé reconocer cuando necesito ayuda y soy capaz de pedir apoyo.",
    "27. Tengo prácticas de autocuidado diario que me regulan.",
    "28. Puedo reconocer cuando mi pensamiento se obsesiona y sé cómo calmarlo."
];

const scaleOptions = [
    { value: 0, label: "Nunca" },
    { value: 1, label: "Rara vez" },
    { value: 2, label: "A veces" },
    { value: 3, label: "Frecuente" },
    { value: 4, label: "Casi siempre" }
];

// Legacy Google Script bypass
// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdwl3tIbjnebuTGYZGmgLVWUFVPyIHsoxJi9uP1zHO4yN4YuBspUQXVGwNyabAZARF5A/exec";
const CMS_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ResultsType {
    AF: number;
    AM: number;
    AE: number;
    R: number;
    ITA: number;
    Re: number;
    IDSE: number;
    interpretacion: string;
    perfil: string;
    afText: string;
    amText: string;
    aeText: string;
    rText: string;
    interrelacion: string;
    resumenDimensional: string;
}

const TestRFAI: React.FC = () => {
    const [step, setStep] = useState(0); // 0: UserInfo, 1: AF, 2: AM, 3: AE, 4: R
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [answers, setAnswers] = useState<number[]>(Array(28).fill(-1));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<ResultsType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Evitar salto al enfocar un input en celular
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleAnswerChange = (index: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
        if (error) setError(null);
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!userInfo.name.trim() || !userInfo.email.trim()) {
                setError("Por favor, completa nombre y correo para continuar.");
                return false;
            }
            if (!emailRegex.test(userInfo.email)) {
                setError("El formato del correo electrónico es inválido.");
                return false;
            }
        } else {
            const startIndex = (currentStep - 1) * 7;
            const endIndex = startIndex + 7;
            const stepAnswers = answers.slice(startIndex, endIndex);
            if (stepAnswers.includes(-1)) {
                setError("Por favor, responde todas las preguntas antes de avanzar.");
                return false;
            }
        }
        setError(null);
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        setError(null);
    };

    const calculateResults = (): ResultsType => {
        const sumRange = (start: number, end: number) =>
            answers.slice(start, end).reduce((a, b) => a + (b === -1 ? 0 : b), 0);

        // 1. Variables del test
        const F = sumRange(0, 7); // Activación Fisiológica (AF)
        const C = sumRange(7, 14); // Activación Cognitiva (AM)
        const E = sumRange(14, 21); // Activación Emocional (AE)
        const pureR = sumRange(21, 28); // Regulación Base

        // 3. Cálculo de activación global y Regulación
        const R_total = pureR * 3; // Regulación Total (0-84)
        const A = C + E + F; // Activación global (0-84)

        // 4. Coherencia entre sistemas
        const D = Math.max(C, E, F) - Math.min(C, E, F);

        let perfil = "Indeterminado"; // Por defecto, asume requerir evaluación
        let requiresProfessional = false;

        // 7. Reglas de derivación (D >= 9 es Incoherencia)
        if (D >= 9) {
            requiresProfessional = true;
        }

        // 5 & 6. Reglas de clasificación
        if (!requiresProfessional) {
            // Perfil Inhibido
            if (A <= 27 && R_total <= 54 && D <= 8) {
                perfil = "Inhibido";
            }
            // Perfil Hiperreactivo
            else if (A >= 55 && R_total <= 27 && (E >= 19 || F >= 19) && D <= 8) {
                if (E <= 9) requiresProfessional = true; // Excepción
                else perfil = "Hiper Reactivo";
            }
            // Perfil Hiperregulado
            else if (C >= 19 && R_total >= 55 && E <= 18 && A >= 28 && D <= 8) {
                if (F >= 19 && E <= 9) requiresProfessional = true; // Excepción
                else perfil = "Hiper Regulado";
            }
            // Perfil Sobre Adaptado
            else if (R_total >= 55 && A >= 28 && A <= 54 && C >= 10 && C <= 18 && E >= 10 && E <= 18 && F >= 10 && F <= 18 && D <= 8) {
                perfil = "Sobre Adaptado";
            }
            // Perfil Desregulado (Visualmente mapeado al dict como 'Desbordado')
            else if (
                ((A >= 55 && R_total >= 28 && R_total <= 54 && D <= 8) ||
                    (A >= 28 && A <= 54 && R_total <= 27 && D <= 8))
            ) {
                perfil = "Desbordado";
            } else {
                requiresProfessional = true; // No cumple criterios estrictos de ninguno
            }
        }

        if (requiresProfessional) {
            perfil = "Indeterminado";
        }

        if (perfil === "Indeterminado") {
            console.warn("RFAI requiere evaluación profesional", { C, E, F, R_total, A, D });
        }

        // Mapeo legacy para interrelaciones y componentes visuales previas
        const AF = F;
        const AM = C;
        const AE = E;
        const R = pureR;
        const ITA = A;
        const Re = R_total;
        const IDSE = ITA - Re;

        let interpretacion = "";
        if (IDSE <= -20) interpretacion = "Regulación robusta. Excedente de recursos que facilita resiliencia y salud.";
        else if (IDSE >= -19 && IDSE <= 19) interpretacion = "Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.";
        else if (IDSE >= 20 && IDSE <= 49) interpretacion = "Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.";
        else interpretacion = "Desbalance alto. Consumo excesivo prolongado que puede llevar a síndromes tensionales, disregulación anímica o agotamiento funcional.";

        let interrelacion = "Perfil de Estabilidad Funcional.";
        if (AF <= 9 && AM <= 9 && AE <= 9) {
            interrelacion = "Estado depresivo / Inhibido.";
        } else if (AF >= 19 && AM >= 19 && AE >= 19) {
            interrelacion = "Desborde generalizado del sistema.";
        } else if (AM >= 19 && AE >= 19) {
            interrelacion = "Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.";
        } else if (AF >= AM + 6 && AF >= AE + 6) {
            interrelacion = "Funcionalidad sostenida con desregulación fisiológica.";
        } else if (AM >= AE + 6) {
            interrelacion = "Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.";
        } else if (AE >= AM + 6) {
            interrelacion = "Funcionalidad sostenida desde un predominio emocional con baja elaboración cognitiva.";
        } else if (Math.abs(AF - AM) < 6 && Math.abs(AF - AE) < 6 && Math.abs(AM - AE) < 6) {
            interrelacion = "Balance funcional sin diferencias marcadas.";
        }

        const getActvText = (score: number, type: 'AF' | 'AM' | 'AE') => {
            if (type === 'AF') {
                if (score <= 9) return "Tu cuerpo se mantiene en un estado de calma base; las señales de tensión física son mínimas.";
                if (score <= 18) return "Experimentas tensiones corporales ocasionales o alteraciones leves en el sueño y digestión ante el estrés.";
                return "Tu cuerpo reacciona con intensidad; la tensión muscular, opresión o fatiga son constantes y difíciles de ignorar.";
            } else if (type === 'AM') {
                if (score <= 9) return "Posees claridad mental y capacidad para estar presente sin rumiación excesiva.";
                if (score <= 18) return "En momentos de presión, tu mente tiende a sobreanalizar o anticipar escenarios negativos.";
                return "Experimentas una \"urgencia mental\" constante; te cuesta apagar los pensamientos y el juicio interno es severo.";
            } else {
                if (score <= 9) return "Tus emociones son estables y proporcionales a las situaciones.";
                if (score <= 18) return "Presentas fluctuaciones emocionales o irritabilidad cuando las demandas externas aumentan.";
                return "Sientes una hiperreactividad emocional; la angustia o la culpa aparecen con rapidez y son difíciles de sostener.";
            }
        };

        const getRegText = (score: number, r_ita: number, r_idse: number, isBajaActivacion: boolean) => {
            if (score >= 19 && r_idse >= 20) return "Sobre esfuerzo en la compensación de síntomas.";
            if (score <= 9 && isBajaActivacion) return "Atención a síntomas depresivos.";

            if (score <= 9) return "Dificultad para recuperar equilibrio.";
            if (score <= 18) return "Recursos presentes pero inestables.";
            return "Capacidad de retorno al equilibrio instalada.";
        };

        const afText = getActvText(AF, 'AF');
        const amText = getActvText(AM, 'AM');
        const aeText = getActvText(AE, 'AE');
        const rText = getRegText(R, ITA, IDSE, ITA <= 27 || (AF <= 9 && AM <= 9 && AE <= 9));

        const level3CEF = (score: number) => {
            if (score <= 9) return "Bajo";
            if (score <= 18) return "Medio";
            return "Alto";
        };

        const level3R = (rTotalValue: number) => {
            if (rTotalValue <= 27) return "Baja";
            if (rTotalValue <= 54) return "Media";
            return "Alta";
        };

        // 8. Información que siempre debe mostrarse al usuario
        const resumenDimensional = `Resultado Cognitivo: ${level3CEF(C)} · Resultado Emocional: ${level3CEF(E)} · Resultado Fisiológico: ${level3CEF(F)} · Resultado de Regulación: ${level3R(R_total)}`;

        return { AF, AM, AE, R, ITA, Re, IDSE, interpretacion, perfil, afText, amText, aeText, rText, interrelacion, resumenDimensional };
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setError(null);
        setIsSubmitting(true);

        const calculatedResults = calculateResults();

        // Creamos un objeto URLSearchParams para enviar como formulario clásico (x-www-form-urlencoded)
        // Esto es mucho más seguro para evitar que el navegador o bloqueadores eliminen campos en el modo 'no-cors'
        const formData = new URLSearchParams();
        formData.append("name", userInfo.name);
        formData.append("email", userInfo.email);
        formData.append("AF", calculatedResults.AF.toString());
        formData.append("AM", calculatedResults.AM.toString());
        formData.append("AE", calculatedResults.AE.toString());
        formData.append("R", calculatedResults.R.toString());
        formData.append("ITA", calculatedResults.ITA.toString());
        formData.append("Re", calculatedResults.Re.toString());
        formData.append("IDSE", calculatedResults.IDSE.toString());
        formData.append("interpretacion", calculatedResults.interpretacion);
        formData.append("perfil", `${calculatedResults.perfil} | ${calculatedResults.interrelacion}`);
        formData.append("resumen_dimensional", calculatedResults.resumenDimensional);

        try {
            // POST a nuestro CMS Unificado en lugar de Google Sheets
            await fetch(`${CMS_API_URL}/api/crm/diagnostics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    AF: calculatedResults.AF,
                    AM: calculatedResults.AM,
                    AE: calculatedResults.AE,
                    R: calculatedResults.R,
                    ITA: calculatedResults.ITA,
                    Re: calculatedResults.Re,
                    IDSE: calculatedResults.IDSE,
                    interpretacion: calculatedResults.interpretacion,
                    perfil: `${calculatedResults.perfil} | ${calculatedResults.interrelacion}`,
                    resumen_dimensional: calculatedResults.resumenDimensional
                })
            });
            const encodedData = btoa(JSON.stringify(calculatedResults));
            navigate(`/resultado?data=${encodedData}`);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Error al enviar los datos:", err);
            setError("Hubo un problema al enviar sus resultados. Por favor intente más tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const getStepContent = () => {
        const startIndices = [0, 0, 7, 14, 21];
        const titles = ["", "Activación Fisiológica", "Activación Mental", "Activación Emocional", "Regulación Interna"];
        const actualStep = step;
        const startIndex = startIndices[actualStep];

        return (
            <div className="animate-fade-in-up">
                <h3 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--primary)' }}>{titles[actualStep]}</h3>
                <div className="space-y-6">
                    {questions.slice(startIndex, startIndex + 7).map((q, idx) => (
                        <QuestionRow key={startIndex + idx} index={startIndex + idx} question={q} answers={answers} setAnswer={handleAnswerChange} />
                    ))}
                </div>
            </div>
        );
    };

    const progressPercent = step > 0 ? ((step) / 4) * 100 : 0;

    return (
        <div className="rfai-test-layout">
            <style dangerouslySetInnerHTML={{
                __html: `
                .rfai-test-layout {
                  --primary:#0f97b9;
                  --primary-dark:#0a7f9a;
                  --primary-soft:#eaf7fb;
                  --text:#22343a;
                  --text-soft:#667982;
                  --line:#dfecef;
                  --bg:#ffffff;
                  --bg-soft:#f6fbfc;
                  --shadow:0 18px 40px rgba(16, 69, 82, 0.08);
                  --radius-xl:32px;
                  --radius-lg:24px;
                  --radius-md:18px;
                  --max:1180px;

                  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                  background:linear-gradient(180deg, #fbfeff 0%, #f4f9fa 100%);
                  color:var(--text);
                  line-height:1.55;
                  min-height: 100vh;
                }

                .rfai-test-layout a {text-decoration:none;color:inherit;}
                .rfai-test-layout img {display:block;max-width:100%;object-fit:cover;}

                .rfai-test-layout .container {
                  width:min(92%, var(--max));
                  margin:0 auto;
                }

                /* topbar */
                .rfai-test-layout .topbar {
                  position:sticky;
                  top:0;
                  z-index:999;
                  background:rgba(255,255,255,.92);
                  backdrop-filter: blur(14px);
                  border-bottom:1px solid rgba(34,52,58,.06);
                }

                .rfai-test-layout header {
                  min-height:84px;
                  display:flex;
                  align-items:center;
                  justify-content:space-between;
                  gap:20px;
                }

                .rfai-test-layout .brand {
                  display:flex;
                  align-items:center;
                  gap:14px;
                  min-width:0;
                }

                .rfai-test-layout .brand img {
                  width:54px;
                  height:54px;
                  object-fit:contain;
                  flex-shrink:0;
                }

                .rfai-test-layout .brand-copy strong {
                  display:block;
                  color:var(--text);
                  font-size:1rem;
                  line-height:1.05;
                }

                .rfai-test-layout .brand-copy span {
                  display:block;
                  margin-top:3px;
                  color:var(--text-soft);
                  font-size:.84rem;
                }

                .rfai-test-layout nav {
                  display:flex;
                  align-items:center;
                  gap:26px;
                }

                .rfai-test-layout nav a {
                  color:var(--text-soft);
                  font-size:.95rem;
                  transition:.2s ease;
                }

                .rfai-test-layout nav a:hover {
                  color:var(--primary-dark);
                }

                .rfai-test-layout .header-actions {
                  display:flex;
                  align-items:center;
                  gap:12px;
                }

                .rfai-test-layout .btn {
                  display:inline-flex;
                  align-items:center;
                  justify-content:center;
                  min-height:50px;
                  padding:0 22px;
                  border-radius:999px;
                  font-weight:600;
                  font-size:.95rem;
                  transition:.2s ease;
                  border:1px solid transparent;
                  cursor:pointer;
                  white-space:nowrap;
                }

                .rfai-test-layout .btn-primary {
                  background:linear-gradient(135deg, var(--primary), var(--primary-dark));
                  color:#fff;
                  box-shadow:0 12px 26px rgba(15,151,185,.22);
                }
                .rfai-test-layout .btn-primary:hover { transform:translateY(-1px); }
                .rfai-test-layout .btn-outline { background: #fff; border: 1px solid var(--line); color: var(--text); }
                .rfai-test-layout .btn-outline:hover { background: var(--bg-soft); }

                /* hero Step 0 */
                .rfai-test-layout .hero-step0 {
                  padding:80px 0 40px;
                  text-align:center;
                }
                .rfai-test-layout .hero-step0 h1 {
                  font-size:2.5rem;
                  margin-bottom:14px;
                  letter-spacing:-.05em;
                }
                .rfai-test-layout .hero-step0 p {
                  color:var(--text-soft);
                  max-width:600px;
                  margin:auto;
                }

                .rfai-test-layout .card-step0 {
                  background:white;
                  padding:40px;
                  border-radius:24px;
                  box-shadow:var(--shadow);
                  max-width:520px;
                  margin:40px auto;
                  border: 1px solid var(--line);
                }

                .rfai-test-layout .field {
                  margin-bottom:20px;
                  text-align:left;
                }
                .rfai-test-layout .field label {
                  display:block;
                  font-size:0.9rem;
                  margin-bottom:6px;
                  color:var(--text-soft);
                }
                .rfai-test-layout .field input {
                  width:100%;
                  padding:14px;
                  border-radius:10px;
                  border:1px solid var(--line);
                  font-size:1rem;
                  background: var(--bg-soft);
                  font-family: inherit;
                  color: var(--text);
                }
                .rfai-test-layout .field input:focus {
                  outline: none;
                  border-color: var(--primary);
                  background: #fff;
                }

                /* hero Step 1+ */
                .rfai-test-layout .hero-step1 {
                  padding:30px 0 20px;
                  background:
                    radial-gradient(circle at top left, rgba(15,151,185,.08), transparent 24%),
                    linear-gradient(180deg, #ffffff 0%, #f9fcfd 100%);
                  border-bottom:1px solid var(--line);
                }
                .rfai-test-layout .hero-wrap {
                  display:flex;
                  justify-content:space-between;
                  align-items:flex-end;
                  gap:24px;
                  flex-wrap:wrap;
                }
                .rfai-test-layout .eyebrow {
                  display:inline-flex;
                  align-items:center;
                  gap:8px;
                  padding:8px 14px;
                  border-radius:999px;
                  background:var(--primary-soft);
                  color:var(--primary-dark);
                  font-size:.88rem;
                  font-weight:700;
                  margin-bottom:14px;
                }
                .rfai-test-layout .hero-step1 h1 {
                  font-size:clamp(2rem, 5vw, 3.3rem);
                  line-height:.97;
                  letter-spacing:-.05em;
                  margin-bottom:10px;
                }
                .rfai-test-layout .hero-step1 p {
                  color:var(--text-soft);
                  font-size:1rem;
                  max-width:58ch;
                }
                .rfai-test-layout .hero-side {
                  display:flex;
                  gap:12px;
                  flex-wrap:wrap;
                }
                .rfai-test-layout .chip {
                  background:#fff;
                  border:1px solid var(--line);
                  border-radius:999px;
                  padding:12px 16px;
                  color:var(--primary-dark);
                  font-size:.92rem;
                  font-weight:600;
                  box-shadow:var(--shadow);
                }

                .rfai-test-layout .section {
                  padding:28px 0 90px;
                }

                .rfai-test-layout .test-frame {
                  background:#fff;
                  border:1px solid var(--line);
                  border-radius:32px;
                  box-shadow:var(--shadow);
                  overflow:hidden;
                }

                .rfai-test-layout .test-frame-top {
                  padding:20px 24px;
                  border-bottom:1px solid var(--line);
                  background:linear-gradient(180deg, #ffffff 0%, #f9fcfd 100%);
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  gap:18px;
                  flex-wrap:wrap;
                }

                .rfai-test-layout .test-frame-top h2 {
                  font-size:1.2rem;
                  margin-bottom:4px;
                }

                .rfai-test-layout .test-frame-top p {
                  color:var(--text-soft);
                  font-size:.94rem;
                }

                .rfai-test-layout .test-progress {
                  min-width:220px;
                  flex:1;
                  max-width:320px;
                }

                .rfai-test-layout .progress-label {
                  display:flex;
                  justify-content:space-between;
                  font-size:.9rem;
                  color:var(--text-soft);
                  margin-bottom:8px;
                }

                .rfai-test-layout .progress-bar {
                  width:100%;
                  height:10px;
                  border-radius:999px;
                  background:#eaf3f5;
                  overflow:hidden;
                }

                .rfai-test-layout .progress-fill {
                  height:100%;
                  background:linear-gradient(135deg, var(--primary), var(--primary-dark));
                  border-radius:999px;
                  transition: width 0.3s ease;
                }

                .rfai-test-layout .test-content {
                  padding:0;
                }

                .rfai-test-layout .test-mount {
                  min-height:300px;
                  background:#fff;
                  padding: 24px;
                }

                .rfai-test-layout .frame-note {
                  padding:16px 24px 24px;
                  border-top:1px solid var(--line);
                  color:var(--text-soft);
                  font-size:.92rem;
                  background:#fcfeff;
                }

                .rfai-test-layout footer {
                  padding:28px 0 40px;
                  border-top:1px solid rgba(34,52,58,.06);
                  background:#fff;
                }

                .rfai-test-layout .footer-row {
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  gap:18px;
                  flex-wrap:wrap;
                }

                .rfai-test-layout .footer-links {
                  display:flex;
                  gap:16px;
                  flex-wrap:wrap;
                }

                .rfai-test-layout .error-box {
                  margin: 20px 0;
                  padding: 14px;
                  border-radius: 12px;
                  background: #fee2e2;
                  color: #991b1b;
                  border: 1px solid #fecaca;
                  text-align: center;
                  font-size: 14px;
                }

                @media (max-width: 760px){
                  .rfai-test-layout nav { display:none; }
                  .rfai-test-layout .header-actions { flex-direction:column; align-items:stretch; }
                  .rfai-test-layout .brand-copy span { display:none; }
                  .rfai-test-layout .test-frame-top, .rfai-test-layout .frame-note { padding-left:20px; padding-right:20px; }
                  .rfai-test-layout .test-mount { padding: 16px; }
                  .rfai-test-layout .test-controls { flex-direction: column-reverse; gap: 12px; }
                  .rfai-test-layout .test-controls button { width: 100%; }
                }
            `}} />

            <div className="topbar">
                <header className="container">
                    <a href="#/" className="brand">
                        <img src={logoImg} alt="Logo Centro Clínico Equilibrar" />
                        <div className="brand-copy">
                            <strong>Centro Clínico Equilibrar</strong>
                            <span>Psicología clínica y modelo RFAI</span>
                        </div>
                    </a>

                    <nav>
                        <a href="#/">Inicio</a>
                        <a href="#/rfai">Conocer RFAI</a>
                    </nav>

                    {step === 0 && (
                        <div className="header-actions">
                            <button className="btn btn-outline" onClick={() => { document.getElementById("form-inicio")?.scrollIntoView({ behavior: "smooth" }) }}>Comenzar ahora</button>
                        </div>
                    )}
                </header>
            </div>

            <main>
                {step === 0 ? (
                    <section className="hero-step0">
                        <div className="container">
                            <h1>Comienza el Test RFAI</h1>
                            <p>
                                Antes de comenzar necesitamos registrar tu nombre y correo para poder enviarte
                                el resultado de tu evaluación.
                            </p>

                            <div className="card-step0" id="form-inicio">
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                    <div className="field">
                                        <label>Nombre completo</label>
                                        <input type="text" name="name" value={userInfo.name} onChange={handleUserInfoChange} required placeholder="Ej. Juan Pérez" />
                                    </div>

                                    <div className="field">
                                        <label>Correo electrónico</label>
                                        <input type="email" name="email" value={userInfo.email} onChange={handleUserInfoChange} required placeholder="ejemplo@correo.com" />
                                    </div>

                                    {error && <div className="error-box">{error}</div>}

                                    <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "10px" }}>
                                        Comenzar test
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="hero-step1">
                            <div className="container hero-wrap">
                                <div>
                                    <div className="eyebrow">Paso {step} de 4</div>
                                    <h1>Ingresa a responder</h1>
                                    <p>Esta página es la entrada directa al test. Aquí comienza tu evaluación.</p>
                                </div>

                                <div className="hero-side">
                                    <div className="chip">Breve</div>
                                    <div className="chip">Directo</div>
                                    <div className="chip">Orientador</div>
                                </div>
                            </div>
                        </section>

                        <section className="section">
                            <div className="container">
                                <div className="test-frame">
                                    <div className="test-frame-top">
                                        <div>
                                            <h2>Test RFAI</h2>
                                            <p>Responde las preguntas y avanza hasta completar tu evaluación.</p>
                                        </div>

                                        <div className="test-progress">
                                            <div className="progress-label">
                                                <span>Progreso</span>
                                                <span>{Math.round(progressPercent)}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="test-content">
                                        <div className="test-mount" id="rfai-test-app">
                                            {getStepContent()}

                                            {error && <div className="error-box">{error}</div>}

                                            {/* Controles de Navegación */}
                                            <div className="test-controls mt-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                                                <button
                                                    onClick={prevStep}
                                                    disabled={isSubmitting}
                                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all disabled:opacity-50"
                                                >
                                                    <ArrowLeft size={16} /> Atrás
                                                </button>

                                                {step < 4 ? (
                                                    <button
                                                        onClick={nextStep}
                                                        className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-bold uppercase tracking-widest text-xs"
                                                    >
                                                        Continuar <ArrowRight size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={handleSubmit}
                                                        disabled={isSubmitting}
                                                        className="btn btn-primary"
                                                        style={{ height: "auto", padding: "12px 24px", minHeight: "46px" }}
                                                    >
                                                        {isSubmitting ? 'Procesando...' : 'Finalizar y ver resultado'}
                                                        {!isSubmitting && <CheckCircle2 size={16} className="ml-2" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="frame-note">
                                        Esta evaluación no reemplaza una valoración clínica completa. Funciona como una lectura inicial orientadora.
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <footer>
                <div className="container footer-row">
                    <p>© 2026 Centro Clínico Equilibrar</p>
                    <div className="footer-links">
                        <a href="#/">Inicio</a>
                        <a href="#/rfai">Modelo RFAI</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Componente individual de pregunta optimizado para móvil (Radio UI botones grandes)
interface QuestionRowProps {
    index: number;
    question: string;
    answers: number[];
    setAnswer: (i: number, v: number) => void;
}

const QuestionRow: React.FC<QuestionRowProps> = ({ index, question, answers, setAnswer }) => {
    return (
        <div className="pt-8 first:pt-4">
            <p className="font-medium text-slate-700 mb-5 text-base md:text-lg leading-snug">{question}</p>
            {/* Container flex wrap para mejor fluidez en móvil */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3">
                {scaleOptions.map((opt) => {
                    const isSelected = answers[index] === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setAnswer(index, opt.value)}
                            className={`
                flex-1 min-w-[30%] md:min-w-0 flex flex-col items-center justify-center py-3 px-1 md:py-4 rounded-xl border-2 transition-all active:scale-95
                ${isSelected
                                    ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-brand-primary/30 hover:bg-brand-light/20'}
              `}
                        >
                            <span className={`text-lg md:text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-700'}`}>{opt.value}</span>
                            <span className={`text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-center leading-tight ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                                {opt.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TestRFAI;

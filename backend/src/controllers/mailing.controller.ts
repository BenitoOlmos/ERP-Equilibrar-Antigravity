import { Request, Response } from 'express';
import { transporter } from '../utils/mailer';

// Envío de prueba a un solo correo
export const sendTestEmail = async (req: Request, res: Response): Promise<void> => {
    const { to, subject, htmlContent } = req.body;

    if (!to || !subject || !htmlContent) {
        res.status(400).json({ error: 'Faltan campos requeridos (to, subject, htmlContent).' });
        return;
    }

    try {
        await transporter.sendMail({
            from: `"Equilibrar" <${process.env.SMTP_USER || 'noreply@clinicaequilibrar.cl'}>`,
            to,
            subject: `[PRUEBA] ${subject}`,
            html: htmlContent
        });
        
        res.json({ message: 'Correo de prueba enviado con éxito.' });
    } catch (error: any) {
        console.error('Error enviando prueba:', error);
        res.status(500).json({ error: 'No se pudo enviar el correo de prueba', details: error.message });
    }
};

// Función útil para pausar la ejecución (evitar límites de SPAM/SMTP)
const retard = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Motor de envío masivo
export const sendBulkEmails = async (req: Request, res: Response): Promise<void> => {
    const { recipients, subject, htmlContent } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0 || !subject || !htmlContent) {
        res.status(400).json({ error: 'Datos incompletos. Se requiere lista de destinatarios válida, asunto y contenido.' });
        return;
    }

    // Responderemos rápidamente para que el Frontend inicie la barra de carga,
    // y el proceso de envío correrá de fondo (fire and forget pattern para evitar Timeout HTTP)
    res.json({ message: 'Lote de envíos encolado exitosamente. Los correos se enviarán progresivamente.', totalRecipients: recipients.length });

    // Ejecución en segundo plano Asíncrono
    const fromAddress = `"Equilibrar" <${process.env.SMTP_USER || 'noreply@clinicaequilibrar.cl'}>`;
    let successCount = 0;
    let failCount = 0;

    console.log(`[Mailing Engine] Iniciando ráfaga masiva para ${recipients.length} destinatarios...`);

    for (const recipient of recipients) {
        if (!recipient.email) continue;
        
        // Sencilla personalización (ej. Reemplazar {{nombre}} en el HTML si existe)
        // Se espera que el texto tenga {nombre} o similar. Podemos hacer un reemplazo de etiquetas simple:
        let personalizedHtml = htmlContent;
        if (recipient.name) {
            personalizedHtml = personalizedHtml.replace(/\{\{nombre\}\}/gi, recipient.name);
            personalizedHtml = personalizedHtml.replace(/\{\{name\}\}/gi, recipient.name);
        }

        try {
            await transporter.sendMail({
                from: fromAddress,
                to: recipient.email,
                subject,
                html: personalizedHtml
            });
            successCount++;
            
            // Pausa sutil de 800ms por correo para engañar a los filtros anti-spam de Gmail/SMTP básicos.
            // Para listas inmensas (ej 10,000) deberías usar SES. Pero para 500-1000, 800ms es prudente (1.2 emails / segundo).
            await retard(800);
        } catch (error) {
            console.error(`[Mailing Engine] Error mandando a ${recipient.email}:`, error);
            failCount++;
        }
    }

    console.log(`[Mailing Engine] Ráfaga completada. Éxito: ${successCount}, Fallos: ${failCount}`);
};

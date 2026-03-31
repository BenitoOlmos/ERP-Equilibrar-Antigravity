import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

interface RFAIMailParams {
    toEmail: string;
    userName: string;
    rfaProfile: string;
    rfaInterpretation: string;
    newPassword?: string;
}

export async function sendRFAIResultsMail(params: RFAIMailParams): Promise<boolean> {
    const { toEmail, userName, rfaProfile, rfaInterpretation, newPassword } = params;

    const credentialsSection = newPassword 
        ? `
        <div style="background-color: #f4f9fa; border-radius: 12px; padding: 20px; margin-top: 20px; border: 1px solid #dfecef;">
            <h3 style="color: #0c829e; margin-top: 0;">Tus Credenciales de Acceso Exclusivas</h3>
            <p style="color: #4a5a62; font-size: 14px;">Hemos creado automáticamente una cuenta clínica segura para ti donde podrás visualizar todo tu historial, agendar citas e ingresar a los programas de reestructuración.</p>
            <p><strong>URL de Acceso:</strong> <a href="https://login.clinicaequilibrar.cl/" style="color: #0f97b9; text-decoration: none; font-weight: bold;">https://login.clinicaequilibrar.cl/</a></p>
            <p><strong>Usuario / Correo:</strong> ${toEmail}</p>
            <p><strong>Contraseña Temporal:</strong> <code style="background-color: #eaf7fb; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #0c829e;">${newPassword}</code></p>
            <p style="font-size: 12px; color: #889ba5; margin-bottom: 0;">Puedes cambiar esta contraseña en los ajustes de tu cuenta privada.</p>
        </div>`
        : `
        <div style="background-color: #f4f9fa; border-radius: 12px; padding: 20px; margin-top: 20px; border: 1px solid #dfecef;">
            <p style="color: #4a5a62; font-size: 14px; margin-bottom: 0;">Nos figura que ya cuentas con un acceso a la plataforma. Puedes ver el historial de esta nueva evaluación RFAI ingresando directamente a <a href="https://login.clinicaequilibrar.cl/" style="color: #0f97b9; font-weight: bold;">tu cuenta</a> con tu contraseña habitual.</p>
        </div>`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resultados RFAI - Clínica Equilibrar</title>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fbfeff; margin: 0; padding: 0; color: #22343a; }
            .container { max-width: 600px; margin: 40px auto; background-color: white; border-radius: 24px; box-shadow: 0 12px 30px rgba(16, 69, 82, 0.08); overflow: hidden; border: 1px solid #dfecef; }
            .header { background: linear-gradient(135deg, #0f97b9, #0a7f9a); padding: 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; }
            .content p { line-height: 1.6; font-size: 15px; color: #4a5a62; }
            .result-box { margin-top: 30px; padding: 20px; border-left: 4px solid #0f97b9; background-color: #eaf7fb; border-radius: 0 12px 12px 0; }
            .result-box h2 { color: #0c829e; margin-top: 0; font-size: 18px; margin-bottom: 10px; }
            .result-box p { color: #22343a; margin-bottom: 0; font-weight: 600; }
            .btn-cta { display: inline-block; background: linear-gradient(135deg, #0f97b9, #0a7f9a); color: white; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: bold; margin-top: 30px; text-align: center; box-shadow: 0 8px 16px rgba(15, 151, 185, 0.2); }
            .footer { padding: 20px; background-color: #f6fbfc; text-align: center; font-size: 12px; color: #889ba5; border-top: 1px solid #dfecef; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Resultados de tu Diagnóstico RFAI</h1>
            </div>
            <div class="content">
                <p>Hola <strong>${userName}</strong>,</p>
                <p>Gracias por completar la autoevaluación clínica integral. El Modelo de Reactividad Fisiológica, Activación Mental y Emocional ha procesado tus resultados basados en tus respuestas, obteniendo un acercamiento preciso a tu estado actual.</p>
                
                <div class="result-box">
                    <h2>Tu Perfil Clínico</h2>
                    <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${rfaProfile.split('|')[0].trim()}</p>
                    <p style="font-weight: normal; font-size: 14px; margin-top: 5px;">${rfaInterpretation}</p>
                </div>

                ${credentialsSection}

                <div style="text-align: center;">
                    <a href="https://login.clinicaequilibrar.cl/" class="btn-cta">Acceder a Mi Cuenta</a>
                </div>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Centro Clínico Equilibrar</p>
                <p>Este es un correo automático. Por favor, no respondas a esta dirección.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('[Mailer] SMTP credentials not fully configured in environment variables.');
        }

        await transporter.sendMail({
            from: `"Clínica Equilibrar" <${process.env.SMTP_USER || 'noreply@clinicaequilibrar.cl'}>`,
            to: toEmail,
            subject: 'Tus Resultados Diagnósticos RFAI y Acceso',
            html: htmlContent
        });
        return true;
    } catch (error) {
        console.error('Error sending RFAI result email:', error);
        return false;
    }
}

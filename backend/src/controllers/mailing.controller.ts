import { Request, Response } from 'express';
import { transporter } from '../utils/mailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// ==========================================
// PERSISTENT MAILING CRM CRUD
// ==========================================

export const getGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const groups = await prisma.mailingGroup.findMany({
            include: {
                _count: {
                    select: { contacts: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(groups);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch groups', details: error.message });
    }
};

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, color } = req.body;
        if (!name) {
            res.status(400).json({ error: 'El nombre del grupo es obligatorio.' });
            return;
        }

        const group = await prisma.mailingGroup.create({
            data: {
                name,
                color: color || 'bg-indigo-50 text-indigo-600'
            }
        });

        res.json(group);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create group', details: error.message });
    }
};

// Importar lista de correos y asignarlos a un grupo si se especifica
export const importContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { contacts, groupId } = req.body; // contacts: {email, name}[]

        if (!Array.isArray(contacts) || contacts.length === 0) {
            res.status(400).json({ error: 'Petición inválida, sin contactos.' });
            return;
        }

        let importedCount = 0;

        for (const c of contacts) {
            // Upsert the contact
            const contact = await prisma.mailingContact.upsert({
                where: { email: c.email },
                update: {
                    name: c.name || undefined, // Update name if provided, else keep existing
                },
                create: {
                    email: c.email,
                    name: c.name
                }
            });

            // If a group is provided, link the contact to the group
            if (groupId) {
                await prisma.mailingContact.update({
                    where: { id: contact.id },
                    data: {
                        groups: {
                            connect: { id: groupId }
                        }
                    }
                });
            }
            
            importedCount++;
        }

        res.json({ message: 'Importación exitosa.', count: importedCount });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to import contacts', details: error.message });
    }
};

export const getContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.query;

        const filter = groupId ? {
            groups: {
                some: { id: String(groupId) }
            }
        } : {};

        const contacts = await prisma.mailingContact.findMany({
            where: filter,
            include: {
                groups: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(contacts);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch contacts', details: error.message });
    }
};

export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.mailingGroup.delete({
            where: { id }
        });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete group', details: error.message });
    }
};

export const updateContactGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { groupIds } = req.body; // array of strings
        
        if (!Array.isArray(groupIds)) {
            res.status(400).json({ error: 'groupIds must be an array' });
            return;
        }

        const contact = await prisma.mailingContact.update({
            where: { id },
            data: {
                groups: {
                    set: groupIds.map((gId: string) => ({ id: gId }))
                }
            },
            include: { groups: true }
        });

        res.json(contact);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update contact groups', details: error.message });
    }
};

export const getTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
        let templates = await prisma.mailingTemplate.findMany({
            orderBy: { createdAt: 'asc' }
        });

        // Auto-Seed if empty
        if (templates.length === 0) {
            const defaultTemplates = [
                {
                    title: "Recordatorio Test", description: "Invitación a completar evaluación emocional.", iconName: "PenTool", colorClass: "bg-amber-50 text-amber-600",
                    subject: "🧠 ¿Cómo estás hoy? Completa tu test de bienestar, {{nombre}}",
                    content: `<img src="https://placehold.co/600x200/f8fafc/94a3b8?text=Reemplazar+Imagen+Hero" alt="Hero" width="100%" /> 
<h2 style="color: #4f46e5;">Hola {{nombre}},</h2>
<p>Hace unos días te enviamos una invitación para realizar tu test de bienestar emocional y aún no hemos recibido tu respuesta.</p>
<p>Conocer tu estado actual es el primer paso para una vida plena. El test solo toma 5 minutos.</p>
<br/>
<p style="text-align: center;">
  <a href="https://tusitio.com/test" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold;">Realizar Test Ahora</a>
</p>
<br/>
<p style="color: #64748b; font-style: italic;">"Cuidar de tu mente es la mejor inversión que puedes hacer."</p>
<p>Atentamente,<br><strong>Tu equipo de Bienestar</strong></p>`
                },
                {
                    title: "Contratar Servicio", description: "Propuesta de valor y planes premium.", iconName: "PenTool", colorClass: "bg-emerald-50 text-emerald-600",
                    subject: "🚀 {{nombre}}, impulsa tu crecimiento con nuestros planes",
                    content: `<h2 style="color: #059669;">Tu evolución no tiene límites</h2>
<p>Hola {{nombre}}, hemos notado tu compromiso con tu crecimiento personal. Por eso, queremos invitarte a dar el siguiente paso.</p>
<br/>
<p><strong>Nuestros Planes Premium:</strong> Accede a sesiones personalizadas y herramientas exclusivas para potenciar tu proceso.</p>
<br/>
<p style="text-align: center;">
  <a href="https://tusitio.com/planes" style="background-color: #166534; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold;">Ver Planes Disponibles</a>
</p>
<br/>
<p>Estamos listos para acompañarte en este viaje. ¿Hablamos?</p>`
                },
                {
                    title: "Escuchar Podcast", description: "Novedades y contenido en audio.", iconName: "PenTool", colorClass: "bg-indigo-50 text-indigo-600",
                    subject: "🎧 Nuevo Episodio: Superando la ansiedad con {{nombre}}",
                    content: `<img src="https://placehold.co/600x200/1e293b/ffffff?text=Nuevo+Episodio" alt="Podcast Hero" width="100%" /> 
<h2 style="color: #1e293b; text-align: center;">¡Nuevo Podcast Disponible!</h2>
<p style="text-align: center;">En el episodio de hoy hablamos sobre herramientas prácticas para gestionar el estrés diario. ¡Algo que te interesará mucho, {{nombre}}!</p>
<br/>
<p style="text-align: center;">
  <a href="https://spotify.com/podcast" style="background-color: #1DB954; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold;">ESCUCHAR EN SPOTIFY</a>
</p>
<br/>
<p style="text-align: center; color: #94a3b8;">También disponible en Apple Podcasts y YouTube.</p>`
                }
            ];

            for (const t of defaultTemplates) {
                await prisma.mailingTemplate.create({ data: t });
            }
            templates = await prisma.mailingTemplate.findMany({ orderBy: { createdAt: 'asc' } });
        }

        res.json(templates);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
    }
};

export const saveTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, subject, content, iconName, colorClass } = req.body;
        const template = await prisma.mailingTemplate.create({
            data: { title, description, subject, content, iconName, colorClass }
        });
        res.json(template);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to save template', details: error.message });
    }
};

export const updateTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, subject, content, iconName, colorClass } = req.body;
        const template = await prisma.mailingTemplate.update({
            where: { id },
            data: { title, description, subject, content, iconName, colorClass }
        });
        res.json(template);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update template', details: error.message });
    }
};

export const deleteTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.mailingTemplate.delete({ where: { id } });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete template', details: error.message });
    }
};

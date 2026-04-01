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

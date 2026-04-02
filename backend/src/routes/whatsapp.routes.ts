import { Router, Request, Response } from 'express';
import { processWhatsAppMessage } from '../services/whatsappAi.service';
import { PrismaClient } from "@prisma/client";
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();

// Token de verificación configurado en el Dashboard de Meta for Developers
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'equilibrar_meta_token_secreto_2024';
const META_ACCESS_TOKEN = process.env.META_WHATSAPP_TOKEN || '';
const META_PHONE_ID = process.env.META_WHATSAPP_PHONE_ID || '';

/**
 * Endpoint GET para la Verificación (Suscripción) obligatoria del Webhook de Meta.
 */
router.get('/webhook', (req: Request, res: Response): any => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
        console.log('✅ WEBHOOK DE META VERIFICADO CORRECTAMENTE');
        return res.status(200).send(challenge);
    } else {
        return res.sendStatus(403);
    }
});

/**
 * Endpoint POST donde Meta WhatsApp inyectará los mensajes que manden los pacientes.
 */
router.post('/webhook', async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        
        // Comprobar que sea evento de Meta WhatsApp
        if (body.object === 'whatsapp_business_account') {
            
            for (const entry of body.entry) {
                const changes = entry.changes;
                
                for (const change of changes) {
                    if (change.value && change.value.messages) {
                        const messageData = change.value.messages[0];
                        const contactData = change.value.contacts?.[0];
                        
                        const phone = messageData.from; // Número del paciente
                        const text = messageData.text?.body;
                        const userName = contactData?.profile?.name;
                        
                        // Si recibimos texto nativo
                        if (text) {
                            console.log(`[WHATSAPP ENTRANTE] ${phone}: ${text}`);
                            
                            // RESPONDER INMEDIATAMENTE HTTP 200 A META PARA EVITAR QUE NOS RE-ENVIEN EL POST REPETIDAMENTE (Timeout)
                            res.sendStatus(200);

                            // Lógica Asíncrona (Background AI)
                            try {
                                const botResponse = await processWhatsAppMessage(phone, text, userName);
                                
                                // Si hay bot response (no está en modo humano)
                                if (botResponse && META_ACCESS_TOKEN && META_PHONE_ID) {
                                    await axios.post(`https://graph.facebook.com/v19.0/${META_PHONE_ID}/messages`, {
                                        messaging_product: "whatsapp",
                                        to: phone,
                                        type: "text",
                                        text: { body: botResponse }
                                    }, {
                                        headers: {
                                            "Authorization": `Bearer ${META_ACCESS_TOKEN}`,
                                            "Content-Type": "application/json"
                                        }
                                    });
                                }
                            } catch (e) {
                                console.error("Error asíncrono respondiendo a WS", e);
                            }
                            return; // Terminamos ya que procesamos el mensaje y enviamos 200 manualmente
                        }
                    }
                }
            }
        }
        return res.sendStatus(200);

    } catch (error) {
        console.error("Critical Webhook Error:", error);
        return res.sendStatus(500);
    }
});

/**
 * Endpoints Auxiliares para el Dashboard de la Coordinadora
 */
router.get('/leads', async (req: Request, res: Response) => {
    try {
        const leads = await prisma.whatsAppLead.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: "No se pudieron obtener los leads de whatsapp" });
    }
});

router.get('/leads/:id/messages', async (req: Request, res: Response) => {
    try {
        const history = await prisma.whatsAppMessage.findMany({
            where: { leadId: req.params.id },
            orderBy: { createdAt: 'asc' }
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Error de historial" });
    }
});

router.put('/leads/:id/status', async (req: Request, res: Response) => {
    try {
        const lead = await prisma.whatsAppLead.update({
            where: { id: req.params.id },
            data: { status: req.body.status }
        });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: "Error actualizando estado" });
    }
});

// Envia mensaje manual desde el panel
router.post('/leads/:id/send', async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const lead = await prisma.whatsAppLead.findUnique({ where: { id: req.params.id } });
        if(!lead) throw new Error("No lead");

        // Guarda localmente
        const savedMessage = await prisma.whatsAppMessage.create({
            data: { leadId: lead.id, content: text, sender: 'ADMIN' }
        });

        // Envia por meta
        if (META_ACCESS_TOKEN && META_PHONE_ID) {
            await axios.post(`https://graph.facebook.com/v19.0/${META_PHONE_ID}/messages`, {
                messaging_product: "whatsapp",
                to: lead.phone,
                type: "text",
                text: { body: text }
            }, {
                headers: { "Authorization": `Bearer ${META_ACCESS_TOKEN}` }
            });
        }
        res.json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: "Error enviando manual" });
    }
});

export default router;

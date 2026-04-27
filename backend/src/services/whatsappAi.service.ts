import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";


// Initialize the Google Vertex AI client using the service account context
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT || "practical-mason-448013-k8",
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1"
});

export const processWhatsAppMessage = async (phone: string, messageContent: string, userName?: string) => {
    // 1. Encuentra o crea el Lead en el ERP
    let lead = await prisma.whatsAppLead.findUnique({ where: { phone } });
    
    if (!lead) {
        lead = await prisma.whatsAppLead.create({
            data: { phone, name: userName || undefined, status: 'BOT' }
        });
    }

    // Guardar mensaje entrante
    await prisma.whatsAppMessage.create({
        data: {
            leadId: lead.id,
            content: messageContent,
            sender: 'USER'
        }
    });

    // Increment unreadCount
    await (prisma as any).whatsAppLead.update({
        where: { id: lead.id },
        data: { unreadCount: { increment: 1 } }
    });

    // Si la coordinadora manual activó la pausa (humano), no respondemos con IA
    if (lead.status === 'HUMAN') {
        return;
    }

    // 2. Extraer el historial de la DB
    const history = await prisma.whatsAppMessage.findMany({
        where: { leadId: lead.id },
        orderBy: { createdAt: 'asc' },
        take: 20
    });

    const aiHistoryTokens = history.map(h => `${h.sender}: ${h.content}`).join("\n");

    // 3. Crear el System Prompt del Coordinador
    const systemPrompt = `
Eres Violeta, la coordinadora clínica de admisiones por WhatsApp del centro de psicología y medicina integrativa "Equilibrar".
Eres cálida, humana, empática y muy eficiente.
Tu objetivo es ayudar al paciente, perfilar sus necesidades clínicas y extraer amigablemente información valiosa para ingresarlo al ERP.

INFORMACIÓN DEL ERP A EXTRAER (de manera implícita durante la charla):
Si durante la conversación el usuario menciona:
1. Su nombre completo.
2. Si tiene ISAPRE (o FONASA).
3. Rango de Horas en las que busca atención.
4. Dudas de postventa (boletas, reembolsos, licencias, facturas).
5. Su email.

DEBES devolver esta data extraída en una estructura JSON interna llamada DATA_EXTRACTION al final de tu mensaje, únicamente si detectas información nueva.

Formato requerido si encuentras data nueva:
[Tu respuesta empática y normal al paciente aquí]
---DATA_EXTRACTION---
{"name": "...", "isapre": "...", "requestedHours": "...", "email": "...", "postSalesNeed": "..."}

Si no extraes data nueva, solo responde de manera normal. ¡Nunca le envíes el JSON crudo al cliente visiblemente arriba de tu charla, al cliente solo háblale!`.trim();

    // 4. Invocar a Vertex AI (Gemini Flash para máxima velocidad en Chat en tiempo real)
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${systemPrompt}\n\nHistorial de la Conversación:\n${aiHistoryTokens}\n\nBOT:`,
        });

        const fullResponse = response.text || "";
        let chatReply = fullResponse;
        let extractedData: any = {};

        // 5. Analizar posible Structured Data extraída
        if (fullResponse.includes("---DATA_EXTRACTION---")) {
             const parts = fullResponse.split("---DATA_EXTRACTION---");
             chatReply = parts[0].trim();
             try {
                extractedData = JSON.parse(parts[1].trim());
             } catch(e) {
                console.error("AI returned malformed JSON extraction", e);
             }
        }

        // Modifica la BD con la data parseada si hay algo útil
        if (Object.keys(extractedData).length > 0) {
            await prisma.whatsAppLead.update({
                where: { id: lead.id },
                data: extractedData
            });
        }

        // 6. Guardar respuesta del BOT en el Historial del ERP
        await prisma.whatsAppMessage.create({
            data: {
                leadId: lead.id,
                content: chatReply,
                sender: 'BOT'
            }
        });

        // 7. Retornamos la respuesta calculada para que se la enviemos por Meta
        return chatReply;

    } catch (e) {
        console.error("Critical failure calling Vertex AI for WhatsApp", e);
        return "Disculpa, estoy experimentando intermitencias técnicas. Un humano te contactará a la brevedad.";
    }
};

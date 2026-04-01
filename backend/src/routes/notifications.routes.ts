import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/notifications/:userId
// Devuelve el conteo de no leídos para la barra lateral
router.get('/:userId', async (req: any, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, lastViewedRFAIAt: true, lastViewedBitacorasAt: true, lastViewedChatAt: true }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        let rfaiCount = 0;
        let bitacoraCount = 0;
        let chatCount = 0;

        // 1. CHAT COUNT (Bandeja de entrada no leída)
        // Todos los roles pueden ver sus mensajes no leídos
        chatCount = await prisma.message.count({
            where: {
                receiverId: userId,
                read: false,
                ...(user.lastViewedChatAt ? { createdAt: { gt: user.lastViewedChatAt } } : {})
            }
        });

        // 2. RFAI COUNT
        // Solo Super Admin, Administrador y Coordinador ven notificaciones globales de RFAI
        const adminRoles = ['Super Admin', 'Administrador', 'Coordinador'];
        if (adminRoles.includes(user.role)) {
            rfaiCount = await prisma.diagnosticResult.count({
                where: {
                    ...(user.lastViewedRFAIAt ? { createdAt: { gt: user.lastViewedRFAIAt } } : {})
                }
            });
        }

        // 3. BITACORAS COUNT
        if (adminRoles.includes(user.role)) {
            // Administrativos ven TODAS las bitácoras nuevas
            bitacoraCount = await prisma.bitacoraLog.count({
                where: {
                    ...(user.lastViewedBitacorasAt ? { timestamp: { gt: user.lastViewedBitacorasAt } } : {})
                }
            });
        } else if (user.role === 'Especialista') {
            // Especialistas ven solo las bitácoras de los clientes con los que tienen o han tenido cita
            const clientsQuery = await prisma.appointment.findMany({
                where: { specialistId: userId },
                select: { clientId: true },
                distinct: ['clientId']
            });
            const clientIds = clientsQuery.map(c => c.clientId).filter(Boolean) as string[];

            if (clientIds.length > 0) {
                bitacoraCount = await prisma.bitacoraLog.count({
                    where: {
                        userId: { in: clientIds },
                        ...(user.lastViewedBitacorasAt ? { timestamp: { gt: user.lastViewedBitacorasAt } } : {})
                    }
                });
            }
        }

        res.json({
            rfaiCount,
            bitacoraCount,
            chatCount
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /api/notifications/:userId/viewed
// Actualiza la marca de tiempo de la última vez que el usuario vio una sección
router.post('/:userId/viewed', async (req: any, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // section can be 'RFAI', 'BITACORAS', 'CHAT'
        const { section } = req.body; 
        
        const updateData: any = {};
        const now = new Date();

        if (section === 'RFAI') updateData.lastViewedRFAIAt = now;
        if (section === 'BITACORAS') updateData.lastViewedBitacorasAt = now;
        if (section === 'CHAT') {
            updateData.lastViewedChatAt = now;
            // Also explicitly mark direct messages as read
            await prisma.message.updateMany({
                where: { receiverId: userId, read: false },
                data: { read: true }
            });
        }

        if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
                where: { id: userId },
                data: updateData
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating notification viewed status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;

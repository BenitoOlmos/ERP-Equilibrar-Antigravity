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
        let whatsappCount = 0;

        // 1. CHAT COUNT (Bandeja de entrada no leída)
        chatCount = await prisma.message.count({
            where: {
                receiverId: userId,
                read: false
            }
        });

        // 2. WHATSAPP COUNT (Cualquier administrativo puede verlo, o podemos limitarlo)
        const adminRoles = ['Super Admin', 'Administrador', 'Coordinador'];
        if (adminRoles.includes(user.role)) {
            const leadsObj = await (prisma.whatsAppLead as any).aggregate({
                _sum: { unreadCount: true }
            });
            whatsappCount = leadsObj._sum.unreadCount || 0;
        }

        // 3. RFAI COUNT
        if (adminRoles.includes(user.role)) {
            rfaiCount = await (prisma.diagnosticResult as any).count({
                where: { isRead: false }
            });
        }

        // 4. BITACORAS COUNT
        if (adminRoles.includes(user.role)) {
            bitacoraCount = await (prisma.bitacoraLog as any).count({
                where: { isRead: false }
            });
        } else if (user.role === 'Especialista') {
            const clientsQuery = await prisma.appointment.findMany({
                where: { specialistId: userId },
                select: { clientId: true },
                distinct: ['clientId']
            });
            const clientIds = clientsQuery.map(c => c.clientId).filter(Boolean) as string[];

            if (clientIds.length > 0) {
                bitacoraCount = await (prisma.bitacoraLog as any).count({
                    where: {
                        userId: { in: clientIds },
                        isRead: false
                    }
                });
            }
        }

        res.json({
            rfaiCount,
            bitacoraCount,
            chatCount,
            whatsappCount
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
        
        // Deprecated: Granular read flags now handle this on each module
        res.json({ success: true, message: "Use individual endpoints instead" });
    } catch (error) {
        console.error('Error updating notification viewed status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;

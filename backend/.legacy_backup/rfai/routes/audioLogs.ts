import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get audio logs for a specific user (Admin, Specialist, or the user themselves)
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUser: any = (req as any).user;

        // Security check: Only Admins/Specialists can view reports of other users
        if (requestingUser.userId !== userId && !['Admin', 'Especialista'].includes(requestingUser.role)) {
            return res.status(403).json({ error: 'No tienes permiso para ver estos registros' });
        }

        const logs = await prisma.audioLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' }
        });

        res.json(logs);
    } catch (error) {
        console.error('Error fetching audio logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new audio log (Must be the user themselves)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { userId, weekNumber, audioName, durationSeconds } = req.body;
        const requestingUser: any = (req as any).user;

        if (requestingUser.userId !== userId) {
            return res.status(403).json({ error: 'Solo el usuario dueño puede guardar sus registros' });
        }

        const log = await prisma.audioLog.create({
            data: {
                userId,
                weekNumber,
                audioName,
                durationSeconds
            }
        });

        res.status(201).json(log);
    } catch (error) {
        console.error('Error creating audio log:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

router.put('/:type', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { weekNumber } = req.body;
        const { type } = req.params;

        if (!userId || !weekNumber) {
            return res.status(400).json({ error: 'Missing userId or weekNumber' });
        }

        if (type !== 'reflection' && type !== 'exercise') {
            return res.status(400).json({ error: 'Invalid activity type' });
        }

        const updateData = type === 'reflection' 
            ? { reflectionReads: { increment: 1 } }
            : { exercisePlays: { increment: 1 } };

        const progress = await prisma.activityProgress.upsert({
            where: {
                userId_weekNumber: {
                    userId,
                    weekNumber: Number(weekNumber)
                }
            },
            update: updateData,
            create: {
                userId,
                weekNumber: Number(weekNumber),
                reflectionReads: type === 'reflection' ? 1 : 0,
                exercisePlays: type === 'exercise' ? 1 : 0,
            }
        });

        res.json(progress);
    } catch (error) {
        console.error('Activity tracking error:', error);
        res.status(500).json({ error: 'Failed to track activity' });
    }
});

router.put('/daily/checkin', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { weekNumber, dayIndex } = req.body;

        if (!userId || !weekNumber || dayIndex === undefined) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const existing = await prisma.activityProgress.findUnique({
            where: { userId_weekNumber: { userId, weekNumber: Number(weekNumber) } }
        });

        const completedDays = existing?.completedDays || [];
        if (!completedDays.includes(dayIndex)) {
            completedDays.push(dayIndex);
        }

        const progress = await prisma.activityProgress.upsert({
            where: { userId_weekNumber: { userId, weekNumber: Number(weekNumber) } },
            update: { completedDays },
            create: {
                userId,
                weekNumber: Number(weekNumber),
                completedDays: [dayIndex]
            }
        });

        res.json(progress);
    } catch (error) {
        console.error('Daily checkin error:', error);
        res.status(500).json({ error: 'Failed to complete daily checkin' });
    }
});

// Getter to fetch progressive data for standard dashboard injection if needed
router.get('/:userId/:weekNumber', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { userId, weekNumber } = req.params;
        const progress = await prisma.activityProgress.findUnique({
            where: {
                userId_weekNumber: {
                    userId,
                    weekNumber: Number(weekNumber)
                }
            }
        });
        res.json(progress || { reflectionReads: 0, exercisePlays: 0, completedDays: [] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activity progress' });
    }
});

export default router;

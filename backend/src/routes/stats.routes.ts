import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const specialists = await prisma.user.count({ where: { role: 'SPECIALIST', isActive: true } });
    const clients = await prisma.user.count({ where: { role: 'CLIENT', isActive: true } });
    
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);
    
    const appointmentsToday = await prisma.appointment.count({
      where: { date: { gte: startOfDay, lte: endOfDay } }
    });

    res.json({ specialists, clients, appointmentsToday });
  } catch(e) { res.status(500).json({error: 'DB error'})}
});

export default router;

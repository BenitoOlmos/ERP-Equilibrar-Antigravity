import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/track', async (req, res) => {
  try {
    const { userId, eventType, data } = req.body;
    const event = await prisma.event.create({
      data: { userId, eventType, data },
    });
    res.json(event);
  } catch (error) {
    console.error('Tracked event error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

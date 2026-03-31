import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const specialists = await prisma.user.count({ where: { role: 'Especialista', isActive: true } });
    const clients = await prisma.user.count({ where: { role: 'Cliente', isActive: true } });
    
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

router.post('/track-media', async (req, res) => {
  try {
    const { userId, weekNumber, mediaType, secondsWatched, serviceId } = req.body;
    
    // Convert duration to cumulative using an upsert or single log
    // For simplicity and resilience, we'll store atomic events.
    await prisma.event.create({
      data: {
        userId,
        eventType: mediaType === 'AUDIO' ? 'AUDIO_PROGRESS' : 'VIDEO_PROGRESS',
        data: { weekNumber, secondsWatched, serviceId }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking media:', error);
    res.status(500).json({ error: 'Database tracking error' });
  }
});

router.get('/metrics/:userId/:weekNumber/:serviceId', async (req, res) => {
  try {
    const { userId, weekNumber, serviceId } = req.params;
    
    const events = await prisma.event.findMany({
      where: {
        userId,
        eventType: { in: ['AUDIO_PROGRESS', 'VIDEO_PROGRESS'] },
      }
    });

    let totalAudioSeconds = 0;
    let totalVideoSeconds = 0;

    events.forEach(e => {
        const payload = e.data as any;
        if (payload && payload.weekNumber === parseInt(weekNumber) && payload.serviceId === serviceId) {
             if (e.eventType === 'AUDIO_PROGRESS') {
                 totalAudioSeconds += (payload.secondsWatched || 0);
             } else if (e.eventType === 'VIDEO_PROGRESS') {
                 totalVideoSeconds += (payload.secondsWatched || 0);
             }
        }
    });

    // Extract questionnaire
    const bitacoras = await prisma.bitacoraLog.findMany({
       where: { userId, weekNumber: parseInt(weekNumber) },
       orderBy: { timestamp: 'desc' }
    });

    // Look for the last questionnaire html
    const questionnaireHtml = bitacoras.find(b => b.content.includes('Cuestionario de Autoevaluación'))?.content || null;

    res.json({
        totalAudioMinutes: Math.round(totalAudioSeconds / 60),
        totalVideoMinutes: Math.round(totalVideoSeconds / 60),
        questionnaireHtml
    });

  } catch (error) {
    console.error('Error fetching metrics map:', error);
    res.status(500).json({ error: 'Database metrics error' });
  }
});

export default router;

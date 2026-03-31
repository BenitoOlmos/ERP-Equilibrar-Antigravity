import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: { include: { profile: true } },
        specialist: { include: { profile: true } },
        service: true,
        payment: true
      },
      orderBy: { date: 'asc' }
    });
    res.json(appointments);
  } catch(e) { res.status(500).json({error: 'Failed to fetch apps'})}
});

router.post('/', async (req, res) => {
  try {
    const { clientId, specialistId, serviceId, date, sessionType, status } = req.body;
    
    // Check if slot is taken for that specialist
    const targetDate = new Date(date);
    const existing = await prisma.appointment.findFirst({
      where: { specialistId, date: targetDate }
    });
    if (existing) {
      return res.status(400).json({ error: 'El especialista ya tiene ese horario bloqueado u ocupado.' });
    }

    const valService = serviceId ? await prisma.agendaService.findUnique({ where: { id: serviceId }}) : null;
    
    const isBlocked = sessionType === 'BLOCKED' || status === 'BLOCKED';

    const app = await prisma.appointment.create({
      data: {
        clientId, specialistId, serviceId, date: new Date(date), sessionType, status,
        ...(!isBlocked && clientId ? { 
          payment: { create: { userId: clientId, amount: valService?.price || 0, status: 'PENDING', paymentMethod: 'TRANSFER', concept: `Consulta: ${valService?.name || 'Clínica'}` } } 
        } : {})
      },
      include: { client: {include: {profile:true}}, specialist: {include: {profile:true}}, service: true }
    });
    res.json(app);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to create appt'}); }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, specialistId, serviceId, date, sessionType, status, notes } = req.body;
    
    const valService = serviceId ? await prisma.agendaService.findUnique({ where: { id: serviceId } }) : null;
    
    // Validar si el slot está ocupado por otra cita/bloqueo
    if (date && specialistId) {
      const targetDate = new Date(date);
      const existing = await prisma.appointment.findFirst({
        where: { specialistId, date: targetDate, id: { not: id } }
      });
      if (existing) {
        return res.status(400).json({ error: 'El especialista ya tiene ese horario bloqueado u ocupado.' });
      }
    }

    const app = await prisma.appointment.update({
      where: { id },
      data: {
        ...(clientId && { clientId }),
        ...(specialistId && { specialistId }),
        ...(serviceId && { serviceId }),
        ...(date && { date: new Date(date) }),
        ...(sessionType && { sessionType }),
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      },
      include: { client: {include: {profile:true}}, specialist: {include: {profile:true}}, service: true, payment: true }
    });
    
    if (valService && app.payment) {
      await prisma.payment.update({
        where: { id: app.payment.id },
        data: { 
           ...(app.payment.status === 'PENDING' && { amount: valService.price }),
           concept: `Consulta: ${valService.name}` 
        }
      });
    }

    res.json(app);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to update appt'}); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e: any) { console.error(e); res.status(500).json({error: 'Failed to delete appt'}); }
});

export default router;

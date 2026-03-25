import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Resumen KPI endpoint
router.get('/resumen', async (req: express.Request, res: express.Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const clients = await prisma.user.count({ where: { role: 'CLIENT' } });
    const specialists = await prisma.user.count({ where: { role: 'SPECIALIST' } });
    const coordinators = await prisma.user.count({ where: { role: 'COORDINATOR' } });
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } });

    // Stats
    const totalAppointments = await prisma.appointment.count();
    const totalPayments = await prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } });
    const totalDiagnostics = await prisma.diagnosticResult.count();

    res.json({
      users: { total: totalUsers, clients, specialists, coordinators, admins },
      appointments: totalAppointments,
      revenue: totalPayments._sum.amount || 0,
      diagnostics: totalDiagnostics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching resumen' });
  }
});

// ----------------------------------------------------
// UNIFIED ABM: RFAI PROGRAMS (RFAIService)
// ----------------------------------------------------
router.get('/rfai-programs', async (req, res) => {
  try {
    const data = await prisma.rFAIService.findMany({
      include: { 
        weeks: { orderBy: { weekNumber: 'asc' } }, 
        services: { include: { agendaService: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) { res.status(500).json({ error: 'DB Error' }) }
});

router.post('/rfai-programs', express.json(), async (req, res) => {
  try {
    const { profile, title, serviceIds, weeks } = req.body;
    const doc = await prisma.rFAIService.create({
      data: {
        profile, title,
        services: { create: (serviceIds || []).map((id:string) => ({ agendaServiceId: id })) },
        weeks: { create: (weeks || []).map((w:any) => ({ weekNumber: w.weekNumber, title: w.title, reflexion: w.reflexion, ejercicio: w.ejercicio, audioUrl: w.audioUrl, youtubeUrl: w.youtubeUrl, videoConferenceEnabled: w.videoConferenceEnabled })) }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.put('/rfai-programs/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { profile, title, serviceIds, weeks } = req.body;
    
    // Purge old arrays
    await prisma.rFAIProgramService.deleteMany({ where: { rfaiServiceId: id } });
    await prisma.weekContent.deleteMany({ where: { serviceId: id } });
    
    const doc = await prisma.rFAIService.update({
      where: { id },
      data: {
        profile, title,
        services: { create: (serviceIds || []).map((sid:string) => ({ agendaServiceId: sid })) },
        weeks: { create: (weeks || []).map((w:any) => ({ weekNumber: w.weekNumber, title: w.title, reflexion: w.reflexion, ejercicio: w.ejercicio, audioUrl: w.audioUrl, youtubeUrl: w.youtubeUrl, videoConferenceEnabled: w.videoConferenceEnabled })) }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.delete('/rfai-programs/:id', async (req, res) => {
  try {
    await prisma.rFAIService.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

// ----------------------------------------------------
// UNIFIED ABM: TREATMENTS (Program)
// ----------------------------------------------------
router.get('/treatments', async (req, res) => {
  try {
    const data = await prisma.program.findMany({
      include: { 
        contents: { orderBy: { weekNumber: 'asc' } }, 
        services: { include: { service: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) { res.status(500).json({ error: 'DB Error' }) }
});

router.post('/treatments', express.json(), async (req, res) => {
  try {
    // "serviceIds" uses AgendaService 
    const { name, description, price, serviceIds, contents } = req.body;
    const doc = await prisma.program.create({
      data: {
        name, description, price: Number(price),
        services: { create: (serviceIds || []).map((id:string) => ({ serviceId: id })) },
        contents: { create: (contents || []).map((c:any) => ({ weekNumber: c.weekNumber, title: c.title, description: c.description, contentUrl: c.contentUrl })) }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.put('/treatments/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, serviceIds, contents } = req.body;
    
    await prisma.programService.deleteMany({ where: { programId: id } });
    await prisma.programContent.deleteMany({ where: { programId: id } });
    
    const doc = await prisma.program.update({
      where: { id },
      data: {
        name, description, price: Number(price),
        services: { create: (serviceIds || []).map((sid:string) => ({ serviceId: sid })) },
        contents: { create: (contents || []).map((c:any) => ({ weekNumber: c.weekNumber, title: c.title, description: c.description, contentUrl: c.contentUrl })) }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.delete('/treatments/:id', async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

// ----------------------------------------------------
// UNIFIED ABM: COURSES (Course)
// ----------------------------------------------------
router.get('/courses', async (req, res) => {
  try {
    const data = await prisma.course.findMany({
      include: { 
        modules: { orderBy: { order: 'asc' } }, 
        services: { include: { agendaService: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) { res.status(500).json({ error: 'DB Error' }) }
});

router.post('/courses', express.json(), async (req, res) => {
  try {
    const { title, description, serviceIds, modules } = req.body;
    const doc = await prisma.course.create({
      data: {
        title, description,
        services: { create: (serviceIds || []).map((id:string) => ({ agendaServiceId: id })) },
        modules: { create: (modules || []).map((m:any) => ({ title: m.title, type: m.type || 'TEXT', description: m.description, contentUrl: m.contentUrl, order: m.order, duration: m.duration ? Number(m.duration) : null })) }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.put('/courses/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, serviceIds, modules } = req.body;
    
    await prisma.courseService.deleteMany({ where: { courseId: id } });
    await prisma.module.deleteMany({ where: { courseId: id } });
    
    const doc = await prisma.course.update({
      where: { id },
      data: {
        title, description,
        services: { create: (serviceIds || []).map((sid:string) => ({ agendaServiceId: sid })) },
        modules: { create: (modules || []).map((m:any) => ({ title: m.title, type: m.type || 'TEXT', description: m.description, contentUrl: m.contentUrl, order: m.order, duration: m.duration ? Number(m.duration) : null })) }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

export default router;

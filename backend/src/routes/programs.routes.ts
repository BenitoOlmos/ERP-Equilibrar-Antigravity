import { Router } from 'express';
import prisma from '../utils/db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await prisma.rFAIService.findMany({
      include: { 
        modules: { orderBy: { order: 'asc' } }, 
        services: { include: { agendaService: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) { res.status(500).json({ error: 'DB Error' }) }
});

router.post('/', async (req, res) => {
  try {
    const { profile, title, description, price, agendaWeeks } = req.body;
    
    const servicesData = (agendaWeeks || []).flatMap((aw:any) => (aw.serviceIds || []).map((id:string) => ({ agendaServiceId: id, weekNumber: aw.weekNumber })));
    const modulesData = (agendaWeeks || []).flatMap((aw:any) => (aw.modules || []).map((m:any) => ({ title: m.title, type: m.type || 'TEXT', description: m.description, contentUrl: m.contentUrl, order: m.order, duration: m.duration ? Number(m.duration) : null, questions: m.questions, weekNumber: aw.weekNumber })));

    const doc = await prisma.rFAIService.create({
      data: {
        profile, title, description, price: Number(price) || 0,
        services: { create: servicesData },
        modules: { create: modulesData }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { profile, title, description, price, agendaWeeks } = req.body;
    
    await prisma.rFAIProgramService.deleteMany({ where: { rfaiServiceId: id } });
    await prisma.module.deleteMany({ where: { rfaiServiceId: id } });
    
    const servicesData = (agendaWeeks || []).flatMap((aw:any) => (aw.serviceIds || []).map((sid:string) => ({ agendaServiceId: sid, weekNumber: aw.weekNumber })));
    const modulesData = (agendaWeeks || []).flatMap((aw:any) => (aw.modules || []).map((m:any) => ({ title: m.title, type: m.type || 'TEXT', description: m.description, contentUrl: m.contentUrl, order: m.order, duration: m.duration ? Number(m.duration) : null, questions: m.questions, weekNumber: aw.weekNumber })));

    const doc = await prisma.rFAIService.update({
      where: { id },
      data: {
        profile, title, description, price: Number(price) || 0,
        services: { create: servicesData },
        modules: { create: modulesData }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.rFAIService.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

export default router;

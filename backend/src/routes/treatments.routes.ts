import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const data = await prisma.program.findMany({
      include: { 
        modules: { orderBy: { order: 'asc' } }, 
        services: { include: { service: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) { res.status(500).json({ error: 'DB Error' }) }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, agendaWeeks } = req.body;
    
    const servicesData = (agendaWeeks || []).flatMap((aw:any) => (aw.serviceIds || []).map((id:string) => ({ serviceId: id, weekNumber: aw.weekNumber })));
    const modulesData = (agendaWeeks || []).flatMap((aw:any) => (aw.modules || []).map((m:any) => ({ title: m.title, type: m.type || 'TEXT', description: m.description, contentUrl: m.contentUrl, order: m.order, duration: m.duration ? Number(m.duration) : null, questions: m.questions, weekNumber: aw.weekNumber })));

    const doc = await prisma.program.create({
      data: {
        name, description, price: Number(price),
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
    const { name, description, price, agendaWeeks } = req.body;
    
    await prisma.programService.deleteMany({ where: { programId: id } });
    await prisma.module.deleteMany({ where: { programId: id } });
    
    const servicesData = (agendaWeeks || []).flatMap((aw:any) => (aw.serviceIds || []).map((sid:string) => ({ serviceId: sid, weekNumber: aw.weekNumber })));
    const modulesData = (agendaWeeks || []).flatMap((aw:any) => (aw.modules || []).map((m:any) => ({ title: m.title, type: m.type || 'TEXT', description: m.description, contentUrl: m.contentUrl, order: m.order, duration: m.duration ? Number(m.duration) : null, questions: m.questions, weekNumber: aw.weekNumber })));

    const doc = await prisma.program.update({
      where: { id },
      data: {
        name, description, price: Number(price),
        services: { create: servicesData },
        modules: { create: modulesData }
      }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const doc = await prisma.program.update({
      where: { id: req.params.id },
      data: { isActive: req.body.isActive }
    });
    res.json(doc);
  } catch (e: any) { res.status(500).json({ error: e.message }) }
});

export default router;

import { Router } from 'express';
import prisma from '../utils/db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const services = await prisma.agendaService.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
         branch: true,
         specialist: {
            include: { profile: true }
         }
      }
    });
    res.json(services);
  } catch(e) { res.status(500).json({error: 'Failed to fetch services'}); }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, duration, price, branchId, specialistId } = req.body;
    const srv = await prisma.agendaService.create({
      data: { 
         name, 
         description, 
         duration: Number(duration), 
         price: Number(price),
         branchId: branchId || null,
         specialistId: specialistId || null
      }
    });
    res.json(srv);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to create service'}); }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, branchId, specialistId } = req.body;
    const srv = await prisma.agendaService.update({
      where: { id },
      data: { 
         name, 
         description, 
         duration: Number(duration), 
         price: Number(price),
         branchId: branchId || null,
         specialistId: specialistId || null
      }
    });
    res.json(srv);
  } catch(e: any) { console.error(e); res.status(500).json({error: 'Failed to update service'}); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.agendaService.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e: any) { console.error(e); res.status(500).json({error: 'Failed to delete service'}); }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const srv = await prisma.agendaService.update({
      where: { id: req.params.id },
      data: { isActive: req.body.isActive }
    });
    res.json(srv);
  } catch(e) { res.status(500).json({error: 'Failed to toggle service'}); }
});

export default router;

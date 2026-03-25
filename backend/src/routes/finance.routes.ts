import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: { include: { profile: true } },
        appointment: { include: { service: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch(e) { res.status(500).json({error: 'Failed to fetch payments'})}
});

// ==================
// SALES CATALOG
// ==================
router.get('/catalog', async (req, res) => {
  try {
    const [services, programs, courses, products, rfaiPrograms] = await Promise.all([
      prisma.agendaService.findMany({ where: { isActive: true } }),
      prisma.program.findMany({ where: { isActive: true }, include: { services: { include: { service: true } } } }),
      prisma.course.findMany({ where: { isActive: true }, include: { services: { include: { agendaService: true } } } }),
      prisma.product.findMany({ where: { isActive: true, stock: { gt: 0 } } }),
      prisma.rFAIService.findMany({ where: { isActive: true }, include: { services: { include: { agendaService: true } } } })
    ]);

    res.json({ services, programs: rfaiPrograms, treatments: programs, courses, products });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
});

async function processInternalExpenses(concept: string, status: string, userId: string, paymentId: string) {
  if (status !== 'COMPLETED' || !concept) return;
  const existing = await prisma.payment.findFirst({ where: { concept: { contains: `(Ref: ${paymentId})` } } });
  if (existing) return;

  let internalServices: any[] = [];
  const prog = await prisma.program.findFirst({
      where: { name: concept },
      include: { services: { include: { service: true } } }
  });
  if (prog && prog.services) internalServices = prog.services.map((s:any) => ({ count: s.count, service: s.service }));
  
  if (!prog) {
      const rfai = await prisma.rFAIService.findFirst({
        where: { title: concept },
        include: { services: { include: { agendaService: true } } }
      });
      if (rfai && rfai.services) internalServices = rfai.services.map((s:any) => ({ count: s.count, service: s.agendaService }));
  }

  if (!prog && internalServices.length === 0) {
      const course = await prisma.course.findFirst({
        where: { title: concept },
        include: { services: { include: { agendaService: true } } }
      });
      if (course && course.services) internalServices = course.services.map((s:any) => ({ count: s.count, service: s.agendaService }));
  }

  if (internalServices.length > 0) {
      for (const item of internalServices) {
          if (item.service && item.service.price > 0 && item.count > 0) {
              await prisma.payment.create({
                  data: {
                      amount: -(item.service.price * item.count),
                      concept: `Gasto Interno Clínico: ${item.count}x ${item.service.name} (Ref: ${paymentId})`,
                      status: 'COMPLETED',
                      paymentMethod: 'INTERNAL',
                      userId: userId
                  }
              });
          }
      }
  }
}

router.post('/', async (req, res) => {
  try {
    const { amount, concept, status, paymentMethod, userId, productId, appointmentDetails } = req.body;
    
    let createdAppointmentId = null;

    // Optional Appointment Integration Loop
    if (appointmentDetails && appointmentDetails.date && appointmentDetails.specialistId && appointmentDetails.serviceId) {
       const newAppt = await prisma.appointment.create({
          data: {
             clientId: userId,
             specialistId: appointmentDetails.specialistId,
             serviceId: appointmentDetails.serviceId,
             date: new Date(appointmentDetails.date),
             timeStr: appointmentDetails.timeStr || null,
             status: 'SCHEDULED'
          }
       });
       createdAppointmentId = newAppt.id;
    }

    // Create standalone payment (sale)
    const payment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        concept,
        status: status || 'PENDING',
        paymentMethod: paymentMethod || 'TRANSFER',
        userId,
        productId: productId || null,
        appointmentId: createdAppointmentId
      },
      include: { user: { include: { profile: true } }, appointment: { include: { service: true } } }
    });
    
    // Inventory Stock Reduction Hook
    if (productId && status === 'COMPLETED') {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: 1 } }
      });
    }
    
    await processInternalExpenses(concept, payment.status, userId, payment.id);
    
    res.status(201).json(payment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create payment/sale' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, paymentMethod, concept } = req.body;
    const data: any = {};
    if (status) data.status = status;
    if (amount !== undefined) data.amount = Number(amount);
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
    if (concept !== undefined) data.concept = concept;
    
    const payment = await prisma.payment.update({
       where: { id }, data,
       include: { user: { include: { profile: true } }, appointment: { include: { service: true } } }
    });

    if (payment.status === 'COMPLETED') {
       await processInternalExpenses(payment.concept || '', payment.status, payment.userId, payment.id);
    }

    res.json(payment);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to update payment'}); }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.payment.deleteMany({ where: { concept: { contains: `(Ref: ${id})` } } });
    await prisma.payment.delete({ where: { id } });
    res.json({ success: true });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

export default router;

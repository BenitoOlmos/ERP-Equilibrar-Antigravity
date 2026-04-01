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

router.get('/catalog-all', async (req, res) => {
  try {
    // Fetches all items, ignoring isActive restriction, purely for validation purposes
    const [programs, courses, rfaiPrograms] = await Promise.all([
      prisma.program.findMany(),
      prisma.course.findMany(),
      prisma.rFAIService.findMany()
    ]);

    res.json({ programs: rfaiPrograms, treatments: programs, courses });
  } catch (error) {
    console.error('Error fetching all catalog:', error);
    res.status(500).json({ error: 'Failed to fetch all catalog' });
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
    const { status, amount, paymentMethod, concept, appointmentDetails } = req.body;
    const data: any = {};
    if (status) data.status = status;
    if (amount !== undefined) data.amount = Number(amount);
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
    if (concept !== undefined) data.concept = concept;
    
    // Fetch directly to check existing relations
    const existing = await prisma.payment.findUnique({ where: { id }});
    
    if (appointmentDetails && appointmentDetails.date && appointmentDetails.specialistId) {
       if (existing?.appointmentId) {
          await prisma.appointment.update({
             where: { id: existing.appointmentId },
             data: {
                date: new Date(appointmentDetails.date),
                timeStr: appointmentDetails.timeStr || null,
                specialistId: appointmentDetails.specialistId,
                serviceId: appointmentDetails.serviceId || undefined
             }
          });
       } else {
          // Si el pago no tenía cita atada y el usuario le agrega una en Edición
          const newAppt = await prisma.appointment.create({
             data: {
                clientId: existing!.userId,
                specialistId: appointmentDetails.specialistId,
                serviceId: appointmentDetails.serviceId || undefined,
                date: new Date(appointmentDetails.date),
                timeStr: appointmentDetails.timeStr || null,
                status: 'SCHEDULED'
             }
          });
          data.appointmentId = newAppt.id;
       }
    }

    const payment = await prisma.payment.update({
       where: { id }, data,
       include: { user: { include: { profile: true } }, appointment: { include: { service: true } } }
    });

    if (payment.status === 'COMPLETED') {
       try { await processInternalExpenses(payment.concept || '', payment.status, payment.userId, payment.id); } 
       catch(err) { console.error('Internal expenses failed, bypassing:', err); }
    }

    res.json(payment);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to update payment'}); }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({ where: { id }});
    await prisma.payment.deleteMany({ where: { concept: { contains: `(Ref: ${id})` } } });
    await prisma.payment.delete({ where: { id } });
    
    if (payment?.appointmentId) {
      // Usamos deleteMany por la cascada silenciosa para que no crashee si no lo encuentra o viceversa
      await prisma.appointment.delete({ where: { id: payment.appointmentId } }).catch(() => {});
    }
    res.json({ success: true });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

import {
    getReceivables,
    markReceivablePaid,
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getCashFlow
} from '../controllers/finance.controller';

// Receivables (Cuentas por Cobrar)
router.get('/receivables/list', getReceivables);
router.put('/receivables/:id/pay', markReceivablePaid);

// Suppliers (Proveedores)
router.get('/suppliers/list', getSuppliers);
router.post('/suppliers/create', createSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Expenses (Cuentas por Pagar)
router.get('/expenses/list', getExpenses);
router.post('/expenses/create', createExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Cashflow (Tesorería)
router.get('/cashflow/summary', getCashFlow);

export default router;

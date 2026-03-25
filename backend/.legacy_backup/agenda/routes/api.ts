import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';

const router = express.Router();
const prisma = new PrismaClient();

// GET all users (Admin/Coordinator views)
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});

// GET all appointments (Agenda view)
router.get('/appointments', async (req, res) => {
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
});

// GET all payments (Finance view)
router.get('/payments', async (req, res) => {
  const payments = await prisma.payment.findMany({
    include: {
      user: { include: { profile: true } },
      appointment: { include: { service: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(payments);
});

// GET overview stats for dashboard
router.get('/stats', async (req, res) => {
  const totalSpecialists = await prisma.user.count({ where: { role: 'SPECIALIST', isActive: true } });
  const totalClients = await prisma.user.count({ where: { role: 'CLIENT', isActive: true } });
  
  // Today's appointments
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);
  
  const todayAppointments = await prisma.appointment.count({
    where: { date: { gte: startOfDay, lte: endOfDay } }
  });

  res.json({
    specialists: totalSpecialists,
    clients: totalClients,
    appointmentsToday: todayAppointments
  });
});

// GET all services/programs (For Admin Services view)
router.get('/services', async (req, res) => {
  const services = await prisma.agendaService.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(services);
});

// POST to create user (Profile creation)
router.post('/users', express.json(), async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink } = req.body;
    const hash = await bcrypt.hash(password || '123456', 10);
    const user = await prisma.user.create({
      data: {
        email, role, phone, passwordHash: hash,
        profile: {
          create: { firstName, lastName, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink }
        }
      },
      include: { profile: true }
    });
    res.json(user);
  } catch(e: any) { 
    console.error(e); 
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'El correo electrónico ingresado ya se encuentra registrado por otro usuario.' });
    }
    res.status(500).json({error: e.message || 'Failed to create user'}); 
  }
});

// PUT to edit user (Profile update)
router.put('/users/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, firstName, lastName, phone, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        email, role, phone,
        profile: {
          upsert: {
            create: { firstName, lastName, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink },
            update: { firstName, lastName, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink }
          }
        }
      },
      include: { profile: true }
    });
    res.json(user);
  } catch(e: any) { 
    console.error(e); 
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'El correo electrónico ingresado ya se encuentra registrado por otro usuario.' });
    }
    res.status(500).json({error: e.message || 'Failed to update user'}); 
  }
});

// POST to create service
router.post('/services', express.json(), async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    const srv = await prisma.agendaService.create({
      data: { name, description, duration: Number(duration), price: Number(price) }
    });
    res.json(srv);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to create service'}); }
});

// PUT to edit service
router.put('/services/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price } = req.body;
    const srv = await prisma.agendaService.update({
      where: { id },
      data: { name, description, duration: Number(duration), price: Number(price) }
    });
    res.json(srv);
  } catch(e: any) { console.error(e); res.status(500).json({error: e.message || 'Failed to update service'}); }
});

// DELETE to remove service 
router.delete('/services/:id', async (req, res) => {
  try {
    await prisma.agendaService.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e: any) { console.error(e); res.status(500).json({error: e.message || 'Failed to delete service'}); }
});

// GET all programs 
router.get('/programs', async (req, res) => {
  const programs = await prisma.program.findMany({
    include: { services: { include: { service: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(programs);
});

// POST to create program
router.post('/programs', express.json(), async (req, res) => {
  try {
    const { name, description, price, serviceIds } = req.body;
    const p = await prisma.program.create({
      data: { 
         name, description, price: Number(price),
         services: {
            create: (serviceIds || []).map((id: string) => ({ serviceId: id }))
         }
      },
      include: { services: { include: { service: true } } }
    });
    res.json(p);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to create program'}); }
});

// PUT to edit program
router.put('/programs/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, serviceIds } = req.body;
    
    // Drop old intermediate rows
    await prisma.programService.deleteMany({ where: { programId: id } });
    
    const p = await prisma.program.update({
      where: { id },
      data: { 
         name, description, price: Number(price),
         services: {
            create: (serviceIds || []).map((sid: string) => ({ serviceId: sid }))
         }
      },
      include: { services: { include: { service: true } } }
    });
    res.json(p);
  } catch(e: any) { console.error(e); res.status(500).json({error: e.message || 'Failed to update program'}); }
});

// DELETE to remove program
router.delete('/programs/:id', async (req, res) => {
  try {
    // Cascade handles ProgramServices
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e: any) { console.error(e); res.status(500).json({error: e.message || 'Failed to delete program'}); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch(e: any) { console.error(e); res.status(500).json({error: e.message || 'Failed to delete user'}); }
});
// POST to create appointment
router.post('/appointments', express.json(), async (req, res) => {
  try {
    const { clientId, specialistId, serviceId, date, sessionType, status } = req.body;
    const valService = await prisma.agendaService.findUnique({ where: { id: serviceId }});
    const app = await prisma.appointment.create({
      data: {
        clientId, specialistId, serviceId, date: new Date(date), sessionType, status,
        payment: { create: { userId: clientId, amount: valService?.price || 0, status: 'PENDING' } }
      },
      include: { client: {include: {profile:true}}, specialist: {include: {profile:true}}, service: true }
    });
    res.json(app);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to create appt'}); }
});

// PUT to update appointment
router.put('/appointments/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, specialistId, serviceId, date, sessionType, status, notes } = req.body;
    
    // Check if service price changed to update pending payments
    const valService = serviceId ? await prisma.agendaService.findUnique({ where: { id: serviceId } }) : null;
    
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
    
    // Auto-update pending payment amount if service changed
    if (valService && app.payment?.status === 'PENDING') {
      await prisma.payment.update({
        where: { id: app.payment.id },
        data: { amount: valService.price }
      });
    }

    res.json(app);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to update appt'}); }
});

// DELETE to remove appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e: any) { console.error(e); res.status(500).json({error: e.message || 'Failed to delete appt'}); }
});
// PUT to edit payment status
router.put('/payments/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, paymentMethod } = req.body;
    const data: any = {};
    if (status) data.status = status;
    if (amount !== undefined) data.amount = Number(amount);
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
    
    const payment = await prisma.payment.update({
       where: { id }, data,
       include: { user: { include: { profile: true } }, appointment: { include: { service: true } } }
    });
    res.json(payment);
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to update payment'}); }
});

// ====================== PROGRAMS ======================
router.get('/programs', async (req, res) => {
  try {
    const programs = await prisma.program.findMany({ include: { services: { include: { service: true } } } });
    res.json(programs);
  } catch (e) { console.error(e); res.status(500).json({error: 'Failed to fetch programs'}); }
});

router.post('/programs', express.json(), async (req, res) => {
  try {
    const { name, description, price, isActive, services } = req.body; // services is array of serviceId strings
    const program = await prisma.program.create({
      data: {
        name, description, price: Number(price), isActive: isActive !== undefined ? isActive : true,
        services: { create: (services || []).map((id: string) => ({ service: { connect: { id } } })) }
      },
      include: { services: { include: { service: true } } }
    });
    res.json(program);
  } catch (e) { console.error(e); res.status(500).json({error: 'Failed to create program'}); }
});

router.put('/programs/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, isActive, services } = req.body;
    if (services !== undefined) await prisma.programService.deleteMany({ where: { programId: id } });
    
    const program = await prisma.program.update({
      where: { id },
      data: {
        name, description,
        ...(price !== undefined && { price: Number(price) }),
        ...(isActive !== undefined && { isActive }),
        ...(services !== undefined && { services: { create: services.map((sId: string) => ({ service: { connect: { id: sId } } })) } })
      },
      include: { services: { include: { service: true } } }
    });
    res.json(program);
  } catch (e) { console.error(e); res.status(500).json({error: 'Failed to update program'}); }
});

router.delete('/programs/:id', async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { console.error(e); res.status(500).json({error: 'Failed to delete program'}); }
});
// ==================== DATABASE BACKUP ====================
// EXPORT: Generate a full JSON dump of the PostgreSQL Database
router.get('/backup/export', async (req, res) => {
  try {
    const backupData = {
      users: await prisma.user.findMany(),
      profiles: await prisma.profile.findMany(),
      appointments: await prisma.appointment.findMany(),
      payments: await prisma.payment.findMany(),
      services: await prisma.agendaService.findMany(),
      programs: await prisma.program.findMany(),
      programServices: await prisma.programService.findMany(),
      // RFAI tables
      userCompletedWeeks: await prisma.userCompletedWeek.findMany(),
      rfaiServices: await prisma.rFAIService.findMany(),
      weekContents: await prisma.weekContent.findMany(),
      questions: await prisma.question.findMany(),
      evaluations: await prisma.weeklyEvaluation.findMany(),
      answers: await prisma.weeklyEvaluationAnswer.findMany(),
      audioLogs: await prisma.audioLog.findMany(),
      activityProgress: await prisma.activityProgress.findMany(),
      bitacoraLogs: await prisma.bitacoraLog.findMany(),
      messages: await prisma.message.findMany(),
      diagnostics: await prisma.diagnosticResult.findMany()
    };
    
    res.setHeader('Content-disposition', 'attachment; filename=Respaldo_ERP_Unificado_' + new Date().toISOString().split('T')[0] + '.json');
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(backupData, null, 2));
    res.end();
  } catch (error: any) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Fallo al exportar el respaldo' });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// IMPORT: Restore database from JSON
router.post('/backup/import', upload.single('database'), async (req, res) => {
  try {
    if (!req.file) throw new Error("No se envió archivo");
    const rawData = req.file.buffer.toString('utf8');
    const data = JSON.parse(rawData);

    if (!data || !data.users) {
      throw new Error('Formato de respaldo JSON no válido o vacío.');
    }

    await prisma.$transaction(async (tx) => {
      // 1. CLEAR EXSISTING DATA (Bottom-up dependency clearance)
      await tx.message.deleteMany();
      await tx.bitacoraLog.deleteMany();
      await tx.activityProgress.deleteMany();
      await tx.audioLog.deleteMany();
      await tx.payment.deleteMany();
      await tx.appointment.deleteMany();
      await tx.weeklyEvaluationAnswer.deleteMany();
      await tx.weeklyEvaluation.deleteMany();
      await tx.question.deleteMany();
      await tx.weekContent.deleteMany();
      await tx.rFAIService.deleteMany();
      await tx.userCompletedWeek.deleteMany();
      try { await tx.diagnosticResult.deleteMany(); } catch (e) {}
      
      await tx.programService.deleteMany();
      await tx.program.deleteMany();
      await tx.agendaService.deleteMany();
      await tx.profile.deleteMany();
      await tx.user.deleteMany();

      console.log("Restaurando datos...");
      
      // 2. SEED USERS & PROFILES
      if (data.users && data.users.length) await tx.user.createMany({ data: data.users });
      if (data.profiles && data.profiles.length) await tx.profile.createMany({ data: data.profiles });
      
      // 3. AGENDA CONFIG
      if (data.services && data.services.length) await tx.agendaService.createMany({ data: data.services });
      if (data.programs && data.programs.length) await tx.program.createMany({ data: data.programs });
      if (data.programServices && data.programServices.length) await tx.programService.createMany({ data: data.programServices });
      
      // 4. CORE APPTS & PAYMENTS
      if (data.appointments && data.appointments.length) await tx.appointment.createMany({ data: data.appointments });
      if (data.payments && data.payments.length) await tx.payment.createMany({ data: data.payments });

      // 5. RFAI MODULE CONFIG
      if (data.rfaiServices && data.rfaiServices.length) await tx.rFAIService.createMany({ data: data.rfaiServices });
      else if (data.services && data.services.length && data.services[0].profile) {
        // Fallback for legacy JSON where rFAI services were in 'services' array
        await tx.rFAIService.createMany({ data: data.services.filter((s: any) => s.profile) });
      }
      
      if (data.weekContents && data.weekContents.length) await tx.weekContent.createMany({ data: data.weekContents });
      if (data.questions && data.questions.length) await tx.question.createMany({ data: data.questions });
      if (data.evaluations && data.evaluations.length) await tx.weeklyEvaluation.createMany({ data: data.evaluations });
      if (data.answers && data.answers.length) await tx.weeklyEvaluationAnswer.createMany({ data: data.answers });
      
      // 6. RFAI MODULE LOGS
      if (data.audioLogs && data.audioLogs.length) await tx.audioLog.createMany({ data: data.audioLogs });
      if (data.activityProgress && data.activityProgress.length) await tx.activityProgress.createMany({ data: data.activityProgress });
      if (data.bitacoraLogs && data.bitacoraLogs.length) await tx.bitacoraLog.createMany({ data: data.bitacoraLogs });
      if (data.userCompletedWeeks && data.userCompletedWeeks.length) await tx.userCompletedWeek.createMany({ data: data.userCompletedWeeks });
      if (data.messages && data.messages.length) await tx.message.createMany({ data: data.messages });
      if (data.diagnostics && data.diagnostics.length) await tx.diagnosticResult.createMany({ data: data.diagnostics });
    });
    
    res.json({ success: true, message: 'Base de datos restaurada exitosamente.' });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Error al procesar el archivo de respaldo.' });
  }
});

export default router;

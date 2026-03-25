import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';

const router = Router();
const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/export', async (req, res) => {
  try {
    const backupData = {
      users: await prisma.user.findMany(),
      profiles: await prisma.profile.findMany(),
      appointments: await prisma.appointment.findMany(),
      payments: await prisma.payment.findMany(),
      services: await prisma.agendaService.findMany(),
      programs: await prisma.program.findMany(),
      programServices: await prisma.programService.findMany(),
      userCompletedWeeks: await prisma.userCompletedWeek.findMany(),
      rfaiServices: await prisma.rFAIService.findMany(),
      evaluations: await prisma.weeklyEvaluation.findMany(),
      answers: await prisma.weeklyEvaluationAnswer.findMany(),
      audioLogs: await prisma.audioLog.findMany()
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

router.post('/import', upload.single('database'), async (req, res) => {
  try {
    if (!req.file) throw new Error("No se envió archivo");
    const rawData = req.file.buffer.toString('utf8');
    const data = JSON.parse(rawData);

    if (!data || !data.users) {
      throw new Error('Formato JSON no válido.');
    }

    await prisma.$transaction(async (tx) => {
      // 1. CLEAR EXSISTING DATA 
      await tx.audioLog.deleteMany();
      await tx.payment.deleteMany();
      await tx.appointment.deleteMany();
      await tx.weeklyEvaluationAnswer.deleteMany();
      await tx.weeklyEvaluation.deleteMany();
      await tx.rFAIService.deleteMany();
      await tx.userCompletedWeek.deleteMany();
      
      await tx.programService.deleteMany();
      await tx.program.deleteMany();
      await tx.agendaService.deleteMany();
      try { await tx.module.deleteMany(); } catch {}
      try { await tx.course.deleteMany(); } catch {}
      try { await tx.product.deleteMany(); } catch {}
      try { await tx.branch.deleteMany(); } catch {}
      await tx.profile.deleteMany();
      await tx.user.deleteMany();

      console.log("Restaurando datos profundos...");
      
      if (data.users && data.users.length) {
          const mappedUsers = data.users.map((u: any) => {
              const { password, profile, ...rest } = u;
              if (password) rest.passwordHash = password;
              if (profile && typeof profile === 'string') {
                  rest.notes = rest.notes ? `${rest.notes} | Perfil Clínico: ${profile}` : `Perfil Clínico: ${profile}`;
              }
              return rest;
          });
          await tx.user.createMany({ data: mappedUsers });
      }
      if (data.profiles && data.profiles.length) await tx.profile.createMany({ data: data.profiles });
      if (data.branches && data.branches.length) await tx.branch.createMany({ data: data.branches });
      if (data.products && data.products.length) await tx.product.createMany({ data: data.products });
      if (data.courses && data.courses.length) await tx.course.createMany({ data: data.courses });
      if (data.modules && data.modules.length) await tx.module.createMany({ data: data.modules });
      
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
        await tx.rFAIService.createMany({ data: data.services.filter((s: any) => s.profile) });
      }
      
      if (data.evaluations && data.evaluations.length) await tx.weeklyEvaluation.createMany({ data: data.evaluations });
      if (data.answers && data.answers.length) await tx.weeklyEvaluationAnswer.createMany({ data: data.answers });
      
      // 6. RFAI MODULE LOGS
      if (data.audioLogs && data.audioLogs.length) await tx.audioLog.createMany({ data: data.audioLogs });
      if (data.userCompletedWeeks && data.userCompletedWeeks.length) await tx.userCompletedWeek.createMany({ data: data.userCompletedWeeks });
    });
    
    res.json({ success: true, message: 'Base de datos restaurada de forma impecable.' });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Error al restaurar.' });
  }
});

export default router;

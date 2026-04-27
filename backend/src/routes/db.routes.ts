import { Router } from 'express';
import prisma from '../utils/db';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/export', async (req, res) => {
  try {
    const backupData = {
      users: await prisma.user.findMany(),
      profiles: await prisma.profile.findMany(),
      branches: await prisma.branch.findMany(),
      products: await prisma.product.findMany(),
      courses: await prisma.course.findMany(),
      modules: await prisma.module.findMany(),
      appointments: await prisma.appointment.findMany(),
      payments: await prisma.payment.findMany(),
      services: await prisma.agendaService.findMany(),
      programs: await prisma.program.findMany(),
      programServices: await prisma.programService.findMany(),
      userCompletedWeeks: await prisma.userCompletedWeek.findMany(),
      rfaiServices: await prisma.rFAIService.findMany(),
      evaluations: await prisma.weeklyEvaluation.findMany(),
      answers: await prisma.weeklyEvaluationAnswer.findMany(),
      audioLogs: await prisma.audioLog.findMany(),
      diagnostics: await prisma.diagnosticResult.findMany(),
      activityProgress: await prisma.activityProgress.findMany(),
      bitacoraLogs: await prisma.bitacoraLog.findMany(),
      messages: await prisma.message.findMany(),
      userProgress: await prisma.userProgress.findMany(),
      events: await prisma.event.findMany()
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

      // 1. TRUNCATE DATABASE CASCADE SO NO FK CONFLICTS EXIST
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Branch", "Product", "Course", "Module", "AgendaService", "Program", "RFAIService" CASCADE;`);

      await prisma.$transaction(async (tx) => {
          console.log("Restaurando datos profundos en la nube...");

          // LEVEL 1 (Independent)
          if (data.users && data.users.length) {
              const mappedUsers = data.users.map((u: any) => {
                  const { password, profile, ...rest } = u;
                  if (password) rest.passwordHash = password;
                  if (profile && typeof profile === 'string') {
                      rest.notes = rest.notes ? `${rest.notes} | Perfil Clínico: ${profile}` : `Perfil Clínico: ${profile}`;
                  }
                  
                  // Traducción de roles "al vuelo" si vienen de una DB antigua
                  if (rest.role === 'ADMIN') rest.role = 'Administrador';
                  else if (rest.role === 'COORDINATOR') rest.role = 'Coordinador';
                  else if (rest.role === 'SPECIALIST') rest.role = 'Especialista';
                  else if (rest.role === 'CLIENT' || rest.role === 'USER' || rest.role === 'PATIENT') rest.role = 'Cliente';

                  return rest;
              });
              await tx.user.createMany({ data: mappedUsers });
          }
          if (data.branches?.length) await tx.branch.createMany({ data: data.branches });
          if (data.products?.length) await tx.product.createMany({ data: data.products });
          if (data.courses?.length) await tx.course.createMany({ data: data.courses });
          if (data.programs?.length) await tx.program.createMany({ data: data.programs });
          if (data.rfaiServices?.length) await tx.rFAIService.createMany({ data: data.rfaiServices });

          // LEVEL 2
          if (data.profiles?.length) await tx.profile.createMany({ data: data.profiles });
          if (data.modules?.length) await tx.module.createMany({ data: data.modules });
          if (data.services?.length) await tx.agendaService.createMany({ data: data.services });
          if (data.audioLogs?.length) await tx.audioLog.createMany({ data: data.audioLogs });
          if (data.userCompletedWeeks?.length) await tx.userCompletedWeek.createMany({ data: data.userCompletedWeeks });
          if (data.evaluations?.length) await tx.weeklyEvaluation.createMany({ data: data.evaluations });
          if (data.diagnostics?.length) await tx.diagnosticResult.createMany({ data: data.diagnostics });
          if (data.activityProgress?.length) await tx.activityProgress.createMany({ data: data.activityProgress });
          if (data.bitacoraLogs?.length) await tx.bitacoraLog.createMany({ data: data.bitacoraLogs });
          if (data.messages?.length) await tx.message.createMany({ data: data.messages });
          if (data.userProgress?.length) await tx.userProgress.createMany({ data: data.userProgress });
          if (data.events?.length) await tx.event.createMany({ data: data.events });

          // LEVEL 3
          if (data.programServices?.length) await tx.programService.createMany({ data: data.programServices });
          if (data.answers?.length) await tx.weeklyEvaluationAnswer.createMany({ data: data.answers });
          if (data.appointments?.length) await tx.appointment.createMany({ data: data.appointments });

          // LEVEL 4
          if (data.payments?.length) await tx.payment.createMany({ data: data.payments });
      });
    
    res.json({ success: true, message: 'Base de datos restaurada de forma impecable.' });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Error al restaurar.' });
  }
});

export default router;

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { prisma } from '../prisma';

const router = Router();

router.get('/backup', authMiddleware, requireRole(['Admin']), async (req, res) => {
  try {
    const backupData = {
      users: await prisma.user.findMany(),
      userCompletedWeeks: await prisma.userCompletedWeek.findMany(),
      services: await prisma.service.findMany(),
      weekContents: await prisma.weekContent.findMany(),
      questions: await prisma.question.findMany(),
      evaluations: await prisma.weeklyEvaluation.findMany(),
      answers: await prisma.weeklyEvaluationAnswer.findMany(),
      appointments: await prisma.appointment.findMany(),
      audioLogs: await prisma.audioLog.findMany(),
      activityProgress: await prisma.activityProgress.findMany(),
      bitacoraLogs: await prisma.bitacoraLog.findMany(),
      messages: await prisma.message.findMany()
    };
    res.json(backupData);
  } catch (error: any) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Error al generar el respaldo', details: error.message });
  }
});

router.post('/restore', authMiddleware, requireRole(['Admin']), async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.users || !data.services) {
      return res.status(400).json({ error: 'Formato de respaldo inválido' });
    }

    // 1. Transaction to delete everything (bottom-up)
    await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany();
      await tx.bitacoraLog.deleteMany();
      await tx.activityProgress.deleteMany();
      await tx.audioLog.deleteMany();
      await tx.appointment.deleteMany();
      await tx.weeklyEvaluationAnswer.deleteMany();
      await tx.weeklyEvaluation.deleteMany();
      await tx.question.deleteMany();
      await tx.weekContent.deleteMany();
      await tx.service.deleteMany();
      await tx.userCompletedWeek.deleteMany();
      await tx.user.deleteMany(); 

      // 2. Re-insert data in correct top-down dependency order
      if (data.users && data.users.length) await tx.user.createMany({ data: data.users });
      if (data.services && data.services.length) await tx.service.createMany({ data: data.services });
      if (data.weekContents && data.weekContents.length) await tx.weekContent.createMany({ data: data.weekContents });
      if (data.questions && data.questions.length) await tx.question.createMany({ data: data.questions });
      if (data.evaluations && data.evaluations.length) await tx.weeklyEvaluation.createMany({ data: data.evaluations });
      if (data.answers && data.answers.length) await tx.weeklyEvaluationAnswer.createMany({ data: data.answers });
      if (data.appointments && data.appointments.length) await tx.appointment.createMany({ data: data.appointments });
      if (data.audioLogs && data.audioLogs.length) await tx.audioLog.createMany({ data: data.audioLogs });
      if (data.activityProgress && data.activityProgress.length) await tx.activityProgress.createMany({ data: data.activityProgress });
      if (data.bitacoraLogs && data.bitacoraLogs.length) await tx.bitacoraLog.createMany({ data: data.bitacoraLogs });
      if (data.userCompletedWeeks && data.userCompletedWeeks.length) await tx.userCompletedWeek.createMany({ data: data.userCompletedWeeks });
      if (data.messages && data.messages.length) await tx.message.createMany({ data: data.messages });
    });

    res.json({ message: 'Base de datos restaurada exitosamente' });
  } catch (error: any) {
    console.error('Restore error:', error);
    res.status(500).json({ error: 'Error al restaurar base de datos. Verifica el archivo JSON.', details: error.message });
  }
});

export default router;

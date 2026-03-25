import { readFileSync } from 'fs';
import { prisma } from './prisma';

async function restore() {
  try {
    console.log("Iniciando restauración de base de datos...");
    const rawData = readFileSync('./Respaldo_Equilibrar_2026-03-24.json', 'utf8');
    const data = JSON.parse(rawData);

    if (!data || !data.users || !data.services) {
      throw new Error('Formato de respaldo inválido');
    }

    await prisma.$transaction(async (tx) => {
      console.log("Eliminando datos antiguos...");
      await tx.message.deleteMany();
      await tx.bitacoraLog.deleteMany();
      await tx.activityProgress.deleteMany();
      await tx.audioLog.deleteMany();
      await tx.appointment.deleteMany();
      await tx.weeklyEvaluationAnswer.deleteMany();
      await tx.weeklyEvaluation.deleteMany();
      await tx.question.deleteMany();
      await tx.weekContent.deleteMany();
      await tx.rFAIService.deleteMany();
      await tx.userCompletedWeek.deleteMany();
      try { await tx.diagnosticResult.deleteMany(); } catch (e) {}
      await tx.user.deleteMany();

      console.log("Inyectando respaldo JSON a las tablas...");
      if (data.users && data.users.length) {
        const mappedUsers = data.users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          passwordHash: u.password,
          role: u.role,
          currentWeek: u.currentWeek,
          phone: u.phone,
          meetLink: u.meetLink,
          notes: u.notes,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt
        }));
        await tx.user.createMany({ data: mappedUsers });
      }
      if (data.services && data.services.length) await tx.rFAIService.createMany({ data: data.services });
      if (data.weekContents && data.weekContents.length) await tx.weekContent.createMany({ data: data.weekContents });
      if (data.questions && data.questions.length) await tx.question.createMany({ data: data.questions });
      if (data.evaluations && data.evaluations.length) await tx.weeklyEvaluation.createMany({ data: data.evaluations });
      if (data.answers && data.answers.length) await tx.weeklyEvaluationAnswer.createMany({ data: data.answers });
      if (data.appointments && data.appointments.length) {
        const mappedAppointments = data.appointments.map((a: any) => ({
          id: a.id,
          clientId: a.patientId,
          date: new Date(a.date).toISOString(),
          timeStr: a.time,
          patientName: a.patientName,
          rfaiType: a.type,
          meetLink: a.meetLink,
          status: a.status === 'upcoming' ? 'SCHEDULED' : a.status === 'completed' ? 'COMPLETED' : 'SCHEDULED',
          sessionType: 'ONLINE',
          weekNumber: a.weekNumber,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt
        }));
        await tx.appointment.createMany({ data: mappedAppointments });
      }
      if (data.audioLogs && data.audioLogs.length) await tx.audioLog.createMany({ data: data.audioLogs });
      if (data.activityProgress && data.activityProgress.length) await tx.activityProgress.createMany({ data: data.activityProgress });
      if (data.bitacoraLogs && data.bitacoraLogs.length) await tx.bitacoraLog.createMany({ data: data.bitacoraLogs });
      if (data.userCompletedWeeks && data.userCompletedWeeks.length) await tx.userCompletedWeek.createMany({ data: data.userCompletedWeeks });
      if (data.messages && data.messages.length) await tx.message.createMany({ data: data.messages });
    });

    console.log('¡Base de datos restaurada exitosamente!');
    process.exit(0);
  } catch (error: any) {
    console.error('Error al restaurar base de datos:', error);
    process.exit(1);
  }
}

restore();

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportDeepData() {
    console.log("Extrayendo datos de la Base de Datos Local...");
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
      audioLogs: await prisma.audioLog.findMany()
    };
    
    fs.writeFileSync('Nuevo_Respaldo_ERP.json', JSON.stringify(backupData, null, 2));
    console.log("Replicación completada: Nuevo_Respaldo_ERP.json creado.");
}

exportDeepData().catch(e => console.error(e)).finally(() => prisma.$disconnect());

import prisma from '../utils/db';
import fs from 'fs';
import path from 'path';


async function importDeepData() {
    console.log("Iniciando reconstrucción de Base de Datos Productiva...");
    
    const filePath = path.join(__dirname, '../../../Respaldo_ERP_Global_2026-03-31.json');
    if (!fs.existsSync(filePath)) {
        console.error(`Error: Archivo de respaldo no encontrado en: ${filePath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const db = JSON.parse(rawData);

    console.log("Purgando tablas actuales (TRUNCATE CASCADE)...");
    
    // Truncate principal tables with CASCADE to wipe out all data
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Branch", "Product", "Course", "Module", "AgendaService", "Program", "RFAIService" CASCADE;`);
    
    console.log("Inyectando registros en orden topológico (Dependencias Foráneas)...");

    // LEVEL 1 (Independent)
    if (db.users?.length) {
        console.log(`[1] Users: ${db.users.length}`);
        await prisma.user.createMany({ data: db.users });
    }
    if (db.branches?.length) {
        console.log(`[1] Branches: ${db.branches.length}`);
        await prisma.branch.createMany({ data: db.branches });
    }
    if (db.products?.length) {
        console.log(`[1] Products: ${db.products.length}`);
        await prisma.product.createMany({ data: db.products });
    }
    if (db.courses?.length) {
        console.log(`[1] Courses: ${db.courses.length}`);
        await prisma.course.createMany({ data: db.courses });
    }
    if (db.programs?.length) {
        console.log(`[1] Programs: ${db.programs.length}`);
        await prisma.program.createMany({ data: db.programs });
    }
    if (db.rfaiServices?.length) {
        console.log(`[1] RFAIServices: ${db.rfaiServices.length}`);
        await prisma.rFAIService.createMany({ data: db.rfaiServices });
    }

    // LEVEL 2
    if (db.profiles?.length) {
        console.log(`[2] Profiles: ${db.profiles.length}`);
        await prisma.profile.createMany({ data: db.profiles });
    }
    if (db.modules?.length) {
        console.log(`[2] Modules: ${db.modules.length}`);
        await prisma.module.createMany({ data: db.modules });
    }
    if (db.services?.length) {
        console.log(`[2] AgendaServices: ${db.services.length}`);
        await prisma.agendaService.createMany({ data: db.services });
    }
    if (db.audioLogs?.length) {
        console.log(`[2] AudioLogs: ${db.audioLogs.length}`);
        // ensure dates are instantiated if necessary, or let createMany pass strings (Prisma usually auto-converts)
        await prisma.audioLog.createMany({ data: db.audioLogs });
    }
    if (db.userCompletedWeeks?.length) {
        console.log(`[2] UserCompletedWeeks: ${db.userCompletedWeeks.length}`);
        await prisma.userCompletedWeek.createMany({ data: db.userCompletedWeeks });
    }
    if (db.evaluations?.length) {
        console.log(`[2] Evaluations: ${db.evaluations.length}`);
        await prisma.weeklyEvaluation.createMany({ data: db.evaluations });
    }

    // LEVEL 3
    if (db.programServices?.length) {
        console.log(`[3] ProgramServices: ${db.programServices.length}`);
        await prisma.programService.createMany({ data: db.programServices });
    }
    if (db.answers?.length) {
        console.log(`[3] Answers: ${db.answers.length}`);
        await prisma.weeklyEvaluationAnswer.createMany({ data: db.answers });
    }
    if (db.appointments?.length) {
        console.log(`[3] Appointments: ${db.appointments.length}`);
        await prisma.appointment.createMany({ data: db.appointments });
    }

    // LEVEL 4
    if (db.payments?.length) {
        console.log(`[4] Payments: ${db.payments.length}`);
        await prisma.payment.createMany({ data: db.payments });
    }

    console.log("Sincronización Transaccional Completada Exitosamente.");
}

importDeepData()
    .catch(e => {
        console.error("Error Importación:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());

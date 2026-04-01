import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { profile: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
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
    if (e.code === 'P2002') return res.status(400).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
    res.status(500).json({error: e.message || 'Failed to create user'}); 
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, password, firstName, lastName, phone, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink } = req.body;
    
    let updateData: any = {
      email, role, phone,
      ...(firstName && lastName ? { name: `${firstName} ${lastName}` } : {}),
      profile: {
        upsert: {
          create: { firstName, lastName, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink },
          update: { firstName, lastName, documentId, address, city, specialty, color, healthSystem, complementaryInsurance, commune, birthDate, emergencyPhone, emergencyContactName, observations, medicalRecordLink }
        }
      }
    };

    if (password && password.trim().length > 0) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { profile: true }
    });
    res.json(user);
  } catch(e: any) { 
    console.error(e); 
    if (e.code === 'P2002') return res.status(400).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
    res.status(500).json({error: e.message || 'Failed to update user'}); 
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e: any) { console.error(e); res.status(500).json({error: 'Failed to delete user'}); }
});

router.put('/:id/week', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentWeek } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { currentWeek: Number(currentWeek) }
    });
    res.json(user);
  } catch(e: any) {
    console.error('Error updating week:', e);
    res.status(500).json({ error: 'Failed to update user week' });
  }
});

// GET /api/data/users/:id/programs - Fetch purchased programs via Payments
router.get('/:id/programs', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1. Get all actual completed purchases (non-internal)
    const payments = await prisma.payment.findMany({
      where: {
        userId: id,
        status: 'COMPLETED',
        paymentMethod: { not: 'INTERNAL' }
      }
    });

    const activeConcepts = Array.from(new Set(payments.map(p => p.concept).filter(Boolean)));
    
    // 2. Map concepts to actual Programs, Courses, or RFAIServices
    let matchedPrograms: any[] = [];
    
    for (const concept of activeConcepts) {
        if (!concept) continue;
        
        let found = false;
        
        // Try Program
        const prog = await prisma.program.findFirst({
           where: { name: concept },
           include: { modules: { orderBy: [{ weekNumber: 'asc' }, { order: 'asc' }] } }
        });
        if (prog) {
           matchedPrograms.push({ type: 'PROGRAM', id: prog.id, title: prog.name, modules: prog.modules });
           found = true;
        }

        if (!found) {
           // Try RFAIService
           const rfai = await prisma.rFAIService.findFirst({
              where: { title: concept },
              include: { modules: { orderBy: [{ weekNumber: 'asc' }, { order: 'asc' }] } }
           });
           if (rfai) {
              matchedPrograms.push({ type: 'RFAI', id: rfai.id, title: rfai.title, modules: rfai.modules });
              found = true;
           }
        }

        if (!found) {
           // Try Course
           const c = await prisma.course.findFirst({
              where: { title: concept },
              include: { modules: { orderBy: [{ weekNumber: 'asc' }, { order: 'asc' }] } }
           });
           if (c) {
              matchedPrograms.push({ type: 'COURSE', id: c.id, title: c.title, modules: c.modules });
           }
        }
    }

    // 3. Fetch future appointments for this user to inject "Videoconferencias"
    const nextAppointments = await prisma.appointment.findMany({
        where: {
           clientId: id,
           date: { gte: new Date() },
           status: { notIn: ['CANCELLED', 'NO_SHOW'] }
        },
        orderBy: { date: 'asc' },
        include: { service: true }
    });

    res.json({
        programs: matchedPrograms,
        currentWeek: user.currentWeek || 1,
        nextAppointments
    });
  } catch (error) {
    console.error('Error fetching user programs:', error);
    res.status(500).json({ error: 'Database error' });
  }
});// GET /api/data/users/:id/bitacora/:weekNumber - Fetch bitacora history
router.get('/:id/bitacora/:weekNumber', async (req, res) => {
   try {
       const { id, weekNumber } = req.params;
       const logs = await prisma.bitacoraLog.findMany({
          where: { userId: id, weekNumber: parseInt(weekNumber) },
          orderBy: { timestamp: 'asc' },
          include: { specialist: { select: { id: true, name: true } } }
       });
       res.json(logs);
   } catch (error) {
       console.error('Error fetching bitacora:', error);
       res.status(500).json({ error: 'Database error' });
   }
});

// POST /api/data/users/:id/bitacora/:weekNumber - Post new bitacora 
router.post('/:id/bitacora/:weekNumber', async (req, res) => {
   try {
       const { id, weekNumber } = req.params;
       const { content } = req.body;
       const log = await prisma.bitacoraLog.create({
          data: {
             userId: id,
             weekNumber: parseInt(weekNumber),
             content
          }
       });
       res.json(log);
   } catch (error) {
       console.error('Error saving bitacora:', error);
       res.status(500).json({ error: 'Database error' });
   }
});

// GET /api/data/users/:id/bitacoras - Fetch ALL bitacora history for a user
router.get('/:id/bitacoras', async (req, res) => {
   try {
       const { id } = req.params;
       const logs = await prisma.bitacoraLog.findMany({
          where: { userId: id },
          orderBy: { timestamp: 'desc' },
          include: { specialist: { select: { id: true, name: true } } }
       });
       res.json(logs);
   } catch (error) {
       console.error('Error fetching all bitacoras:', error);
       res.status(500).json({ error: 'Database error' });
   }
});

// PUT /api/data/users/:id/bitacoras/:logId/reply - Add specialist reply
router.put('/:id/bitacoras/:logId/reply', async (req, res) => {
    try {
        const { logId } = req.params;
        const { response, specialistId } = req.body;
        
        const log = await prisma.bitacoraLog.update({
            where: { id: logId },
            data: {
                response,
                specialistId,
                respondedAt: new Date()
            }
        });
        res.json(log);
    } catch (error) {
        console.error('Error saving bitacora reply:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;

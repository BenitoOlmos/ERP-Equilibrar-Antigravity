import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all clinical records for a specific client
router.get('/client/:clientId', async (req, res) => {
  try {
    const records = await prisma.clinicalRecord.findMany({
      where: { clientId: req.params.clientId },
      include: {
        specialist: { select: { name: true, profile: true } },
        appointment: { include: { service: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch(e: any) {
    res.status(500).json({ error: e.message || 'Failed to fetch clinical records' });
  }
});

// Create a new clinical record
router.post('/', async (req, res) => {
  try {
    const { clientId, specialistId, appointmentId, date, reason, anamnesis, diagnosis, treatment, evolution, observations, isSigned } = req.body;
    const record = await prisma.clinicalRecord.create({
      data: {
        clientId,
        specialistId,
        appointmentId: appointmentId || null,
        date: date ? new Date(date) : new Date(),
        reason,
        anamnesis,
        diagnosis,
        treatment,
        evolution,
        observations,
        isSigned: isSigned || false
      },
      include: { specialist: { select: { name: true, profile: true } } }
    });
    res.json(record);
  } catch(e: any) {
    res.status(500).json({ error: e.message || 'Failed to create clinical record' });
  }
});

// Update a clinical record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, anamnesis, diagnosis, treatment, evolution, observations, isSigned } = req.body;
    
    // Check if it's signed already (if we want strict rules, we could block edits here)
    const existing = await prisma.clinicalRecord.findUnique({ where: { id } });
    if (existing?.isSigned && !req.body.overrideSign) {
       // Optional: Block edits if signed
    }

    const record = await prisma.clinicalRecord.update({
      where: { id },
      data: {
        reason, anamnesis, diagnosis, treatment, evolution, observations, isSigned
      },
      include: { specialist: { select: { name: true, profile: true } } }
    });
    res.json(record);
  } catch(e: any) {
    res.status(500).json({ error: e.message || 'Failed to update clinical record' });
  }
});

// Delete a clinical record
router.delete('/:id', async (req, res) => {
  try {
    await prisma.clinicalRecord.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch(e: any) {
    res.status(500).json({ error: e.message || 'Failed to delete clinical record' });
  }
});

export default router;

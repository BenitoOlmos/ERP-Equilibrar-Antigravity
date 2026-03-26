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

export default router;

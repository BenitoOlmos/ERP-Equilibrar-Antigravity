import { Router } from 'express';
import prisma from '../utils/db';

const router = Router();

// Obtener todas las sucursales
router.get('/', async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(branches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una sucursal
router.post('/', async (req, res) => {
  try {
    const { name, type, address, contactName, phone, meetLink, isActive } = req.body;
    const newBranch = await prisma.branch.create({
      data: {
        name,
        type,
        address,
        contactName,
        phone,
        meetLink,
        isActive: isActive ?? true
      }
    });
    res.status(201).json(newBranch);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una sucursal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, address, contactName, phone, meetLink, isActive } = req.body;
    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        name,
        type,
        address,
        contactName,
        phone,
        meetLink,
        isActive
      }
    });
    res.json(updatedBranch);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una sucursal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.branch.delete({
      where: { id }
    });
    res.json({ message: 'Sucursal eliminada correctamente' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

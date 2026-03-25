import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { completedWeeks: true }
        });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                currentWeek: user.currentWeek,
                completedWeeks: user.completedWeeks.map(cw => cw.weekNumber),
                notes: user.notes,
                phone: user.phone,
                createdAt: user.createdAt.toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;

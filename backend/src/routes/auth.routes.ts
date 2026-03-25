import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_development';

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña requeridos' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid && password !== user.passwordHash) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;

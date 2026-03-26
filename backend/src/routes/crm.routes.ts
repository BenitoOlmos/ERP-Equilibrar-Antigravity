import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==================
// CRM: LEADS AGGREGATOR
// ==================
router.get('/leads', async (req, res) => {
    try {
        const leads = await prisma.user.findMany({
            where: {
                role: { in: ['USER', 'CLIENT', 'PATIENT'] }
            },
            include: {
                profile: true,
                diagnostic: true,
                payments: true,
                appointmentsAsClient: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        console.error('Error fetching CRM leads:', error);
        res.status(500).json({ message: 'Failed to fetch CRM leads' });
    }
});

router.put('/leads/:id/notes', async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { notes }
        });
        
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating lead notes:', error);
        res.status(500).json({ message: 'Failed to update notes' });
    }
});

router.get('/diagnostics', async (req, res) => {
    try {
        const diagnostics = await prisma.diagnosticResult.findMany({
            include: { user: true },
            orderBy: { date: 'desc' }
        });
        res.json(diagnostics);
    } catch (error) {
        console.error('Error fetching diagnostics:', error);
        res.status(500).json({ message: 'Failed to fetch diagnostics' });
    }
});

router.post('/diagnostics', async (req, res) => {
    try {
        const { name, email, phone, AF, AM, AE, R, ITA, Re, IDSE, interpretacion, perfil } = req.body;
        
        if (!email || !name) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        // 1. Resolve Prospect User profile
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    phone: phone || null,
                    role: 'USER', // Web Prospect
                    isActive: true
                }
            });
        } else if (phone && !user.phone) {
            await prisma.user.update({
                where: { id: user.id },
                data: { phone }
            });
        }

        // 2. Upsert Diagnostic Snapshot
        const diagnostic = await prisma.diagnosticResult.upsert({
            where: { userId: user.id },
            update: {
                date: new Date(),
                af: parseInt(AF),
                am: parseInt(AM),
                ae: parseInt(AE),
                r: parseInt(R),
                ita: parseInt(ITA),
                re: parseInt(Re),
                idsE: parseInt(IDSE),
                interpretation: interpretacion,
                profile: perfil,
                status: 'INICIA_RFAI'
            },
            create: {
                userId: user.id,
                date: new Date(),
                af: parseInt(AF),
                am: parseInt(AM),
                ae: parseInt(AE),
                r: parseInt(R),
                ita: parseInt(ITA),
                re: parseInt(Re),
                idsE: parseInt(IDSE),
                interpretation: interpretacion,
                profile: perfil,
                status: 'INICIA_RFAI'
            }
        });

        res.status(201).json({ message: 'Diagnostic saved successfully', diagnostic });
    } catch (error) {
        console.error('Error saving web diagnostic:', error);
        res.status(500).json({ message: 'Failed to save diagnostic data' });
    }
});

router.put('/diagnostics/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.diagnosticResult.update({
            where: { id },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error updating diagnostic status:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
});

export default router;

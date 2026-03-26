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
                diagnostics: { orderBy: { date: 'desc' } },
                payments: true,
                appointmentsAsClient: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        // Mapeamos 'diagnostics' a 'diagnostic' para que la vista /crm React antigua no crashee
        const mappedLeads = leads.map(l => {
            const { diagnostics, ...rest } = l as any;
            return {
                ...rest,
                diagnostic: diagnostics && diagnostics.length > 0 ? diagnostics[0] : null
            };
        });
        
        res.json(mappedLeads);
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
            include: { 
                 user: { 
                     include: { profile: true } 
                 } 
            },
            orderBy: { date: 'desc' }
        });
        res.json(diagnostics);
    } catch (error) {
        console.error('Error fetching diagnostics:', error);
        res.status(500).json({ message: 'Failed to fetch diagnostics' });
    }
});

router.get('/diagnostics/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const diagnostics = await prisma.diagnosticResult.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(diagnostics);
    } catch (error) {
        console.error('Error fetching user diagnostic:', error);
        res.status(500).json({ message: 'Failed to fetch user diagnostic' });
    }
});

router.post('/diagnostics', async (req, res) => {
    try {
        const { name, firstName, lastName, email, phone, AF, AM, AE, R, ITA, Re, IDSE, interpretacion, perfil } = req.body;
        
        if (!email || (!name && !firstName)) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        const fullName = name || `${firstName} ${lastName}`;

        // 1. Resolve Prospect User profile
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: fullName,
                    phone: phone || null,
                    role: 'USER', // Web Prospect
                    isActive: true
                }
            });
        } else {
            // Refrescamos nombre y teléfono si el usuario ya existía pero estaban vacíos
            await prisma.user.update({
                where: { id: user.id },
                data: { 
                    phone: phone || user.phone,
                    name: user.name || fullName
                }
            });
        }

        // 1.5 Sincronizar Ficha Clínica CRM (Profile)
        if (firstName && lastName) {
            await prisma.profile.upsert({
                where: { userId: user.id },
                update: { firstName, lastName },
                create: { userId: user.id, firstName, lastName }
            });
        }

        // 2. Insert Diagnostic Snapshot (Append al historial)
        const diagnostic = await prisma.diagnosticResult.create({
            data: {
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

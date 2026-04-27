import { Router, Request, Response } from 'express';
import prisma from '../utils/db';

const router = Router();

// Get all programs, courses, and rfai services with their virtual agents
router.get('/', async (req: Request, res: Response) => {
    try {
        const programs = await prisma.program.findMany({ include: { virtualAgent: true } });
        const courses = await prisma.course.findMany({ include: { virtualAgent: true } });
        const rfaiServices = await prisma.rFAIService.findMany({ include: { virtualAgent: true } });

        res.json({
            programs,
            courses,
            rfaiServices
        });
    } catch (error: any) {
        console.error('Error fetching services with virtual agents:', error);
        res.status(500).json({ error: 'Failed to fetch virtual agents data' });
    }
});

// Upsert a Virtual Agent for a specific service
router.post('/upsert', async (req: Request, res: Response) => {
    try {
        const { serviceType, serviceId, systemPrompt, welcomeMessage } = req.body;
        
        if (!serviceType || !serviceId || !systemPrompt) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let existingAgent = null;

        if (serviceType === 'PROGRAM') {
            existingAgent = await prisma.virtualAgent.findFirst({ where: { programId: serviceId } });
        } else if (serviceType === 'COURSE') {
            existingAgent = await prisma.virtualAgent.findFirst({ where: { courseId: serviceId } });
        } else if (serviceType === 'RFAI') {
            existingAgent = await prisma.virtualAgent.findFirst({ where: { rfaiServiceId: serviceId } });
        }

        let savedAgent;
        const data = {
            systemPrompt,
            welcomeMessage,
            programId: serviceType === 'PROGRAM' ? serviceId : undefined,
            courseId: serviceType === 'COURSE' ? serviceId : undefined,
            rfaiServiceId: serviceType === 'RFAI' ? serviceId : undefined,
        };

        if (existingAgent) {
            savedAgent = await prisma.virtualAgent.update({
                where: { id: existingAgent.id },
                data
            });
        } else {
            savedAgent = await prisma.virtualAgent.create({
                data
            });
        }

        res.json(savedAgent);
    } catch (error: any) {
        console.error('Error upserting virtual agent:', error);
        res.status(500).json({ error: 'Failed to update virtual agent prompt', details: error.message });
    }
});

export default router;

import { Router } from 'express';
import { serviceService } from '../services/serviceService';
import { ProfileType } from '../../../shared';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const profile = req.query.profile as ProfileType;
        if (profile) {
            const service = await serviceService.getServiceByProfile(profile);
            if (!service) return res.status(404).json({ error: 'Service not found' });
            return res.json(service);
        }
        const services = await serviceService.getAllServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

router.post('/', authMiddleware, requireRole(['Admin', 'Especialista']), async (req, res) => {
    try {
        const service = await serviceService.createOrUpdateService(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create/update service' });
    }
});

export default router;

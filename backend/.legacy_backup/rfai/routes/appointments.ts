import { Router } from 'express';
import { appointmentService } from '../services/appointmentService';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const patientId = req.query.patientId as string;
        if (patientId) {
            const appointments = await appointmentService.getAppointmentsByPatientId(patientId);
            return res.json(appointments);
        }
        const appointments = await appointmentService.getAllAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await appointmentService.deleteAppointment(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

export default router;

import { Router } from 'express';
import { hrController } from '../controllers/hr.controller';

const router = Router();

// Economic Indicators
router.get('/indicators', hrController.getEconomicIndicators);

// Employee (Planta)
router.get('/employees', hrController.getEmployees);
router.post('/employees', hrController.createEmployee);
router.post('/payroll/calculate', hrController.calculatePayroll);
router.post('/payroll/save', hrController.savePayroll);

// Honorarios (Indirect Professionals)
router.get('/honorarios', hrController.getHonorariumProfiles);
router.post('/honorarios', hrController.addHonorariumProfile);
router.post('/honorarios/receipt', hrController.registerReceipt);

export default router;

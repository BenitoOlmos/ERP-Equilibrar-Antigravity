import { Router } from 'express';
import { getAllServices, getServiceBySlug } from '../controllers/serviceController';

const router = Router();

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

export default router;

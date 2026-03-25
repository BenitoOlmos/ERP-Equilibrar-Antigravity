import { Router } from 'express';
import { getAllPrograms, getProgramBySlug } from '../controllers/programController';

const router = Router();

router.get('/', getAllPrograms);
router.get('/:slug', getProgramBySlug);

export default router;

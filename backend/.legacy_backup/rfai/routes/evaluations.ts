import { Router } from 'express';
import { evaluationService } from '../services/evaluationService';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        const evaluations = await evaluationService.getEvaluationsByUserId(userId);
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch evaluations' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const evaluation = await evaluationService.createEvaluation(req.body);
        res.status(201).json(evaluation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create evaluation' });
    }
});

export default router;

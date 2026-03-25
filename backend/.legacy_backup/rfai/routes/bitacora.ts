import { Router, Response } from 'express';
import { bitacoraService } from '../services/bitacoraService';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user!;

    if (requestingUser.userId !== userId && !['Admin', 'Especialista'].includes(requestingUser.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const logs = await bitacoraService.getLogsByUser(userId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bitacora logs' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, weekNumber, content } = req.body;
    const requestingUser = req.user!;

    if (requestingUser.userId !== userId && !['Admin', 'Especialista'].includes(requestingUser.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    if (!userId || !weekNumber || !content) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const log = await bitacoraService.createLog({ userId, weekNumber, content });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bitacora log' });
  }
});

export default router;

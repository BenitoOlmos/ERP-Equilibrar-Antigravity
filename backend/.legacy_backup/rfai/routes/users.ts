import { Router } from 'express';
import { userService } from '../services/userService';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authMiddleware, requireRole(['Admin', 'Especialista']), async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/specialists', authMiddleware, async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        const specialists = users.filter((u: any) => u.role === 'Especialista' || u.role === 'Admin');
        res.json(specialists.map((s: any) => ({ id: s.id, name: s.name, role: s.role })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch specialists' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

router.post('/', authMiddleware, requireRole(['Admin', 'Especialista']), async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/:id', authMiddleware, requireRole(['Admin', 'Especialista']), async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;

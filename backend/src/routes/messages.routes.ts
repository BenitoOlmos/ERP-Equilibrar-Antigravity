import express from 'express';
import prisma from '../utils/db';

const router = express.Router();

// GET /api/data/messages/conversation/:user1Id/:user2Id
router.get('/conversation/:user1Id/:user2Id', async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user1Id, receiverId: user2Id },
                    { senderId: user2Id, receiverId: user1Id }
                ]
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } }
            }
        });
        
        // Mark as read if user1 requested them and user2 sent them
        await prisma.message.updateMany({
            where: { receiverId: user1Id, senderId: user2Id, read: false },
            data: { read: true }
        });

        res.json(messages);
    } catch (e) {
        console.error('Error fetching conversation:', e);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// GET /api/data/messages/history/:userId
// Gets all unique conversations for a specific user.
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Fetch all messages where user is sender or receiver
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } }
            }
        });
        
        res.json(messages);
    } catch (e) {
        console.error('Error fetching history:', e);
        res.status(500).json({ error: 'Failed to fetch messages history' });
    }
});

// PUT /api/data/messages/read
// Marks all messages received by the user from a specific sender as read
router.put('/read', async (req, res) => {
    try {
        const { receiverId, senderId } = req.body;
        if (!receiverId || !senderId) return res.status(400).json({ error: 'Missing logic' });

        await prisma.message.updateMany({
            where: { receiverId, senderId, read: false },
            data: { read: true }
        });
        
        res.json({ success: true });
    } catch (e) {
        console.error("Error marking messages as read:", e);
        res.status(500).json({ error: "Failed to mark as read" });
    }
});

// POST /api/data/messages/send
router.post('/send', async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        
        if (!senderId || !content) {
            return res.status(400).json({ error: 'senderId and content are required' });
        }
        
        let finalReceiverId = receiverId;
        
        // If from client and no particular receiver is known, assign to first Specialist or Admin
        if (!finalReceiverId) {
            const admin = await prisma.user.findFirst({
                where: { role: { in: ['Especialista', 'Super Admin', 'Administrador'] }, isActive: true }
            });
            if (admin) {
                finalReceiverId = admin.id;
            } else {
                return res.status(500).json({ error: 'No administrative receiver valid for routing.' });
            }
        }
        
        const newMsg = await prisma.message.create({
            data: {
                senderId,
                receiverId: finalReceiverId,
                content
            },
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } }
            }
        });
        
        res.json(newMsg);
    } catch (e) {
        console.error('Error sending message:', e);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;

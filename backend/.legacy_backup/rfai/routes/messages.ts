import express from 'express';
import { messageService } from '../services/messageService.ts';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware.ts';

const router = express.Router();

// Required authentication for all message routes
router.use(authMiddleware);

// Get conversation history with a specific user
router.get('/:userId', async (req: AuthRequest, res) => {
  try {
    const currentUserId = req.user!.userId;
    const otherUserId = req.params.userId;
    
    const messages = await messageService.getConversation(currentUserId, otherUserId);
    
    // Auto-mark fetched messages as read
    await messageService.markAsRead(otherUserId, currentUserId);
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a new message
router.post('/', async (req: AuthRequest, res: any) => {
  try {
    const senderId = req.user!.userId;
    const { receiverId, content } = req.body;
    
    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    const newMessage = await messageService.sendMessage(senderId, receiverId, content);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread count for current user
router.get('/unread/count', async (req: AuthRequest, res) => {
  try {
    const currentUserId = req.user!.userId;
    const count = await messageService.getUnreadCount(currentUserId);
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get grouped unread counts for current user
router.get('/unread/grouped', async (req: AuthRequest, res) => {
  try {
    const currentUserId = req.user!.userId;
    const groupedCounts = await messageService.getUnreadCountsGroupedBySender(currentUserId);
    res.json(groupedCounts);
  } catch (error) {
    console.error('Error fetching grouped unread counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

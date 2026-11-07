import { Router } from 'express';
import prisma from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/messages/:otherUserId - Get messages between current user and another user
router.get('/:otherUserId', requireAuth, async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        read: false,
      },
      data: { read: true },
    });

    return res.json(messages);
  } catch (err) {
    next(err);
  }
});

// POST /api/messages - Send a message
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text || !text.trim()) {
      return res.status(400).json({ message: 'receiverId and text are required' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        text: text.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

export default router;


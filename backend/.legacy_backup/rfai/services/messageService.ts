import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const messageService = {
  // Get all messages between two users (ordered chronologically)
  getConversation: async (userId1: string, userId2: string) => {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: { id: true, name: true, profile: true },
        },
      },
    });
  },

  // Send a new message
  sendMessage: async (senderId: string, receiverId: string, content: string) => {
    return prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true, profile: true },
        },
      },
    });
  },

  // Mark all unread messages from a specific sender to a receiver as read
  markAsRead: async (senderId: string, receiverId: string) => {
    return prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: receiverId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  },

  // Get unread message count for a specific user
  getUnreadCount: async (userId: string) => {
    return prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
  },

  // Get unread counts grouped by sender
  getUnreadCountsGroupedBySender: async (userId: string) => {
    const grouped = await prisma.message.groupBy({
      by: ['senderId'],
      where: {
        receiverId: userId,
        read: false,
      },
      _count: {
        id: true,
      },
    });

    return grouped.reduce((acc, curr) => {
      acc[curr.senderId] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);
  },
};

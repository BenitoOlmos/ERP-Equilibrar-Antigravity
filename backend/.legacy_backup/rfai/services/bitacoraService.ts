import { prisma } from '../prisma';

export interface BitacoraPayload {
  userId: string;
  weekNumber: number;
  content: string;
}

export const bitacoraService = {
  async getLogsByUser(userId: string) {
    return await prisma.bitacoraLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  },

  async createLog(data: BitacoraPayload) {
    return await prisma.bitacoraLog.create({
      data: {
        userId: data.userId,
        weekNumber: data.weekNumber,
        content: data.content,
      },
    });
  },

  async deleteLog(logId: string, userId: string, role: string) {
    const log = await prisma.bitacoraLog.findUnique({ where: { id: logId } });
    if (!log) throw new Error('Log not found');
    
    // Only admins/specialists or the owner can delete
    if (log.userId !== userId && !['Admin', 'Especialista'].includes(role)) {
      throw new Error('Unauthorized');
    }

    return await prisma.bitacoraLog.delete({
      where: { id: logId },
    });
  }
};

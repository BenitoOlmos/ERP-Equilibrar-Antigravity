import { PrismaClient } from '@prisma/client';

// Agrega una instancia global al objeto global de NodeJS en desarrollo
// para evitar múltiples conexiones durante recargas en caliente (hot reload).
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

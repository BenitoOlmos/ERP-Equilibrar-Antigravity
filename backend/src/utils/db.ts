import { PrismaClient } from '@prisma/client';
import { requestContext } from './asyncLocalStorage';

declare global {
  var prisma: PrismaClient | undefined;
}

const basePrisma = global.prisma || new PrismaClient();

// Add Audit Log Middleware via Prisma Extensions
const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async create({ model, operation, args, query }) {
        const result = await query(args);
        const ctx = requestContext.getStore();
        if (ctx?.userId && model !== 'AuditLog') {
          basePrisma.auditLog.create({
            data: {
              userId: ctx.userId,
              action: 'CREATE',
              model: model as string,
              recordId: (result as any)?.id || 'unknown',
              details: args.data ? JSON.parse(JSON.stringify(args.data)) : null,
            }
          }).catch(console.error);
        }
        return result;
      },
      async update({ model, operation, args, query }) {
        const result = await query(args);
        const ctx = requestContext.getStore();
        if (ctx?.userId && model !== 'AuditLog') {
          basePrisma.auditLog.create({
            data: {
              userId: ctx.userId,
              action: 'UPDATE',
              model: model as string,
              recordId: (result as any)?.id || 'unknown',
              details: args.data ? JSON.parse(JSON.stringify(args.data)) : null,
            }
          }).catch(console.error);
        }
        return result;
      },
      async delete({ model, operation, args, query }) {
        const result = await query(args);
        const ctx = requestContext.getStore();
        if (ctx?.userId && model !== 'AuditLog') {
          basePrisma.auditLog.create({
            data: {
              userId: ctx.userId,
              action: 'DELETE',
              model: model as string,
              recordId: (result as any)?.id || 'unknown',
            }
          }).catch(console.error);
        }
        return result;
      }
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = basePrisma;
}

export default prisma as unknown as PrismaClient;

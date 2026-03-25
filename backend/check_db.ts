import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.count();
  const services = await prisma.agendaService.count();
  console.log(`Users count: ${users}`);
  console.log(`Services count: ${services}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());

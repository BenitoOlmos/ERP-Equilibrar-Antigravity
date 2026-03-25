const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Querying leads...');
  const leads = await prisma.user.findMany({
      where: {
          role: { in: ['USER', 'CLIENT', 'PATIENT'] }
      },
      include: {
          profile: true,
          diagnostic: true,
          appointmentsAsClient: {
              orderBy: { date: 'desc' },
              take: 1
          }
      },
      orderBy: { createdAt: 'desc' }
  });
  console.log(`Found ${leads.length} leads.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

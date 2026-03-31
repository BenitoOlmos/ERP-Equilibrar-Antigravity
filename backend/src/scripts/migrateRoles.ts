import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando migración de roles de Inglés a Español...');

  const users = await prisma.user.findMany();
  let count = 0;

  for (const user of users) {
    let newRole = null;

    if (user.role === 'ADMIN') newRole = 'Administrador';
    if (user.role === 'COORDINATOR') newRole = 'Coordinador';
    if (user.role === 'SPECIALIST') newRole = 'Especialista';
    if (['CLIENT', 'PATIENT', 'USER'].includes(user.role)) newRole = 'Cliente';

    // No tocar los que ya están migrados o que tienen un rol que no reconocemos manualmente.
    if (newRole) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: newRole }
      });
      console.log(`Migrado: ${user.email} (${user.role} -> ${newRole})`);
      count++;
    }
  }

  console.log(`Migración finalizada. Se actualizaron ${count} perfiles exitosamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

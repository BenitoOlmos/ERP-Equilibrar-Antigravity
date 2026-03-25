const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  console.log('Iniciando carga masiva de clientes al CRM...');

  const passwordHash = await bcrypt.hash('cliente123', 10);

  const roles = ['USER', 'CLIENT', 'PATIENT'];
  const firstNames = ['María', 'Juan', 'Camila', 'Andrea', 'Carlos', 'Pedro', 'Laura', 'Sofía', 'Daniel', 'José', 'Martín', 'Elena', 'Valentina', 'Felipe', 'Ricardo'];
  const lastNames = ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Gómez', 'Tapia', 'Morales', 'Castro', 'Araya', 'Sepúlveda'];
  const rfaiProfiles = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];

  for (let i = 1; i <= 25; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@ejemplo.com`;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: passwordHash,
        role: role,
        name: `${fn} ${ln}`,
        phone: `+569${Math.floor(10000000 + Math.random() * 90000000)}`,
        notes: Math.random() > 0.5 ? `Cliente generado a las ${new Date().toISOString()}. Interesado en tratamientos de bienestar.` : null,
        profile: {
          create: {
            firstName: fn,
            lastName: ln,
            documentId: `${Math.floor(10000000 + Math.random() * 9000000)}-${Math.floor(Math.random() * 9)}`,
            birthDate: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
            city: 'Santiago',
            commune: 'Providencia'
          }
        }
      }
    });

    // 60% chance to have a diagnostic RFAI
    if (Math.random() > 0.4) {
      await prisma.diagnosticResult.create({
        data: {
          userId: user.id,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Within last 30 days
          af: Math.floor(Math.random() * 100),
          am: Math.floor(Math.random() * 100),
          ae: Math.floor(Math.random() * 100),
          r: Math.floor(Math.random() * 100),
          ita: Math.floor(Math.random() * 100),
          re: Math.floor(Math.random() * 100),
          idsE: Math.floor(Math.random() * 100),
          profile: rfaiProfiles[Math.floor(Math.random() * rfaiProfiles.length)],
          status: 'COMPLETADO',
          interpretation: 'Perfil con alta necesidad de contención emocional en la fase actual.'
        }
      });
    }
  }

  console.log('✅ 25 clientes/prospectos han sido inyectados exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

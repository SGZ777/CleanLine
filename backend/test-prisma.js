import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.aDM.count();
    console.log(' Conexão OK. ADMs encontrados:', count);
  } catch (error) {
    console.error(' Erro de conexão:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
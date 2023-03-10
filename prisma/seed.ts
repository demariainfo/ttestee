// prisma/seed.ts
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

// Instance of PrismaClient
const prisma = new PrismaClient();

// Set faker localization
faker.setLocale('pt_BR');

// Seed function
async function main() {
  console.log('Seeding...');

  // console.log('Creating users...');
  // const addUsers = Array.from({ length: 50 }, fakerUser);
  // await prisma.usuario.createMany({
  //   data: addUsers,
  // });
}

// Call seed function
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

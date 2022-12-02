import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const newCat = await prisma.category.create({
    data: {
      title: 'Напитки'
    },
  });
  console.log('Created new cat: ', newCat);

  const allCats = await prisma.category.findMany();
  console.log('All categories: ')
  console.dir(allCats, { depth: null });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  const categories = [
    {
      name: "Shoes",
      imageUrl: "/images/shoes/shoe1.jpg",
    },
    {
      name: "Electronics",
      imageUrl: "/images/electronics/eitem1.jpg",
    },
    {
      name: "Furniture",
      imageUrl: "/images/furniture/furniture1.jpg",
    },
  ];

  const imageMap: { [key: string]: string[] } = {
    Shoes: [
      "/images/shoes/shoe1.jpg",
      "/images/shoes/shoe2.jpg",
      "/images/shoes/shoe3.jpg",
    ],
    Electronics: [
      "/images/electronics/eitem1.jpg",
      "/images/electronics/eitem2.jpg",
      "/images/electronics/eitem3.jpg",
    ],
    Furniture: [
      "/images/furniture/furniture1.jpg",
      "/images/furniture/furniture2.jpg",
      "/images/furniture/furniture3.jpg",
    ],
  };

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { imageUrl: cat.imageUrl },
      create: cat,
    });
  }
  console.log("Categories created.");

  const allCategories = await prisma.category.findMany();

  const products: Prisma.ProductCreateManyInput[] = [];

  for (let i = 1; i <= 100; i++) {
    const category =
      allCategories[Math.floor(Math.random() * allCategories.length)];
    const images = imageMap[category.name];
    const imageUrl = images[Math.floor(Math.random() * images.length)];

    products.push({
      name: `Product ${i} in ${category.name}`,
      description: `This is a detailed description for product ${i}, a great item in the ${category.name} category.`,
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      categoryId: category.id,
      imageUrl,
    });
  }

  await prisma.product.createMany({ data: products });
  console.log("100 products created.");

  const users = [
    { email: "admin1@example.com", password: "password123", role: "ADMIN" },
    { email: "admin2@example.com", password: "password123", role: "ADMIN" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        role: user.role as "ADMIN",
      },
    });
  }

  console.log("Admin users created.");
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

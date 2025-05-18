import prisma from "../prisma/client";

export const getProducts = (page: number, pageSize: number) =>
  prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { category: true },
  });

export const getProductById = (id: number) =>
  prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

export const getProductsByCategoryId = (categoryId: number) => {
  return prisma.product.findMany({
    where: {
      categoryId,
    },
    include: {
      category: true,
    },
  });
};

export const searchProducts = (query: string) => {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { category: true },
  });
};

export const featuredProducts = async () => {
  const products = await prisma.product.findMany();
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 12);
};

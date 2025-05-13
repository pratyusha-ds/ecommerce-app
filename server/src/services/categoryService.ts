import prisma from "../prisma/client";

export const getAllCategories = () =>
  prisma.category.findMany({ include: { products: true } });

export const getCategoryById = (id: number) =>
  prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });

export const getProductsByCategoryId = async (
  id: number,
  limit: number,
  offset: number
) => {
  const [totalCount, items] = await prisma.$transaction([
    prisma.product.count({
      where: {
        categoryId: id,
      },
    }),
    prisma.product.findMany({
      where: {
        categoryId: id,
      },
      skip: offset,
      take: limit,
    }),
  ]);

  return {
    totalCount,
    items,
  };
};

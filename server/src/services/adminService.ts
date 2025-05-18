import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { loginUser } from "./userService";

export const getCategories = async () => {
  return await prisma.category.findMany();
};

export const createCategory = async (_: any, { data }: any) => {
  return await prisma.category.create({ data });
};

export const updateCategory = async (_: any, { id, data }: any) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (_: any, { id }: any) => {
  const products = await prisma.product.findMany({
    where: { categoryId: id },
    include: {
      cartItems: true,
    },
  });

  for (const product of products) {
    if (product.cartItems.length > 0) {
      throw new Error(
        "Cannot delete category: some products are still in carts."
      );
    }
  }
  await prisma.category.delete({ where: { id } });
  return true;
};

export const getProducts = async (limit?: number, offset?: number) => {
  const take = limit ? Number(limit) : undefined;
  const skip = offset ? Number(offset) : undefined;

  const [items, totalCount] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { id: "desc" },
      take,
      skip,
    }),
    prisma.product.count(),
  ]);

  return { totalCount, items };
};

export const createProduct = async (_: any, { data }: any) => {
  return await prisma.product.create({ data });
};

export const updateProduct = async (_: any, { id, data }: any) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (_: any, { id }: any) => {
  await prisma.product.delete({ where: { id } });
  return true;
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "USER",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const getOrderById = async (orderId: number) => {
  return await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};
export const deleteUser = async (_: any, { id }: any) => {
  await prisma.user.delete({ where: { id } });
  return true;
};

export const getOrders = async (limit?: number, offset?: number) => {
  const take = limit ? Number(limit) : undefined;
  const skip = offset ? Number(offset) : undefined;

  return await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
    skip,
  });
};

export const getTotalOrderCount = async () => {
  return await prisma.order.count();
};

export const loginAdminUser = async (email: string, password: string) => {
  const { token, user } = await loginUser(email, password);

  if (user.role !== "ADMIN") {
    throw new Error("Not authorized as admin");
  }

  return { token, user };
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      orderItems: { include: { product: true } },
    },
  });
};

export const updateOrderStatus = async (_: any, { orderId, status }: any) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const deleteOrder = async (_: any, { orderId }: any) => {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    return {
      success: true,
      message: `Order #${orderId} deleted successfully.`,
    };
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return {
      success: false,
      message: `Failed to delete order #${orderId}: ${error.message}`,
    };
  }
};

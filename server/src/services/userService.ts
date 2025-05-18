import prisma from "../prisma/client";
import { hashPassword, verifyPassword, signToken } from "../utils/auth";

export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: "USER",
    },
  });

  const token = signToken({ id: user.id, email: user.email });

  return { token, user };
};

export const loginUser = async (
  email: string,
  password: string,
  cartToken?: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
    },
  });

  if (!user) throw new Error("Invalid credentials");

  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  if (cartToken) {
    const guestCart = await prisma.cart.findUnique({
      where: { cartToken },
      include: { items: true },
    });
    if (guestCart && guestCart.items.length > 0) {
      let userCart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: true },
      });

      if (!userCart) {
        userCart = await prisma.cart.create({
          data: {
            userId: user.id,
            items: {
              create: guestCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
          include: { items: true },
        });
      } else {
        for (const guestItem of guestCart.items) {
          const existing = userCart.items.find(
            (i) => i.productId === guestItem.productId
          );
          if (existing) {
            await prisma.cartItem.update({
              where: { id: existing.id },
              data: { quantity: existing.quantity + guestItem.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: {
                cartId: userCart.id,
                productId: guestItem.productId,
                quantity: guestItem.quantity,
              },
            });
          }
        }
      }

      await prisma.cartItem.deleteMany({
        where: { cartId: guestCart.id },
      });

      await prisma.cart.delete({ where: { id: guestCart.id } });
    }
  }

  let userCart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: { userId: user.id },
      include: { items: true },
    });
  }

  const token = signToken({ id: user.id, email: user.email });
  return { token, user, cart: userCart };
};
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      },
    },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { role: "USER" },
    select: {
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; email?: string }
) => {
  return prisma.user.update({
    where: { id: userId },
    data: updates,
  });
};

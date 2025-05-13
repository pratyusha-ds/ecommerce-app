import prisma from "../prisma/client";

export const getCart = async (userId?: string, cartToken?: string) => {
  let cart;

  if (userId) {
    cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }
  } else if (cartToken) {
    cart = await prisma.cart.findUnique({
      where: { cartToken },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { cartToken },
        include: { items: { include: { product: true } } },
      });
    }
  }

  return cart;
};

export const addToCart = async (
  productId: number,
  quantity: number,
  userId?: string,
  cartToken?: string
) => {
  const cart = await getCart(userId, cartToken);

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart!.id, productId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart!.id, productId, quantity },
    });
  }

  return getCart(userId, cartToken);
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });

  return prisma.cart.findUnique({
    where: { id: item!.cartId },
    include: { items: { include: { product: true } } },
  });
};

export const removeCartItem = async (itemId: number) => {
  const item = await prisma.cartItem.delete({ where: { id: itemId } });

  return prisma.cart.findUnique({
    where: { id: item.cartId },
    include: { items: { include: { product: true } } },
  });
};

export const clearCart = async (cartId: number) => {
  await prisma.cartItem.deleteMany({ where: { cartId } });

  return prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });
};

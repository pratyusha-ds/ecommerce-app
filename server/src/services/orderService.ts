import prisma from "../prisma/client";
import Stripe from "stripe";

const clientUrl = process.env.CLIENT_URL;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const getOrdersByUserId = (userId: string) =>
  prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { orderItems: { include: { product: true } } },
  });

export const getOrderById = (id: number) =>
  prisma.order.findUnique({
    where: { id },
    include: { orderItems: { include: { product: true } } },
  });

export const createOrderSession = async (
  _: any,
  { data }: any,
  context: any
) => {
  const { items, name, address, cartId } = data;
  const userId = context.user?.id;

  if (!userId && !cartId) throw new Error("No cart or user ID provided");

  let cart;

  if (userId) {
    cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) throw new Error("User does not have an active cart.");
  } else {
    if (!cartId) throw new Error("No cart found for guest user.");

    cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart) throw new Error("Cart not found.");
  }

  const existingOrder = await prisma.order.findFirst({
    where: { cartId: cart.id },
  });

  if (existingOrder) {
    const newCart = await prisma.cart.create({
      data: {
        cartToken: generateNewCartToken(),
        userId: userId || null,
      },
    });

    await Promise.all(
      cart.items.map((item) =>
        prisma.cartItem.create({
          data: {
            cartId: newCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        })
      )
    );

    cart = newCart;
  }

  const detailedItems = await Promise.all(
    items.map(async (item: any) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error(`Product not found: ${item.productId}`);

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        description: product.description,
      };
    })
  );

  const total = detailedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: userId || null,
      name,
      address,
      total,
      status: "PENDING",
      cartId: cart.id,
      orderItems: {
        create: detailedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: detailedItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/cart`,
    metadata: {
      orderId: order.id.toString(),
      cartId: cart.id.toString(),
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { cart: true },
  });

  let response: any = {
    sessionId: session.id,
    url: session.url,
  };

  if (!userId) {
    const newCart = await prisma.cart.create({
      data: {
        cartToken: generateNewCartToken(),
      },
    });

    response.newCartToken = newCart.cartToken;
  }

  return response;
};

function generateNewCartToken() {
  return Math.random().toString(36).slice(2, 11);
}

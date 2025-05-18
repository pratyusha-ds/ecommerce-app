import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});
const prisma = new PrismaClient();

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = Number(session.metadata?.orderId);
    const cartId = session.metadata?.cartId;

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId in metadata" });
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { cart: true },
      });

      if (!order) {
        console.error("Order not found for ID:", orderId);
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.status === "PAID") {
        console.log("Order already paid:", orderId);
        return res.status(200).json({ received: true });
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });
      console.log("Order marked as PAID:", orderId);

      if (order.cartId) {
        await prisma.cartItem.deleteMany({
          where: { cartId: order.cartId },
        });
        console.log("Cart items cleared for cartId:", order.cartId);

        await prisma.order.update({
          where: { id: orderId },
          data: { cartId: null },
        });

        console.log(
          "Order updated, cart reference removed for orderId:",
          orderId
        );

        await prisma.cart.delete({
          where: { id: order.cartId },
        });
        console.log("Cart deleted for cartId:", order.cartId);
      } else {
        console.log("No cartId found, skipping cart item deletion.");
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error while processing the order:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    console.log(`Ignoring unhandled event type: ${event.type}`);
    return res.status(200).json({ received: true });
  }
};

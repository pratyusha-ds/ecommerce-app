import {
  getOrdersByUserId,
  getOrderById,
  createOrderSession,
} from "../../services/orderService";

const orderResolver = {
  Query: {
    getOrdersByUserId: (_: any, args: { userId: string }) =>
      getOrdersByUserId(args.userId),
    getOrderById: (_: any, args: { id: number }) => getOrderById(args.id),
  },

  Mutation: {
    createOrderSession,
  },
};

export default orderResolver;

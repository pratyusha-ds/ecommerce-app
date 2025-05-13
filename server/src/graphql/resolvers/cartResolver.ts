import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../services/cartService";

const cartResolver = {
  Query: {
    getCart: async (
      _parent: any,
      args: { cartToken?: string },
      context: any
    ) => {
      const userId = context.user?.id;
      return getCart(userId, args.cartToken);
    },
  },

  Mutation: {
    addToCart: async (
      _parent: any,
      args: { productId: number; quantity: number; cartToken?: string },
      context: any
    ) => {
      const userId = context.user?.id;
      return addToCart(args.productId, args.quantity, userId, args.cartToken);
    },

    updateCartItem: async (
      _parent: any,
      args: { itemId: number; quantity: number },
      _context: any
    ) => {
      return updateCartItem(args.itemId, args.quantity);
    },

    removeCartItem: async (
      _parent: any,
      args: { itemId: number },
      _context: any
    ) => {
      return removeCartItem(args.itemId);
    },

    clearCart: async (_parent: any, args: { cartId: number }, context: any) => {
      const cart = await clearCart(args.cartId);

      return {
        ...cart,
        items: [],
      };
    },
  },
};

export default cartResolver;

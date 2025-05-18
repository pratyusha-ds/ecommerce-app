import {
  getProducts,
  getProductById,
  searchProducts,
  featuredProducts,
} from "../../services/productService";

const productResolver = {
  Query: {
    getProducts: async (
      _parent: any,
      args: { page: number; pageSize: number }
    ) => getProducts(args.page, args.pageSize),

    getProductById: async (_parent: any, args: { id: number }) =>
      getProductById(args.id),

    searchProducts: async (_parent: any, args: { query: string }) =>
      searchProducts(args.query),

    featuredProducts: async () => featuredProducts(),
  },
};

export default productResolver;

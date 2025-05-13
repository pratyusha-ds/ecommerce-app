import {
  getAllCategories,
  getCategoryById,
  getProductsByCategoryId,
} from "../../services/categoryService";

const categoryResolver = {
  Query: {
    getAllCategories: async () => {
      return getAllCategories();
    },

    getCategoryById: async (_parent: any, args: { id: number }) => {
      return getCategoryById(args.id);
    },

    categoryProducts: async (
      _parent: any,
      args: { id: number; limit: number; offset: number },
      _context: any,
      _info: any
    ) => {
      return getProductsByCategoryId(args.id, args.limit, args.offset);
    },
  },
};

export default categoryResolver;

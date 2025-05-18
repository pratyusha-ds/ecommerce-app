import * as adminService from "../../services/adminService";

const adminResolver = {
  Query: {
    admin: () => ({}),
  },
  Mutation: {
    admin: () => ({}),
  },
  AdminQuery: {
    adminCategories: async () => adminService.getCategories(),
    adminProducts: async (
      _: any,
      { limit, offset }: { limit?: number; offset?: number }
    ) => {
      return await adminService.getProducts(limit, offset);
    },
    adminUsers: async () => adminService.getUsers(),
    adminOrders: async (
      _: any,
      { limit, offset }: { limit?: number; offset?: number }
    ) => adminService.getOrders(limit, offset),
    adminOrder: async (_: any, { orderId }: { orderId: number }) => {
      return await adminService.getOrderById(orderId);
    },
    totalAdminOrders: async () => adminService.getTotalOrderCount(),
  },
  AdminMutation: {
    createCategory: async (_: any, { data }: any) =>
      adminService.createCategory(_, { data }),
    updateCategory: async (_: any, { id, data }: any) =>
      adminService.updateCategory(_, { id, data }),
    deleteCategory: async (_: any, { id }: any) =>
      adminService.deleteCategory(_, { id }),

    createProduct: async (_: any, { data }: any) =>
      adminService.createProduct(_, { data }),
    updateProduct: async (_: any, { id, data }: any) =>
      adminService.updateProduct(_, { id, data }),
    deleteProduct: async (_: any, { id }: any) =>
      adminService.deleteProduct(_, { id }),
    deleteUser: async (_: any, { id }: any) =>
      adminService.deleteUser(_, { id }),
    loginAdmin: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      return await adminService.loginAdminUser(email, password);
    },
    updateOrderStatus: async (_: any, { orderId, status }: any) => {
      return await adminService.updateOrderStatus(_, { orderId, status });
    },
    deleteOrder: async (_: any, { orderId }: any) => {
      return await adminService.deleteOrder(_, { orderId });
    },
  },
};

export default adminResolver;

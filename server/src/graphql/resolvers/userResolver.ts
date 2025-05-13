import {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUserProfile,
} from "../../services/userService";

const userResolver = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return getUserById(context.user.id);
    },

    getAllUsers: async () => {
      return getAllUsers();
    },
  },

  Mutation: {
    register: async (
      _parent: any,
      args: { email: string; password: string; name?: string }
    ) => {
      return registerUser(args.email, args.password, args.name);
    },

    login: async (
      _parent: any,
      args: { email: string; password: string; cartToken?: string }
    ) => {
      return loginUser(args.email, args.password, args.cartToken);
    },
    updateProfile: async (
      _parent: any,
      args: { name?: string; email?: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");
      return updateUserProfile(context.user.id, args);
    },
  },
};

export default userResolver;

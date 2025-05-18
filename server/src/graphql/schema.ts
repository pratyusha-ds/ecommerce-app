import { makeExecutableSchema } from "@graphql-tools/schema";
import rootDefs from "./typeDefs/rootDefs";
import categoryDefs from "./typeDefs/categoryDefs";
import productDefs from "./typeDefs/productDefs";
import cartDefs from "./typeDefs/cartDefs";
import orderDefs from "./typeDefs/orderDefs";
import userDefs from "./typeDefs/userDefs";
import adminDefs from "./typeDefs/adminDefs";
import sharedTypes from "./typeDefs/sharedTypes";

import categoryResolver from "./resolvers/categoryResolver";
import productResolver from "./resolvers/productResolver";
import cartResolver from "./resolvers/cartResolver";
import orderResolver from "./resolvers/orderResolver";
import userResolver from "./resolvers/userResolver";
import adminResolver from "./resolvers/adminResolver";

const typeDefs = [
  sharedTypes,
  rootDefs,
  categoryDefs,
  productDefs,
  cartDefs,
  orderDefs,
  userDefs,
  adminDefs,
];

const resolvers = [
  categoryResolver,
  productResolver,
  cartResolver,
  orderResolver,
  userResolver,
  adminResolver,
];

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;

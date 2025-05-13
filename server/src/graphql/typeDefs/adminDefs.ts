import { gql } from "apollo-server";

const adminDefs = gql`
  input CategoryInput {
    name: String!
    imageUrl: String
  }

  input CategoryUpdateInput {
    name: String
    imageUrl: String
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
    imageUrl: String!
    categoryId: Int!
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    imageUrl: String
    categoryId: Int
  }
  type DeleteResponse {
    success: Boolean!
    message: String
  }
  type ProductList {
    totalCount: Int!
    items: [Product!]!
  }
  type AdminQuery {
    adminCategories: [Category!]!

    adminProducts(limit: Int, offset: Int): ProductList!
    adminUsers: [User!]!
    adminOrders(limit: Int, offset: Int): [Order!]!
    adminOrder(orderId: Int!): Order
    totalAdminOrders: Int!
  }

  type AdminMutation {
    createCategory(data: CategoryInput!): Category!
    updateCategory(id: Int!, data: CategoryUpdateInput!): Category!
    deleteCategory(id: Int!): Boolean!
    createProduct(data: ProductInput!): Product!
    updateProduct(id: Int!, data: UpdateProductInput!): Product!
    deleteProduct(id: Int!): Boolean!
    deleteUser(id: String!): Boolean!
    loginAdmin(email: String!, password: String!): LoginResponse!
    updateOrderStatus(orderId: Int!, status: String!): Order!
    deleteOrder(orderId: Int!): DeleteResponse!
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  extend type Query {
    admin: AdminQuery
  }

  extend type Mutation {
    admin: AdminMutation
  }
`;

export default adminDefs;

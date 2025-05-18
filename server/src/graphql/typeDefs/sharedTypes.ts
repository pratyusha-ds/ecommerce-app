import { gql } from "apollo-server";

const sharedTypes = gql`
  enum Role {
    ADMIN
    USER
  }

  type Category {
    id: Int!
    name: String!
    imageUrl: String
  }

  type Product {
    id: Int!
    name: String!
    description: String!
    price: Float!
    imageUrl: String!
    categoryId: Int!
    category: Category
  }

  type User {
    id: String!
    email: String!
    name: String
    role: Role!
    createdAt: String!
    updatedAt: String!
    orders: [Order!]
  }

  type OrderItem {
    id: Int!
    productId: Int!
    quantity: Int!
    price: Float!
    product: Product!
  }

  type Order {
    id: Int!
    userId: String!
    total: Float!
    name: String!
    address: String!
    status: String!
    createdAt: String!
    user: User!
    orderItems: [OrderItem!]!
  }
`;

export default sharedTypes;

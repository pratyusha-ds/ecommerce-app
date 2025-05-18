import { gql } from "apollo-server";

const orderDefs = gql`
  type OrderSession {
    sessionId: String!
    url: String!
    newCartToken: String
  }

  input OrderItemInput {
    productId: Int!
    quantity: Int!
  }

  input OrderInput {
    name: String!
    address: String!
    items: [OrderItemInput!]!
    cartId: Int!
  }

  extend type Query {
    getOrdersByUserId(userId: String!): [Order!]!
    getOrderById(id: Int!): Order
    getAllOrders: [Order!]!
  }

  extend type Mutation {
    createOrderSession(data: OrderInput!): OrderSession!
  }
`;

export default orderDefs;

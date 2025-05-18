import { gql } from "apollo-server";
const userDefs = gql`
  type CartItem {
    id: Int!
    productId: Int!
    quantity: Int!
  }

  type Cart {
    id: Int!
    cartToken: String
    items: [CartItem!]!
  }

  type AuthPayload {
    token: String!
    user: User!
    cart: Cart
  }

  extend type Query {
    me: User
    getAllUsers: [User!]!
  }

  extend type Mutation {
    register(email: String!, password: String!, name: String): AuthPayload!
    login(email: String!, password: String!, cartToken: String): AuthPayload!
    updateProfile(name: String, email: String): User!
  }
`;

export default userDefs;

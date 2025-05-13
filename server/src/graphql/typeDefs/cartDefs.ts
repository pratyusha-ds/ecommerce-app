import { gql } from "apollo-server";

const cartDefs = gql`
  type CartItem {
    id: Int!
    quantity: Int!
    product: Product!
  }

  type Cart {
    id: Int!
    items: [CartItem!]!
    userId: String
    cartToken: String
  }

  extend type Query {
    getCart(cartToken: String): Cart
  }

  extend type Mutation {
    addToCart(productId: Int!, quantity: Int!, cartToken: String): Cart!
    updateCartItem(itemId: Int!, quantity: Int!): Cart!
    removeCartItem(itemId: Int!): Cart!
    clearCart(cartId: Int!): Cart!
  }
`;

export default cartDefs;

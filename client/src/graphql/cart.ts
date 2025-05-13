import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart($cartToken: String) {
    getCart(cartToken: $cartToken) {
      id
      items {
        id
        quantity
        product {
          id
          name
          price
        }
      }
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($itemId: Int!) {
    removeCartItem(itemId: $itemId) {
      id
      items {
        id
        quantity
        product {
          id
          name
          price
        }
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($cartId: Int!) {
    clearCart(cartId: $cartId) {
      id
      items {
        id
        quantity
        product {
          id
          name
          price
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($name: String, $email: String) {
    updateProfile(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const GET_PROFILE = gql`
  query Me {
    me {
      id
      email
      name
      createdAt
      orders {
        id
        total
        status
        address
        createdAt
        orderItems {
          id
          quantity
          product {
            id
            name
            price
            imageUrl
          }
        }
      }
    }
  }
`;

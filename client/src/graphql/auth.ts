import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!, $cartToken: String) {
    login(email: $email, password: $password, cartToken: $cartToken) {
      token
      user {
        id
        email
        role
      }
      cart {
        id
        cartToken
        items {
          id
          productId
          quantity
        }
      }
    }
  }
`;

export const LOGIN_ADMIN_MUTATION = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      token
      user {
        id
        email
        role
        name
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      user {
        id
        email
        role
        name
      }
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email) {
      message
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      message
    }
  }
`;

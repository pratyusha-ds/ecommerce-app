import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    admin {
      adminCategories {
        id
        name
        imageUrl
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $imageUrl: String) {
    admin {
      createCategory(data: { name: $name, imageUrl: $imageUrl }) {
        id
        name
        imageUrl
      }
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $name: String!, $imageUrl: String) {
    admin {
      updateCategory(id: $id, data: { name: $name, imageUrl: $imageUrl }) {
        id
        name
        imageUrl
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    admin {
      deleteCategory(id: $id)
    }
  }
`;

export const GET_ADMIN_ORDERS = gql`
  query GetAdminOrders($limit: Int, $offset: Int) {
    admin {
      adminOrders(limit: $limit, offset: $offset) {
        id
        total
        status
        createdAt
        user {
          email
        }
        orderItems {
          id
          quantity
          price
          product {
            name
          }
        }
        name
        address
      }
      totalAdminOrders
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: Int!, $status: String!) {
    admin {
      updateOrderStatus(orderId: $orderId, status: $status) {
        id
        status
      }
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($orderId: Int!) {
    admin {
      deleteOrder(orderId: $orderId) {
        success
        message
      }
    }
  }
`;

export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($orderId: Int!) {
    admin {
      adminOrder(orderId: $orderId) {
        id
        total
        status
        createdAt
        name
        address
        user {
          email
        }
        orderItems {
          id
          quantity
          price
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

export const GET_PRODUCTS = gql`
  query GetProducts($limit: Int!, $offset: Int!) {
    admin {
      adminProducts(limit: $limit, offset: $offset) {
        totalCount
        items {
          id
          name
          price
          description
          imageUrl
          category {
            id
            name
          }
        }
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductInput!) {
    admin {
      createProduct(data: $data) {
        id
        name
        price
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $data: UpdateProductInput!) {
    admin {
      updateProduct(id: $id, data: $data) {
        id
        name
        price
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    admin {
      deleteProduct(id: $id)
    }
  }
`;

export const GET_USERS = gql`
  query {
    admin {
      adminUsers {
        id
        name
        email
        role
        createdAt
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    admin {
      deleteUser(id: $id)
    }
  }
`;

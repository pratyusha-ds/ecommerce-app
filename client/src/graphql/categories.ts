import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      id
      name
      imageUrl
    }
  }
`;

export const GET_CATEGORY_PRODUCTS = gql`
  query GetCategoryProducts($id: Int!, $limit: Int!, $offset: Int!) {
    getCategoryById(id: $id) {
      name
    }
    categoryProducts(id: $id, limit: $limit, offset: $offset) {
      totalCount
      items {
        id
        name
        description
        price
        imageUrl
      }
    }
  }
`;

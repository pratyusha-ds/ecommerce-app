import { gql } from "@apollo/client";

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    featuredProducts {
      id
      name
      description
      price
      imageUrl
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!) {
    searchProducts(query: $query) {
      id
      name
      description
      price
      imageUrl
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    getProductById(id: $id) {
      id
      name
      description
      price
      imageUrl
    }
  }
`;

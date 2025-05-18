import { gql } from "apollo-server";

const productDefs = gql`
  extend type Query {
    getProducts(page: Int!, pageSize: Int!): [Product!]!
    getProductById(id: Int!): Product
    searchProducts(query: String!): [Product!]!
    featuredProducts: [Product!]!
  }
`;

export default productDefs;

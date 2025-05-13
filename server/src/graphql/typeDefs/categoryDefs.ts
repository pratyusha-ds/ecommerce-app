import { gql } from "apollo-server";

const categoryDefs = gql`
  extend type Category {
    products: [Product!]!
  }

  type CategoryProductsPayload {
    totalCount: Int!
    items: [Product!]!
  }

  extend type Query {
    getAllCategories: [Category!]!
    getCategoryById(id: Int!): Category
    categoryProducts(
      id: Int!
      limit: Int!
      offset: Int!
    ): CategoryProductsPayload!
  }
`;

export default categoryDefs;

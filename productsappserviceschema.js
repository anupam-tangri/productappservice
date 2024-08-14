export const typeDefs = `#graphql
  type Product {
    id: ID!
    title: String!
    price: String!
    avg_rating: Float!
    total_sales: Int!
  }
  type Review {
    id: ID!
    rating: Int!
    product: Product!
  }
  type Sale {
    id: ID!
    returned: Boolean!
    product: Product!
  }
  
  type Query {
    products: [Product]
    reviews: [Review]
    sales: [Sale]
    product(id: ID!): Product
    review(id: ID!): Review
    sale(id: ID!): Sale
  }

  type Mutation {
    addReview(rating: Int!, product_id: String!): Review
    addSale(product_id: String!): Sale
    addReturn(id: String!): Sale
  }

  type Subscription {
    productInfoUpdated: Product
  }
`
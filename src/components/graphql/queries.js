import { gql } from "@apollo/client/core";

export const GET_CARDS = gql`
  query CardsQuery($name: String!, $filters: EntriesFilter, $after: String) {
    commander(name: $name) {
      entries(filters: $filters, after: $after) {
        edges {
          node {
            wins
            draws
            losses
            maindeck {
              name
              imageUrls
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }`;

  export const GET_COMMANDERS = gql`
  query CommandersQuery ($after: String) {
    commanders(after: $after) {
      edges {
        node {
          name
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }`;
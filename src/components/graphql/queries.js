import { gql } from "@apollo/client/core";

export const GET_CARDS = gql`
  query CardsQuery($first: Int, $name: String!, $filters: EntriesFilter, $after: String) {
    commander(name: $name) {
      entries(first: $first, filters: $filters, after: $after) {
        edges {
          node {
            wins
            draws
            losses
            maindeck {
              name
              imageUrls
            }
            id
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      id
    }
  }`;

  export const GET_COMMANDERS = gql`
  query CommandersQuery ($first: Int, $after: String) {
    commanders(first: $first, after: $after) {
      edges {
        node {
          name
          id
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }`;
import { gql } from "@apollo/client/core";

export const GET_POSTS = gql`
  query ExampleQuery($name: String!, $filters: EntriesFilter, $after: String) {
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
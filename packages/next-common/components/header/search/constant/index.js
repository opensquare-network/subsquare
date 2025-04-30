import { gql } from "@apollo/client";

export const GET_IDENTITIES = gql`
  query GetIdentities($limit: Int!, $offset: Int!, $search: String) {
    identities(limit: $limit, offset: $offset, search: $search) {
      limit
      offset
      total
      identities {
        subsCount
        account
        isSub
        lastUpdate {
          blockTime
        }
      }
    }
  }
`;

export const LIMIT = 100;

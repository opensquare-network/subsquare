import { gql } from "@apollo/client";

export const GET_PROXIES = gql`
  query MyQuery(
    $limit: Int!
    $offset: Int!
    $delegatee: String
    $delegator: String
    $isActive: Boolean
    $isPure: Boolean
  ) {
    proxies(
      limit: $limit
      offset: $offset
      delegatee: $delegatee
      delegator: $delegator
      isActive: $isActive
      isPure: $isPure
    ) {
      items {
        delegatee
        delegator
        delay
        type
        isRemoved
        indexer {
          blockTime
          blockHeight
        }
        proxyId
        isPure
      }
      total
      offset
      limit
    }
  }
`;

import { gql } from "@apollo/client";

export const coretimeCurrentSale = gql`
  query MyQuery {
    coretimeCurrentSale {
      id
    }
  }
`;

export const GET_CORETIME_SALE_PURCHASES = gql`
  query MyQuery($limit: Int!, $offset: Int!, $saleId: Int!) {
    coretimeSalePurchases(limit: $limit, offset: $offset, saleId: $saleId) {
      limit
      offset
      total
      items {
        regionId {
          core
        }
        indexer {
          blockHeight
          blockTime
          extrinsicIndex
          eventIndex
        }
        price
        who
      }
    }
  }
`;

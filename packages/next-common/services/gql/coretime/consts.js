import { gql } from "@apollo/client";

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

export const GET_CORETIME_SALE_RENEWALS = gql`
  query MyQuery($limit: Int!, $offset: Int!, $saleId: Int!) {
    coretimeSaleRenewals(limit: $limit, offset: $offset, saleId: $saleId) {
      limit
      offset
      total
      items {
        core
        oldCore
        who
        workload
        price
        indexer {
          blockHeight
          blockTime
          extrinsicIndex
          eventIndex
        }
      }
    }
  }
`;

// TODO: isFinal
export const GET_CORETIME_SALES = gql`
  query MyQuery($limit: Int!, $offset: Int!) {
    coretimeSales(limit: $limit, offset: $offset) {
      limit
      offset
      total
      items {
        id
        isFinal
        endIndexer {
          blockHash
          blockHeight
          blockTime
          chain
          eventIndex
          extrinsicIndex
        }
        initIndexer {
          blockHash
          blockHeight
          blockTime
          chain
          eventIndex
          extrinsicIndex
        }
        info {
          regionBegin
          regionEnd
        }
        totalRevenue
      }
    }
  }
`;

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
export const GET_CORETIME_HISTORY_SALES = gql`
  query MyQuery($limit: Int!, $offset: Int!) {
    coretimeHistorySales(limit: $limit, offset: $offset) {
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

export const GET_CORETIME_SALE_RENEWALS_CHART = gql`
  query MyQuery($saleId: Int!) {
    coretimeSaleRenewals(limit: 100, offset: 0, saleId: $saleId) {
      items {
        price
        indexer {
          blockHeight
        }
        who
      }
    }
  }
`;

export const GET_CORETIME_SALE_PURCHASES_CHART = gql`
  query MyQuery($saleId: Int!) {
    coretimeSalePurchases(limit: 100, offset: 0, saleId: $saleId) {
      items {
        price
        indexer {
          blockHeight
        }
        who
      }
    }
  }
`;

import { gql } from "@apollo/client";
import { INDEXER_FIELDS } from "./common";

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
          ${INDEXER_FIELDS}
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
          ${INDEXER_FIELDS}
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
          ${INDEXER_FIELDS}
        }
        initIndexer {
          ${INDEXER_FIELDS}
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

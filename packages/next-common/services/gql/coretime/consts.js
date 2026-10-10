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
        relayIndexer {
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
        relayIndexer {
          ${INDEXER_FIELDS}
        }
      }
    }
  }
`;

export const GET_MY_CORETIME_PAID_CORES = gql`
  query MyQuery(
    $saleId: Int!
    $prevSaleId: Int!
    $limit: Int!
    $hasPrevSale: Boolean!
  ) {
    renewals: coretimeSaleRenewals(limit: $limit, offset: 0, saleId: $saleId) {
      items {
        core
        begin
        who
      }
    }
    purchases: coretimeSalePurchases(
      limit: $limit
      offset: 0
      saleId: $saleId
    ) {
      items {
        who
        regionId {
          begin
          core
        }
      }
    }
    prevRenewals: coretimeSaleRenewals(
      limit: $limit
      offset: 0
      saleId: $prevSaleId
    ) @include(if: $hasPrevSale) {
      items {
        core
        begin
        who
      }
    }
    prevPurchases: coretimeSalePurchases(
      limit: $limit
      offset: 0
      saleId: $prevSaleId
    ) @include(if: $hasPrevSale) {
      items {
        who
        regionId {
          begin
          core
        }
      }
    }
  }
`;

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

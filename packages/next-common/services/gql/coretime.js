import { gql } from "@apollo/client";

export const GET_CORETIME_CURRENT_SALE = gql`
  query MyQuery {
    coretimeCurrentSale {
      id
      purchaseCount
      renewalCount
    }
  }
`;

export const GET_CORETIME_SALE = gql`
  query MyQuery($id: Int!) {
    coretimeSale(id: $id) {
      id
      purchaseRevenue
      renewalRevenue
      totalRevenue
      info {
        firstCore
        price
        coresSold
        coresOffered
        regionBegin
        regionEnd
        saleStart
        selloutPrice
      }
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

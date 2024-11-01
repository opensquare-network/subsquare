import { gql } from "@apollo/client";
import { coretimeClient } from "next-common/hooks/apollo";

const GET_CORETIME_SALE_RENEWALS_CHART = gql`
  query MyQuery($saleId: Int!, $limit: Int!, $offset: Int!) {
    coretimeSaleRenewals(limit: $limit, offset: $offset, saleId: $saleId) {
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

const GET_CORETIME_SALE_PURCHASES_CHART = gql`
  query MyQuery($saleId: Int!, $limit: Int!, $offset: Int!) {
    coretimeSalePurchases(limit: $limit, offset: $offset, saleId: $saleId) {
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

export async function queryCoretimeSaleRenewalsChart(id) {
  const {
    data: { coretimeSaleRenewals = null },
  } =
    (await coretimeClient?.query?.({
      query: GET_CORETIME_SALE_RENEWALS_CHART,
      variables: { saleId: Number(id), limit: 100, offset: 0 },
    })) || {};

  return coretimeSaleRenewals;
}

export async function queryCoretimeSalePurchasesChart(id) {
  const {
    data: { coretimeSalePurchases = null },
  } =
    (await coretimeClient?.query?.({
      query: GET_CORETIME_SALE_PURCHASES_CHART,
      variables: { saleId: Number(id), limit: 100, offset: 0 },
    })) || {};

  return coretimeSalePurchases;
}

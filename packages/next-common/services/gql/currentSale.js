import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";

const GET_CORETIME_CURRENT_SALE = gql`
  query MyQuery {
    coretimeCurrentSale {
      id
      purchaseCount
      renewalCount
      renewalRevenue
      purchaseRevenue
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

export default async function queryCoretimeCurrentSale() {
  const {
    data: { coretimeCurrentSale = null },
  } =
  (await coretimeClient?.query?.({
    query: GET_CORETIME_CURRENT_SALE,
  })) || {};

  return coretimeCurrentSale;
}

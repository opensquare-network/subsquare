import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";

const GET_CORETIME_CURRENT_SALE = gql`
  query MyQuery {
    coretimeSale(id: 7) {
      id
      purchaseCount
      renewalCount
      renewalRevenue
      purchaseRevenue
      totalRevenue
      isFinal
      info {
        saleStart
        leadinLength
        price
        endPrice
        regionBegin
        regionEnd
        idealCoresSold
        coresOffered
        firstCore
        selloutPrice
        coresSold
      }
      initIndexer {
        blockHash
        blockHeight
        blockTime
        chain
        eventIndex
        extrinsicIndex
      }
      endIndexer {
        blockHeight
        blockHash
        blockTime
        chain
        eventIndex
        extrinsicIndex
      }
    }
  }
`;

export default async function queryCoretimeCurrentSale() {
  const {
    data: { coretimeSale: coretimeCurrentSale = null },
  } =
    (await coretimeClient?.query?.({
      query: GET_CORETIME_CURRENT_SALE,
    })) || {};

  return coretimeCurrentSale;
}

import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";

const GET_CORETIME_SALE = gql`
  query MyQuery($id: Int!) {
    coretimeSale(id: $id) {
      id
      isFinal
      purchaseCount
      purchaseRevenue
      renewalCount
      renewalRevenue
      totalRevenue
      info {
        coresOffered
        coresSold
        firstCore
        idealCoresSold
        leadinLength
        price
        regionBegin
        regionEnd
        saleStart
        selloutPrice
      }
      infoUpdatedAt {
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
    }
  }
`;

export default async function queryCoretimeDetailSale(id) {
  if (!id) {
    return null;
  }

  const {
    data: { coretimeSale = null },
  } =
    (await coretimeClient?.query?.({
      query: GET_CORETIME_SALE,
      variables: { id },
    })) || {};

  return coretimeSale;
}

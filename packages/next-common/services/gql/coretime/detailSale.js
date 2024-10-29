import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";
import { COMMON_SALE_FIELDS, SALE_INFO_FIELDS } from "./common";

const GET_CORETIME_SALE = gql`
  query MyQuery($id: Int!) {
    coretimeSale(id: $id) {
      ...CommonSaleFields
      ...SaleInfoFields
      isFinal
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
  ${COMMON_SALE_FIELDS}
  ${SALE_INFO_FIELDS}
`;

export default async function queryCoretimeDetailSale(id) {
  const {
    data: { coretimeSale = null },
  } =
    (await coretimeClient?.query?.({
      query: GET_CORETIME_SALE,
      variables: { id: Number(id) },
    })) || {};

  return coretimeSale;
}

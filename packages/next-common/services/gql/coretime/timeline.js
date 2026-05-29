import { gql } from "@apollo/client";
import { coretimeClient } from "next-common/hooks/apollo";
import { INDEXER_FIELDS } from "./common";

const GET_CORETIME_SALE_TIMELINE = gql`
  query MyQuery($saleId: Int!) {
    coretimeSaleTimeline(saleId: $saleId) {
      id
      name
      args
      indexer {
        ${INDEXER_FIELDS}
      }
      relayIndexer {
        ${INDEXER_FIELDS}
      }
    }
  }
`;

export default async function queryCoretimeSaleTimeline(saleId) {
  const {
    data: { coretimeSaleTimeline = [] },
  } =
    (await coretimeClient?.query?.({
      query: GET_CORETIME_SALE_TIMELINE,
      variables: { saleId: Number(saleId) },
    })) || {};

  return coretimeSaleTimeline;
}

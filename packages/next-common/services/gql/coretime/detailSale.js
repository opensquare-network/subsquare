import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";
import {
  INFO_FIELDS,
  INDEXER_FIELDS,
  COMMON_SALE_FIELDS,
  CORETIME_CONFIGURATION_FIELDS,
} from "./common";

const GET_CORETIME_SALE = gql`
  query MyQuery($id: Int!) {
    coretimeSale(id: $id) {
      isFinal
      ${COMMON_SALE_FIELDS}
      ${INFO_FIELDS}
      infoUpdatedAt {
        blockHash
        blockHeight
        blockTime
        chain
        eventIndex
        extrinsicIndex
      }
      initIndexer {
        ${INDEXER_FIELDS}
      }
      relayIndexer {
        ${INDEXER_FIELDS}
      }
      endIndexer {
        ${INDEXER_FIELDS}
      }
      endRelayIndexer {
        ${INDEXER_FIELDS}
      }
      relaySaleStartIndexer {
        ${INDEXER_FIELDS}
      }
      configuration {
        ${CORETIME_CONFIGURATION_FIELDS}
      }
    }
  }
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

import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";
import { COMMON_SALE_FIELDS, INDEXER_FIELDS, INFO_FIELDS } from "./common";

const GET_CORETIME_CURRENT_SALE = gql`
  query MyQuery {
    coretimeCurrentSale {
      ${COMMON_SALE_FIELDS}
      ${INFO_FIELDS}
      initIndexer {
        ${INDEXER_FIELDS}
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

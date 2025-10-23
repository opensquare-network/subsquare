import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";
import {
  COMMON_SALE_FIELDS,
  CORETIME_CONFIGURATION_FIELDS,
  INDEXER_FIELDS,
  INFO_FIELDS,
} from "./common";

const GET_CORETIME_CURRENT_SALE = gql`
  query MyQuery {
    coretimeCurrentSale {
      id
      ${COMMON_SALE_FIELDS}
      ${INFO_FIELDS}
      initIndexer {
        ${INDEXER_FIELDS}
      }
      configuration {
        ${CORETIME_CONFIGURATION_FIELDS}
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

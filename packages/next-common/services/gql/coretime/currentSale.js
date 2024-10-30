import {
  coretimeClient,
  useCoretimeSubscription,
} from "next-common/hooks/apollo";
import { gql } from "@apollo/client";
import { COMMON_SALE_FIELDS, INFO_FIELDS } from "./common";

const GET_CORETIME_CURRENT_SALE = gql`
  query MyQuery {
    coretimeCurrentSale {
      ${COMMON_SALE_FIELDS}
      ${INFO_FIELDS}
    }
  }
`;

const SUBSCRIBE_CORETIME_CURRENT_SALE = gql`
  subscription MySubscription {
    coretimeCurrentSale {
      ${COMMON_SALE_FIELDS}
      ${INFO_FIELDS}
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

// TODO: useCoretimeSubscription
export function subscribeCoretimeCurrentSale() {
  // useCoretimeSubscription
}

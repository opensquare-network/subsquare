import { coretimeClient } from "next-common/hooks/apollo";
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

// TODO: use relay-or-urql to subscribe current sale
export const SUBSCRIBE_CORETIME_CURRENT_SALE = gql`
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

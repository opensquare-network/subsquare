import { gql } from "@apollo/client";

export const GET_PROXIES = gql`
  query ProfileProxiesQuery($delegator: String, $delegatee: String) {
    proxies(delegator: $delegator, delegatee: $delegatee) {
      delay
      delegator
      delegatee
      proxyType
    }
  }
`;

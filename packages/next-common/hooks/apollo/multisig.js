import { ApolloClient, InMemoryCache, useQuery } from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getMultisigApiUrl from "next-common/services/multisig/url";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const stateScanClient = new ApolloClient({
  uri: getMultisigApiUrl(CHAIN),
  cache: new InMemoryCache(),
  defaultOptions,
});

/**
 * @type {typeof useQuery}
 */
export function useMultisigQuery(query, options = {}, ...args) {
  options.client = options.client || stateScanClient;
  return useQuery(query, options, ...args);
}

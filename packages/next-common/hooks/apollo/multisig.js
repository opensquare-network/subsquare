import { ApolloClient, InMemoryCache, useQuery } from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getMultisigApiUrl from "next-common/services/multisig/url";
import getChainSettings from "next-common/utils/consts/settings";

const chainSettings = getChainSettings(CHAIN);

/** @type {ApolloClient<InMemoryCache> | undefined} */
export let multisigClient;

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

if (chainSettings?.multisigWallets?.mimir) {
  multisigClient = new ApolloClient({
    uri: getMultisigApiUrl(CHAIN),
    cache: new InMemoryCache(),
    defaultOptions,
  });
}

/**
 * @type {typeof useQuery}
 */
export function useMultisigQuery(query, options = {}, ...args) {
  options.client = options.client || multisigClient;
  return useQuery(query, options, ...args);
}

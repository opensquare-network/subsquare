import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getMultisigApiUrl from "next-common/services/multisig/url";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultOptions } from "./common";

const chainSettings = getChainSettings(CHAIN);

/** @type {ApolloClient<InMemoryCache> | undefined} */
export let multisigClient;

if (chainSettings?.multisigApiPrefix) {
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

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useLazyQuery}
 */
export function useMultisigLazyQuery(query, options = {}, ...args) {
  options.client = options.client || multisigClient;
  return useLazyQuery(query, options, ...args);
}

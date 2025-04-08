import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getProxyApiUrl from "next-common/services/gql/proxy/url";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultOptions } from "./common";

const chainSettings = getChainSettings(CHAIN);

/** @type {ApolloClient<InMemoryCache> | undefined} */
export let proxyClient;

if (chainSettings?.graphqlApiSubDomain) {
  proxyClient = new ApolloClient({
    uri: getProxyApiUrl(CHAIN),
    cache: new InMemoryCache(),
    defaultOptions,
  });
}

/**
 * @type {typeof useQuery}
 */
export function useProxyQuery(query, options = {}, ...args) {
  options.client = options.client || proxyClient;
  return useQuery(query, options, ...args);
}

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useLazyQuery}
 */
export function useProxyLazyQuery(query, options = {}, ...args) {
  options.client = options.client || proxyClient;
  return useLazyQuery(query, options, ...args);
}

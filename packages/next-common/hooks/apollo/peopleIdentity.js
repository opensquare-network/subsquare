import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getPeopleIdentityApiUrl from "next-common/services/gql/identity/url";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultOptions } from "./common";

const chainSettings = getChainSettings(CHAIN);

/** @type {ApolloClient<InMemoryCache> | undefined} */
export let peopleIdentityClient;

if (chainSettings?.graphqlApiSubDomain) {
  peopleIdentityClient = new ApolloClient({
    uri: getPeopleIdentityApiUrl(CHAIN),
    cache: new InMemoryCache(),
    defaultOptions,
  });
}

/**
 * @type {typeof useQuery}
 */
export function usePeopleIdentityQuery(query, options = {}, ...args) {
  options.client = options.client || peopleIdentityClient;
  return useQuery(query, options, ...args);
}

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useLazyQuery}
 */
export function usePeopleIdentityLazyQuery(query, options = {}, ...args) {
  options.client = options.client || peopleIdentityClient;
  return useLazyQuery(query, options, ...args);
}

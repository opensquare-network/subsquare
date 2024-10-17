import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";

const doTreasuryEcoClient = new ApolloClient({
  uri: "https://eco-api.dotreasury.com/graphql",
  cache: new InMemoryCache(),
});

export const coretimeClient = new ApolloClient({
  uri: `https://${CHAIN}-gh-api.subsquare.io/graphql`,
  cache: new InMemoryCache(),
});

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useQuery}
 */
export function useDoTreasuryEcoQuery(query, options = {}, ...args) {
  options.client = options.client || doTreasuryEcoClient;
  return useQuery(query, options, ...args);
}

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useLazyQuery}
 */
export function useDoTreasuryEcoLazyQuery(query, options = {}, ...args) {
  options.client = options.client || doTreasuryEcoClient;
  return useLazyQuery(query, options, ...args);
}

/**
 * @type {typeof useQuery}
 */
export function useCoretimeQuery(query, options = {}, ...args) {
  options.client = options.client || coretimeClient;
  return useQuery(query, options, ...args);
}

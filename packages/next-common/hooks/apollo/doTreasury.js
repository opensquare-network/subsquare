import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import { defaultOptions } from "./common";

const doTreasuryEcoClient = new ApolloClient({
  uri: "https://eco-api.dotreasury.com/graphql",
  cache: new InMemoryCache(),
  defaultOptions,
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

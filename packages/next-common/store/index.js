import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { CHAIN, defaultBlockTime } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { getEnvEndpoints, getInitNodeUrl } from "./reducers/nodeSlice";

export const store = createStore({ useEndpointsFromEnv: true });

export function createStore({
  chain = CHAIN,
  useEndpointsFromEnv = false,
} = {}) {
  const chainSettings = getChainSettings(chain);

  let nodes = chainSettings.endpoints;
  if (useEndpointsFromEnv) {
    const endpointsFromEnv = getEnvEndpoints();
    nodes = endpointsFromEnv || chainSettings.endpoints;
  }

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      chain: {
        blockTime: chainSettings.blockTime || defaultBlockTime,
      },
      node: {
        chain,
        currentNode: getInitNodeUrl(chain),
        nodes,
      },
    },
  });
}

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { CHAIN, defaultBlockTime } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { getEnvEndpoints, getInitNodeUrl } from "./reducers/nodeSlice";
import { merge } from "lodash-es";

export const store = createStore({
  useEndpointsFromEnv: true,
  reducer: rootReducer,
});

export function createStore({
  chain = CHAIN,
  useEndpointsFromEnv = false,
  reducer,
  preloadedState,
} = {}) {
  const chainSettings = getChainSettings(chain);

  let nodes = chainSettings.endpoints;
  if (useEndpointsFromEnv) {
    const endpointsFromEnv = getEnvEndpoints();
    nodes = endpointsFromEnv || chainSettings.endpoints;
  }

  return configureStore({
    reducer,
    preloadedState: merge(
      {},
      {
        chain: {
          blockTime: chainSettings.blockTime || defaultBlockTime,
        },
        node: {
          chain,
          currentNode: getInitNodeUrl(chain),
          nodes,
        },
      },
      preloadedState,
    ),
  });
}

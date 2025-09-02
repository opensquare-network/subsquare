import { createSlice } from "@reduxjs/toolkit";
import getChainSettings from "../../utils/consts/settings";
import safeLocalStorage from "next-common/utils/safeLocalStorage";
import { random } from "lodash-es";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { getRelayChain, isAssetHubChain } from "next-common/utils/chain";

const chain = process.env.NEXT_PUBLIC_CHAIN;

export function getEnvEndpoints() {
  const envSetting = process.env.NEXT_PUBLIC_TEST_ENDPOINTS;
  if (!envSetting) {
    return null;
  }

  const items = envSetting.split("|");
  if (items.length <= 0) {
    return null;
  }

  return items.map((item) => {
    const [name, url] = item.split(";");
    return { name, url };
  });
}

const endpointsFromEnv = getEnvEndpoints();

export function getAllRpcUrls(chain) {
  const envEndpoints = getEnvEndpoints();
  if ((envEndpoints || []).length >= 1) {
    return envEndpoints.map((item) => item.url);
  }

  const settings = getChainSettings(chain);
  return settings.endpoints.map((item) => item.url);
}

export function getNodeChainName() {
  if (isAssetHubMigrated(chain) && isAssetHubChain(chain)) {
    return `nodeUrl-${getRelayChain(chain)}`;
  }

  return `nodeUrl-${chain}`;
}

export function getInitNodeUrl(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = safeLocalStorage.getItem(getNodeChainName());
  } catch (e) {
    // ignore parse error
  }

  const candidateUrls = getAllRpcUrls(chain);
  if (candidateUrls.length <= 0) {
    throw new Error(`Can not find nodes for ${chain}`);
  }
  if (localNodeUrl && candidateUrls.includes(localNodeUrl)) {
    return localNodeUrl;
  }

  const cap = candidateUrls.length > 3 ? 2 : candidateUrls.length - 1;
  const randomIndex = random(cap);
  return candidateUrls[randomIndex];
}

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    chain,
    currentNode: getInitNodeUrl(chain),
    nodes: endpointsFromEnv || getChainSettings(chain).endpoints,
  },
  reducers: {
    setCurrentNode(state, { payload }) {
      const { url, refresh, saveLocalStorage = true } = payload;
      const beforeUrl = state.currentNode;

      state.currentNode = url;
      state.nodes = (state.nodes || []).map((item) => {
        if (item.url === beforeUrl) {
          return { ...item, update: true };
        } else {
          return item;
        }
      });

      if (saveLocalStorage) {
        safeLocalStorage.setItem(getNodeChainName(), url);
      }

      if (refresh) {
        window.location.reload();
      }
    },
    removeCurrentNode(state) {
      safeLocalStorage.removeItem(getNodeChainName());
      state.currentNode = null;
    },
    setNodesDelay(state, { payload }) {
      (payload || []).forEach((item) => {
        const node = (state.nodes || []).find((node) => item.url === node.url);
        if (node) node.delay = item.delay;
      });
    },
  },
});

export const currentNodeSelector = (state) => state.node?.currentNode;
export const nodesSelector = (state) => state.node?.nodes;

export const { setCurrentNode, removeCurrentNode, setNodesDelay } =
  nodeSlice.actions;

export default nodeSlice.reducer;

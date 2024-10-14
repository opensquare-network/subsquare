import { createSlice } from "@reduxjs/toolkit";
import getChainSettings from "../../utils/consts/settings";

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

export function getInitNodeUrl(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = localStorage.getItem(`nodeUrl-${chain}`);
  } catch (e) {
    // ignore parse error
  }

  const settings = getChainSettings(chain);
  const chainNodes = endpointsFromEnv || settings.endpoints;
  if (chainNodes.length <= 0) {
    throw new Error(`Can not find nodes for ${chain}`);
  }

  const node = (chainNodes || []).find(({ url }) => url === localNodeUrl);
  return node?.url;
}

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    chain,
    currentNode: getInitNodeUrl(chain),
    nodes: endpointsFromEnv || getChainSettings(chain).endpoints,
    nodesHeight: null,
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
        localStorage.setItem(`nodeUrl-${state.chain}`, url);
      }

      if (refresh) {
        window.location.href = `https://${state.chain}.subsquare.io`;
      }
    },
    removeCurrentNode(state) {
      localStorage.removeItem(`nodeUrl-${state.chain}`);
      state.currentNode = null;
    },
    setNodesDelay(state, { payload }) {
      (payload || []).forEach((item) => {
        const node = (state.nodes || []).find((node) => item.url === node.url);
        if (node) node.delay = item.delay;
      });
    },
    setNodeBlockHeight(state, { payload }) {
      state.nodesHeight = payload;
    },
  },
});

export const currentNodeSelector = (state) => state.node?.currentNode;
export const nodesSelector = (state) => state.node?.nodes;
export const nodesHeightSelector = (state) => state.node?.nodesHeight;

export const {
  setCurrentNode,
  removeCurrentNode,
  setNodesDelay,
  setNodeBlockHeight,
} = nodeSlice.actions;

export default nodeSlice.reducer;

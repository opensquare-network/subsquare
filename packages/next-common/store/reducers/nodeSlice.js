import { createSlice } from "@reduxjs/toolkit";
import getChainSettings from "../../utils/consts/settings";

const chain = process.env.NEXT_PUBLIC_CHAIN;

function getInitNodeUrl(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = localStorage.getItem("nodeUrl");
  } catch (e) {
    // ignore parse error
  }

  const settings = getChainSettings(chain);
  const chainNodes = settings.endpoints;
  if (chainNodes.length <= 0) {
    throw new Error(`Can not find nodes for ${chain}`);
  }

  const node = (chainNodes || []).find(({ url }) => url === localNodeUrl);
  if (node) {
    return node.url;
  }
}

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: getInitNodeUrl(chain),
    nodes: getChainSettings(chain).endpoints,
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
        localStorage.setItem("nodeUrl", url);
      }

      if (refresh) {
        window.location.href = `https://${chain}.subsquare.io`;
      }
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

export const { setCurrentNode, setNodesDelay, setNodeBlockHeight } =
  nodeSlice.actions;

export default nodeSlice.reducer;

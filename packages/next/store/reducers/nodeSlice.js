import { createSlice } from "@reduxjs/toolkit";

import {
  DEFAULT_KUSAMA_NODE_URL,
  DEFAULT_KUSAMA_NODES,
  DEFAULT_KARURA_NODE_URL,
  DEFAULT_KARURA_NODES,
} from "utils/constants";

let nodeUrl = (() => {
  let localNodeUrl = null;
  try {
    localNodeUrl = JSON.parse(localStorage.getItem("nodeUrl"));
  } catch (e) {
    // ignore parse error
  }
  return {
    kusama:
      DEFAULT_KUSAMA_NODES.find((item) => item.url === localNodeUrl?.kusama)
        ?.url || DEFAULT_KUSAMA_NODE_URL,
    karura:
      DEFAULT_KARURA_NODES.find((item) => item.url === localNodeUrl?.karura)
        ?.url || DEFAULT_KARURA_NODE_URL,
  };
})();

export const getNodeUrl = () => nodeUrl;

export const getNodes = () => ({
  kusama: DEFAULT_KUSAMA_NODES,
  karura: DEFAULT_KARURA_NODES,
});

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: getNodeUrl(),
    nodes: getNodes(),
  },
  reducers: {
    setCurrentNode(state, { payload }) {
      const { chain, url, refresh } = payload;
      const boforeUrl = state.currentNode?.[chain];

      let nodeUrl = null;
      try {
        nodeUrl = JSON.parse(localStorage.getItem("nodeUrl"));
      } catch (e) {
        // ignore parse error
      }
      nodeUrl = { ...nodeUrl, [chain]: url };
      localStorage.setItem("nodeUrl", JSON.stringify(nodeUrl));

      state.nodes[chain] = (state.nodes?.[chain] || []).map((item) => {
        if (item.url === boforeUrl) {
          return { ...item, update: true };
        } else {
          return item;
        }
      });
      state.currentNode = nodeUrl;

      if (refresh) {
        window.location.href = `/${chain}`;
      }
    },
    setNodesDelay(state, { payload }) {
      (payload || []).forEach((item) => {
        const node = state.nodes[item.chain]?.find(
          (node) => item.url === node.url
        );
        if (node) node.delay = item.delay;
      });
    },
  },
});

export const currentNodeSelector = (state) => state.node.currentNode;
export const nodesSelector = (state) => state.node.nodes;

export const { setCurrentNode, setNodesDelay } = nodeSlice.actions;

export default nodeSlice.reducer;

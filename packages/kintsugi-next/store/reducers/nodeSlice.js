import { createSlice } from "@reduxjs/toolkit";

import {
  DEFAULT_KINTSUGI_NODES,
  DEFAULT_KINTSUGI_NODE_URL,
} from "next-common/utils/constants";

const chain = process.env.NEXT_PUBLIC_CHAIN || "kintsugi";

let nodeUrl = (() => {
  let localNodeUrl = null;
  try {
    localNodeUrl = localStorage.getItem("nodeUrl");
  } catch (e) {
    // ignore parse error
  }

  return {
    kintsugi:
      DEFAULT_KINTSUGI_NODES.find((item) => item.url === localNodeUrl)?.url ||
      DEFAULT_KINTSUGI_NODE_URL,
  };
})();

export const defaultNodes = {
  kintsugi: DEFAULT_KINTSUGI_NODES,
};

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: nodeUrl[chain],
    nodes: defaultNodes[chain],
    nodesHeight: 0,
  },
  reducers: {
    setCurrentNode(state, { payload }) {
      const { url, refresh } = payload;
      const beforeUrl = state.currentNode;

      state.currentNode = url;
      localStorage.setItem("nodeUrl", url);
      state.nodes = (state.nodes || []).map((item) => {
        if (item.url === beforeUrl) {
          return { ...item, update: true };
        } else {
          return item;
        }
      });

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

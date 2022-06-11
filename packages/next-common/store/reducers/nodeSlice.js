import { createSlice } from "@reduxjs/toolkit";
import { defaultNodes } from "../../utils/constants";

const chain = process.env.NEXT_PUBLIC_CHAIN;

function getInitNodeUrl(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = localStorage.getItem("nodeUrl");
  } catch (e) {
    // ignore parse error
  }

  const chainNodes = defaultNodes[chain];
  const node = (chainNodes || []).find(({ url }) => url === localNodeUrl);
  if (node) {
    return node.url;
  } else if (chainNodes) {
    return chainNodes[0].url;
  }

  throw new Error(`Can not find nodes for ${chain}`);
}

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: getInitNodeUrl(chain),
    nodes: defaultNodes[chain],
    nodesHeight: 0,
  },
  reducers: {
    setCurrentNode(state, { payload }) {
      const { url, refresh } = payload;
      const beforeUrl = state.currentNode;

      state.currentNode = url;
      state.nodes = (state.nodes || []).map((item) => {
        if (item.url === beforeUrl) {
          return { ...item, update: true };
        } else {
          return item;
        }
      });
      localStorage.setItem("nodeUrl", url);

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

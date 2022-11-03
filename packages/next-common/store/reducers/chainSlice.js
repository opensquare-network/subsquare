import { createSlice } from "@reduxjs/toolkit";
import { defaultBlockTime } from "../../utils/constants";
import getChainSettings from "../../utils/consts/settings";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    blockTime: getChainSettings(chain).blockTime || defaultBlockTime,
    latestHeight: null,
    nowHeight: 0,
    // FIXME: not sure is the right way to place the flag here
    hasGov2: false,
  },
  reducers: {
    setBlockTime(state, { payload }) {
      state.blockTime = payload;
    },
    setLatestHeight(state, { payload }) {
      state.latestHeight = payload || 0;
    },
    setNowHeight(state, { payload }) {
      state.nowHeight = payload || 0;
    },
    setHasGov2(state, { payload }) {
      state.hasGov2 = payload;
    },
  },
});

export const { setBlockTime, setLatestHeight, setNowHeight, setHasGov2 } =
  chainSlice.actions;

export const blockTimeSelector = (state) => state.chain.blockTime;
export const latestHeightSelector = (state) => state.chain.latestHeight;
export const nowHeightSelector = (state) => state.chain.nowHeight;
export const hasGov2Selector = (state) => state.chain.hasGov2;

export default chainSlice.reducer;

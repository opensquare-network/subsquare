import { createSlice } from "@reduxjs/toolkit";
import { defaultBlockTime } from "../../utils/constants";
import getChainSettings from "../../utils/consts/settings";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    blockTime: getChainSettings(chain).blockTime || defaultBlockTime,
    finalizedHeight: 0,
  },
  reducers: {
    setBlockTime(state, { payload }) {
      state.blockTime = payload;
    },
    setFinalizedHeight(state, { payload }) {
      state.finalizedHeight = payload || 0;
    },
  },
});

export const { setFinalizedHeight, setBlockTime } = chainSlice.actions;

export const blockTimeSelector = (state) => state.chain.blockTime;
export const finalizedHeightSelector = (state) => state.chain.finalizedHeight;

export default chainSlice.reducer;

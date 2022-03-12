import { createSlice } from "@reduxjs/toolkit";
import { ChainBlockTime, defaultBlockTime } from "../../utils/constants";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    blockTime: ChainBlockTime[chain] || defaultBlockTime,
    finalizedHeight: 0,
  },
  reducers: {
    setBlockTime(state, { payload }) {
      state.blockTime = payload;
    },
    setFinalizedHeight(state, { payload }) {
      state.finalizedHeight = payload;
    },
  },
});

export const { setFinalizedHeight, setBlockTime } = chainSlice.actions;

export const blockTimeSelector = (state) => state.chain.blockTime;
export const finalizedHeightSelector = (state) => state.chain.finalizedHeight;

export default chainSlice.reducer;

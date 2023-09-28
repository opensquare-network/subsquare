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
    convictionVotingLockPeriod: null,
    democracyLockPeriod: null,
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
    setConvictionVotingLockPeriod(state, { payload }) {
      state.convictionVotingLockPeriod = payload;
    },
    setDemocracyLockPeriod(state, { payload }) {
      state.democracyLockPeriod = payload;
    },
  },
});

export const {
  setBlockTime,
  setLatestHeight,
  setNowHeight,
  setConvictionVotingLockPeriod,
  setDemocracyLockPeriod,
} = chainSlice.actions;

export const blockTimeSelector = (state) => state.chain.blockTime;
export const latestHeightSelector = (state) => state.chain.latestHeight;
export const nowHeightSelector = (state) => state.chain.nowHeight;
export const convictionVotingLockPeriodSelector = (state) =>
  state.chain.convictionVotingLockPeriod;
export const democracyLockPeriodSelector = (state) =>
  state.chain.democracyLockPeriod;

export default chainSlice.reducer;

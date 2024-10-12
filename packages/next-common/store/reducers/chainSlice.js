import { createSlice } from "@reduxjs/toolkit";
import { defaultBlockTime } from "../../utils/constants";
import getChainSettings from "../../utils/consts/settings";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    blockTime: getChainSettings(chain).blockTime || defaultBlockTime,
    latestHeight: null,
    convictionVotingLockPeriod: null,
    democracyLockPeriod: null,
    existentialDeposit: null,
  },
  reducers: {
    setBlockTime(state, { payload }) {
      state.blockTime = payload;
    },
    setConvictionVotingLockPeriod(state, { payload }) {
      state.convictionVotingLockPeriod = payload;
    },
    setDemocracyLockPeriod(state, { payload }) {
      state.democracyLockPeriod = payload;
    },
    setExistentialDeposit(state, { payload }) {
      state.existentialDeposit = payload;
    },
  },
});

export const {
  setBlockTime,
  setConvictionVotingLockPeriod,
  setDemocracyLockPeriod,
  setExistentialDeposit,
} = chainSlice.actions;

export const blockTimeSelector = (state) => state.chain.blockTime;
export const latestHeightSelector = (state) => state.chain.latestHeight;
export const convictionVotingLockPeriodSelector = (state) =>
  state.chain.convictionVotingLockPeriod;
export const democracyLockPeriodSelector = (state) =>
  state.chain.democracyLockPeriod;
export const existentialDepositSelector = (state) =>
  state.chain.existentialDeposit;

export default chainSlice.reducer;

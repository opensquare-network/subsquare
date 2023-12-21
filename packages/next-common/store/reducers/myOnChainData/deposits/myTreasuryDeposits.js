import { createSlice } from "@reduxjs/toolkit";

const name = "myTreasuryDeposits";

const myTreasuryProposalDepositsSlice = createSlice({
  name,
  initialState: {
    proposalDeposits: null,
    bountyBonds: null,
    bountyCuratorDeposits: null,
    tipDeposits: null,
  },
  reducers: {
    setProposalDeposits(state, { payload }) {
      state.proposalDeposits = payload;
    },
    setBountyBonds(state, { payload }) {
      state.bountyBonds = payload;
    },
    setBountyCuratorDeposits(state, { payload }) {
      state.bountyCuratorDeposits = payload;
    },
    setTipDeposits(state, { payload }) {
      state.tipDeposits = payload;
    },
  },
});

export const {
  setProposalDeposits: setTreasuryProposalDeposits,
  setBountyBonds,
  setBountyCuratorDeposits,
  setTipDeposits,
} = myTreasuryProposalDepositsSlice.actions;

export const myTreasuryProposalDepositsSelector = (state) =>
  state[name].proposalDeposits;
export const myTreasuryBountyBondsSelector = (state) => state[name].bountyBonds;
export const myTreasuryBountyCuratorDepositsSelector = (state) =>
  state[name].bountyCuratorDeposits;
export const myTreasuryTipDepositsSelector = (state) => state[name].tipDeposits;

export default myTreasuryProposalDepositsSlice.reducer;

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

export default myTreasuryProposalDepositsSlice.reducer;

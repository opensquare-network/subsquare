import { createSlice } from "@reduxjs/toolkit";

const name = "myTreasuryDeposits";

const myTreasuryProposalDepositsSlice = createSlice({
  name,
  initialState: {
    proposalDeposits: null,
    bountyBonds: null,
    bountyCuratorDeposits: null,
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
  },
});

export const {
  setProposalDeposits: setTreasuryProposalDeposits,
  setBountyBonds,
  setBountyCuratorDeposits,
} = myTreasuryProposalDepositsSlice.actions;

export default myTreasuryProposalDepositsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const name = "myTreasuryDeposits";

const myTreasuryProposalDepositsSlice = createSlice({
  name,
  initialState: {
    proposalDeposits: null,
  },
  reducers: {
    setProposalDeposits(state, { payload }) {
      state.proposalDeposits = payload;
    },
  },
});

export const { setProposalDeposits: setTreasuryProposalDeposits } =
  myTreasuryProposalDepositsSlice.actions;

export default myTreasuryProposalDepositsSlice.reducer;

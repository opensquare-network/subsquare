import { createSlice } from "@reduxjs/toolkit";

const treasuryProposalSlice = createSlice({
  name: "treasuryProposal",
  initialState: {
    pendingProposals: [],
    checkTimes: 0,
  },
  reducers: {
    addPendingProposal(state, { payload }) {
      state.pendingProposals.push(payload);
    },
    removePendingProposal(state, { payload }) {
      state.pendingProposals = state.pendingProposals.filter(
        (proposalIndex) => proposalIndex !== payload
      );
    },
    setCheckTimes(state, { payload }) {
      state.checkTimes = payload;
    },
  },
});

export const pendingProposalsSelector = (state) =>
  state.treasuryProposal.pendingProposals;
export const checkTimesSelector = (state) => state.treasuryProposal.checkTimes;

export const { addPendingProposal, removePendingProposal, setCheckTimes } =
  treasuryProposalSlice.actions;

export default treasuryProposalSlice.reducer;

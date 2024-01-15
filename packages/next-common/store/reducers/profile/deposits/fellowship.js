import { createSlice } from "@reduxjs/toolkit";

const name = "profileFellowshipDeposits";

const profileFellowshipDepositsSlice = createSlice({
  name,
  initialState: {
    submissionDeposits: null,
    decisionDeposits: null,
  },
  reducers: {
    setSubmissionDeposits(state, { payload }) {
      state.submissionDeposits = payload;
    },
    setDecisionDeposits(state, { payload }) {
      state.decisionDeposits = payload;
    },
  },
});

export const {
  setSubmissionDeposits: setProfileFellowshipSubmissionDeposits,
  setDecisionDeposits: setProfileFellowshipDecisionDeposits,
} = profileFellowshipDepositsSlice.actions;

export const profileFellowshipSubmissionDepositsSelector = (state) =>
  state[name].submissionDeposits;
export const profileFellowshipDecisionDepositsSelector = (state) =>
  state[name].decisionDeposits;

export default profileFellowshipDepositsSlice.reducer;

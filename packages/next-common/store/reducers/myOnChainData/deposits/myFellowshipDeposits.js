import { createSlice } from "@reduxjs/toolkit";

const name = "myFellowshipDeposits";

const myFellowshipDepositsSlice = createSlice({
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
  setSubmissionDeposits: setMyFellowshipSubmissionDeposits,
  setDecisionDeposits: setMyFellowshipDecisionDeposits,
} = myFellowshipDepositsSlice.actions;

export default myFellowshipDepositsSlice.reducer;

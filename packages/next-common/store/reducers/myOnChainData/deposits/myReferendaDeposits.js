import { createSlice } from "@reduxjs/toolkit";

const name = "myReferendaDeposits";

const myReferendaDepositsSlice = createSlice({
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

export const { setSubmissionDeposits, setDecisionDeposits } =
  myReferendaDepositsSlice.actions;

export const myReferendaSubmissionDepositsSelector = (state) =>
  state[name].submissionDeposits;
export const myReferendaDecisionDepositsSelector = (state) =>
  state[name].decisionDeposits;

export default myReferendaDepositsSlice.reducer;

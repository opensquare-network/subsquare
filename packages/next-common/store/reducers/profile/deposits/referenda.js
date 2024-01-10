import { createSlice } from "@reduxjs/toolkit";

const name = "profileReferendaDeposits";

const profileReferendaDepositsSlice = createSlice({
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
  setSubmissionDeposits: setProfileReferendaSubmissionDeposits,
  setDecisionDeposits: setProfileReferendaDecisionDeposits,
} = profileReferendaDepositsSlice.actions;

export const profileReferendaSubmissionDepositsSelector = (state) =>
  state[name].submissionDeposits;
export const profileReferendaDecisionDepositsSelector = (state) =>
  state[name].decisionDeposits;

export default profileReferendaDepositsSlice.reducer;

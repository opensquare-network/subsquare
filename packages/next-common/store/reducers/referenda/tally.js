import { createSlice } from "@reduxjs/toolkit";

const name = "referendaReferendumTally";

// Used for referenda or fellowship referenda referendum detail page tally data.
const referendaReferendumSlice = createSlice({
  name,
  initialState: {
    tally: null,
  },
  reducers: {
    setReferendaReferendumTally(state, { payload }) {
      state.tally = payload;
    },
    clearReferendaReferendumTally(state) {
      state.tally = null;
    },
  },
});

export const {
  setReferendaReferendumTally,
  clearReferendaReferendumTally,
} = referendaReferendumSlice.actions;

export const referendaReferendumSelector = (state) => state[name].tally;

export default referendaReferendumSlice.reducer;

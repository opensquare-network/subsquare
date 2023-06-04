import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipReferendumTally";

// Used for fellowship referenda referendum detail page tally data.
const fellowshipReferendumTallySlice = createSlice({
  name,
  initialState: {
    tally: null,
  },
  reducers: {
    setFellowshipReferendumTally(state, { payload }) {
      state.tally = payload;
    },
    clearFellowshipReferendumTally(state) {
      state.tally = null;
    },
  },
});

export const {
  setFellowshipReferendumTally,
  clearFellowshipReferendumTally,
} = fellowshipReferendumTallySlice.actions;

export const fellowshipReferendumTallySelector = (state) => state[name].tally;

export default fellowshipReferendumTallySlice.reducer;

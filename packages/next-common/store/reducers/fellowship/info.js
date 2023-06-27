import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipReferendumInfo";

// Used for referenda or fellowship referenda referendum detail page tally data.
const fellowshipReferendumInfoSlice = createSlice({
  name,
  initialState: {
    info: null,
  },
  reducers: {
    setFellowshipReferendumInfo(state, { payload }) {
      state.info = payload;
    },
    clearFellowshipReferendumInfo(state) {
      state.info = null;
    },
  },
});

export const {
  setFellowshipReferendumInfo,
  clearFellowshipReferendumInfo,
} = fellowshipReferendumInfoSlice.actions;

export const fellowshipReferendumInfoSelector = state => state[name].info;
export default fellowshipReferendumInfoSlice.reducer;

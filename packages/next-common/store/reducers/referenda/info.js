import { createSlice } from "@reduxjs/toolkit";

const name = "referendaReferendumInfo";

// Used for referenda or fellowship referenda referendum detail page tally data.
const referendaReferendumInfoSlice = createSlice({
  name,
  initialState: {
    info: null,
  },
  reducers: {
    setReferendaReferendumInfo(state, { payload }) {
      state.info = payload;
    },
    clearReferendaReferendumInfo(state) {
      state.info = null;
    },
  },
});

export const {
  setReferendaReferendumInfo,
  clearReferendaReferendumInfo,
} = referendaReferendumInfoSlice.actions;

export const referendumInfoSelector = state => state[name].info;
export default referendaReferendumInfoSlice.reducer;

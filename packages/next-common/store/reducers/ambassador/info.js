import { createSlice } from "@reduxjs/toolkit";

const name = "ambassadorReferendumInfo";

// Used for ambassador referenda referendum detail page tally data.
const ambassadorReferendumInfoSlice = createSlice({
  name,
  initialState: {
    info: null,
  },
  reducers: {
    setAmbassadorReferendumInfo(state, { payload }) {
      state.info = payload;
    },
    clearAmbassadorReferendumInfo(state) {
      state.info = null;
    },
  },
});

export const { setAmbassadorReferendumInfo, clearAmbassadorReferendumInfo } =
  ambassadorReferendumInfoSlice.actions;

export const ambassadorReferendumInfoSelector = (state) => state[name].info;
export default ambassadorReferendumInfoSlice.reducer;

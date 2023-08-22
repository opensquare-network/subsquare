const { createSlice } = require("@reduxjs/toolkit");

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    multiTabs: {
      // flattened, nested
      votesStatsMode: "flattened",
    },
  },
  reducers: {
    setDetailMultiTabsVotesStatsMode(state, { payload }) {
      state.multiTabs.votesStatsMode = payload;
    },
  },
});

export const { setDetailMultiTabsVotesStatsMode } = detailSlice.actions;

export const detailMultiTabsVotesStatsMode = (state) =>
  state.detail.multiTabs.votesStatsMode;

export default detailSlice.reducer;

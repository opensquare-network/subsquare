const { createSlice } = require("@reduxjs/toolkit");

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    multiTabs: {
      // flattened, nested
      votesStatsView: "flattened",
    },
  },
  reducers: {
    setDetailMultiTabsVotesStatsView(state, { payload }) {
      state.multiTabs.votesStatsView = payload;
    },
  },
});

export const { setDetailMultiTabsVotesStatsView } = detailSlice.actions;

export const detailMultiTabsVotesStatsView = (state) =>
  state.detail.multiTabs.votesStatsView;

export default detailSlice.reducer;

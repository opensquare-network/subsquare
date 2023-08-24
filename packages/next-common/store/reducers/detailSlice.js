const { createSlice } = require("@reduxjs/toolkit");

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    multiTabs: {
      // flattened, nested
      votesBubbleView: "flattened",
    },
  },
  reducers: {
    setDetailMultiTabsVotesBubbleView(state, { payload }) {
      state.multiTabs.votesBubbleView = payload;
    },
  },
});

export const { setDetailMultiTabsVotesBubbleView } = detailSlice.actions;

export const detailMultiTabsVotesBubbleView = (state) =>
  state.detail.multiTabs.votesBubbleView;

export default detailSlice.reducer;

const { createSlice } = require("@reduxjs/toolkit");

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    multiTabs: {
      // normal, compact
      timelineMode: "normal",
      // flattened, nested
      votesBubbleView: "nested",
    },
  },
  reducers: {
    setDetailMultiTabsTimelineMode(state, { payload }) {
      state.multiTabs.timelineMode = payload;
    },
    setDetailMultiTabsVotesBubbleView(state, { payload }) {
      state.multiTabs.votesBubbleView = payload;
    },
  },
});

export const {
  setDetailMultiTabsTimelineMode,
  setDetailMultiTabsVotesBubbleView,
} = detailSlice.actions;

export const detailMultiTabsTimelineMode = (state) =>
  state.detail.multiTabs.timelineMode;
export const detailMultiTabsIsTimelineCompactModeSelector = (state) =>
  state.detail.multiTabs.timelineMode === "compact";

export const detailMultiTabsVotesBubbleView = (state) =>
  state.detail.multiTabs.votesBubbleView;

export default detailSlice.reducer;

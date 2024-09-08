import { createSlice } from "@reduxjs/toolkit";

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    multiTabs: {
      // normal, compact
      timelineMode: "normal",
      // flattened, nested
      votesBubbleView: "nested",
    },
    comments: {
      merging: false,
    },
  },
  reducers: {
    setDetailMultiTabsTimelineMode(state, { payload }) {
      state.multiTabs.timelineMode = payload;
    },
    setDetailMultiTabsVotesBubbleView(state, { payload }) {
      state.multiTabs.votesBubbleView = payload;
    },
    setDetailCommentsMerging(state, { payload }) {
      state.comments.merging = payload;
    },
  },
});

export const {
  setDetailMultiTabsTimelineMode,
  setDetailMultiTabsVotesBubbleView,
  setDetailCommentsMerging,
} = detailSlice.actions;

export const detailMultiTabsTimelineMode = (state) =>
  state.detail.multiTabs.timelineMode;
export const detailMultiTabsIsTimelineCompactModeSelector = (state) =>
  state.detail.multiTabs.timelineMode === "compact";

export const detailMultiTabsVotesBubbleView = (state) =>
  state.detail.multiTabs.votesBubbleView;

export const detailCommentsMergingSelector = (state) =>
  state.detail.comments.merging;

export default detailSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    comments: {
      merging: false,
    },
  },
  reducers: {
    setDetailCommentsMerging(state, { payload }) {
      state.comments.merging = payload;
    },
  },
});

export const { setDetailCommentsMerging } = detailSlice.actions;

export const detailCommentsMergingSelector = (state) =>
  state.detail.comments.merging;

export default detailSlice.reducer;

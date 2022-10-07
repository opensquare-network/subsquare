// used for on chain proposal data
import { createSelector, createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    post: null,
    detailType: null,
  },
  reducers: {
    setPost(state, { payload }) {
      state.post = payload;
    },
    setDetailType(state, { payload }) {
      state.detailType = payload;
    }
  }
})

export const { setPost, setDetailType } = postSlice.actions;
export const postSelector = (state) => state.post.post;
export const detailTypeSelector = (state) => state.post.detailType;
export const postAuthorsSelector = createSelector(postSelector, post => {
  return post?.authors
});

export const postStateSelector = createSelector(postSelector, post => {
  return post?.onchainData?.state?.state
})

export default postSlice.reducer;

// used for on chain proposal data
import { createSelector, createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    post: null,
  },
  reducers: {
    setPost(state, { payload }) {
      state.post = payload;
    }
  }
})

export const { setPost } = postSlice.actions;
export const postSelector = (state) => state.post.post;
export const postAuthorsSelector = createSelector(postSelector, post => {
  return post?.authors
});

export default postSlice.reducer;

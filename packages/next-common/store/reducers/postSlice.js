// used for on chain proposal data
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { toApiType } from "../../utils/viewfuncs";
import nextApi from "../../services/nextApi";

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

export const fetchPost = (type, postId) => async (dispatch) => {
  const url = `${ toApiType(type) }/${ postId }`;
  const { result: newPost } = await nextApi.fetch(url);
  if (newPost) {
    dispatch(setPost(newPost));
  }
}

export default postSlice.reducer;

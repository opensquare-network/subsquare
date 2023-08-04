import { createSlice } from "@reduxjs/toolkit";

const myVotesSlice = createSlice({
  name: "myVotes",
  initialState: {
    trigger: 0,
    posts: null,
  },
  reducers: {
    incTrigger(state) {
      state.trigger += 1;
    },
    setPosts(state, { payload }) {
      state.posts = payload;
    },
  },
});

export const { incTrigger: incMyVotesTrigger, setPosts: setMyVotedPosts } =
  myVotesSlice.actions;

export const myVotesTriggerSelector = (state) => state.myVotes.trigger;
export const myVotedPostsSelector = (state) => state.myVotes.posts;

export default myVotesSlice.reducer;

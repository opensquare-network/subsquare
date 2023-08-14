import { createSlice } from "@reduxjs/toolkit";

const myVotesSlice = createSlice({
  name: "myVotes",
  initialState: {
    trigger: 0,
    posts: null,
    isLoading: false,
  },
  reducers: {
    incTrigger(state) {
      state.trigger += 1;
    },
    setPosts(state, { payload }) {
      state.posts = payload;
    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },
  },
});

export const {
  incTrigger: incMyVotesTrigger,
  setPosts: setMyVotedPosts,
  setIsLoading: setMyVotedPostsLoading,
} = myVotesSlice.actions;

export const myVotesTriggerSelector = (state) => state.myVotes.trigger;
export const myVotedPostsSelector = (state) => state.myVotes.posts;
export const myVotedPostsLoading = (state) => state.myVotes.isLoading;

export default myVotesSlice.reducer;

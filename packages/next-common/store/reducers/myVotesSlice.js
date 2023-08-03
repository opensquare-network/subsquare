import { createSlice } from "@reduxjs/toolkit";

const myVotesSlice = createSlice({
  name: "myVotes",
  initialState: {
    trigger: 0,
  },
  reducers: {
    incTrigger(state) {
      state.trigger += 1;
    },
  },
});

export const { incTrigger: incMyVotesTrigger } = myVotesSlice.actions;

export const myVotesTriggerSelector = (state) => state.myVotes.trigger;

export default myVotesSlice.reducer;

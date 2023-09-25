import { createSelector, createSlice } from "@reduxjs/toolkit";

const name = "myDemocracyVoting";

const myDemocracyVotingSlice = createSlice({
  name,
  initialState: {
    voting: null,
  },
  reducers: {
    setVoting(state, { payload }) {
      state.voting = payload;
    },
  },
});

export const { setVoting: setMyDemocracyVoting } =
  myDemocracyVotingSlice.actions;

export const myDemocracyVotingSelector = (state) => state[name].voting;

export const isMyDemocracyDelegatingSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting) {
      return false;
    }

    return voting.isDelegating;
  },
);

export default myDemocracyVotingSlice.reducer;

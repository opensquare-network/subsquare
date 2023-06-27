import { createSlice } from "@reduxjs/toolkit";
import { emptyVotes } from "next-common/utils/democracy/votes/passed/common";

const name = "fellowshipReferendumVotes";

const fellowshipVotesSlice = createSlice({
  name,
  initialState: {
    isLoadingVotes: true,
    votes: emptyVotes,
    votesTrigger: 1,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setVotes(state, { payload }) {
      state.votes = payload;
    },
    incVotesTrigger(state) {
      state.votesTrigger += 1;
    },
    clearVotersTrigger(state) {
      state.votesTrigger = 1;
    },
  },
});

export const {
  setIsLoadingVotes: setIsLoadingFellowshipVotes,
  setVotes: setFellowshipVotes,
  incVotesTrigger: incFellowshipVotesTrigger,
  clearVotersTrigger: clearFellowshipVotesTrigger,
} = fellowshipVotesSlice.actions;

export const isLoadingFellowshipVotesSelector = (state) => state[name].isLoadingVotes;
export const fellowshipVotesSelector = (state) => state[name].votes;
export const fellowshipVotesTriggerSelector = (state) => state[name].votesTrigger;

export const clearFellowshipVotes = () => async (dispatch) => {
  dispatch(setFellowshipVotes(emptyVotes));
};

export default fellowshipVotesSlice.reducer;

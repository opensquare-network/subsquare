import { createSlice } from "@reduxjs/toolkit";
import fetchAndNormalizeVotes from "next-common/utils/gov2/votes/fetch";
import { name } from "./consts";

const referendaVotesSlice = createSlice({
  name,
  initialState: {
    allVotes: null,
    votesTrigger: 1,
  },
  reducers: {
    setAllVotes(state, { payload }) {
      state.allVotes = payload;
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
  setAllVotes,
  incVotesTrigger,
  clearVotersTrigger,
} = referendaVotesSlice.actions;

export const clearVotes = () => async (dispatch) => {
  dispatch(setAllVotes(null));
  dispatch(clearVotersTrigger());
};

export const triggerFetchVotes = () => async dispatch => dispatch(incVotesTrigger());

export const fetchReferendaVotes = (api, trackId, referendumIndex) => async (dispatch) => {
  const sortedVotes = await fetchAndNormalizeVotes(api, trackId, referendumIndex);
  dispatch(setAllVotes(sortedVotes));
};

export default referendaVotesSlice.reducer;

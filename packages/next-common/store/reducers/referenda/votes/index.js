import { createSlice } from "@reduxjs/toolkit";
import fetchAndNormalizeVotes from "next-common/utils/gov2/votes/fetch";
import { name } from "./consts"

const referendaVotesSlice = createSlice({
  name,
  initialState: {
    isLoadingVotes: true,
    allVotes: null,
    votesTrigger: 1,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setAllVotes(state, { payload }) {
      state.allVotes = payload;
    },
    incVotesTrigger(state) {
      state.votesTrigger += 1;
    },
    clearVotersTrigger(state) {
      state.votesTrigger = 1;
    },
  }
});

export const {
  setIsLoadingVotes,
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
  try {
    const sortedVotes = await fetchAndNormalizeVotes(api, trackId, referendumIndex);
    dispatch(setAllVotes(sortedVotes));
  } finally {
    dispatch(setIsLoadingVotes(false));
  }
}

export default referendaVotesSlice.reducer;

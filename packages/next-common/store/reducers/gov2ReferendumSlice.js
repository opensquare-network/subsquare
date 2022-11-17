import { createSlice } from "@reduxjs/toolkit";
import { emptyVotes } from "../../utils/democracy/votes/passed/common";
import { getGov2ReferendumVotesFromVotingOf } from "../../utils/gov2/allVotes";

const gov2ReferendumSlice = createSlice({
  name: "gov2Referendum",
  initialState: {
    isLoadingVotes: true,
    votes: emptyVotes,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setVotes(state, { payload }) {
      state.votes = payload;
    },
  },
});

export const { setVotes, setIsLoadingVotes } = gov2ReferendumSlice.actions;

export const isLoadingVotesSelector = (state) =>
  state.gov2Referendum.isLoadingVotes;
export const votesSelector = (state) => state.gov2Referendum.votes;

export const clearVotes = () => async (dispatch) => {
  dispatch(setVotes(emptyVotes));
};

export const fetchVotes =
  (api, trackId, referendumIndex, passedHeight) => async (dispatch) => {
    dispatch(clearVotes());
    dispatch(setIsLoadingVotes(true));
    try {
      let blockApi = api;
      if (passedHeight) {
        const blockHash = await api.rpc.chain.getBlockHash(passedHeight - 1);
        blockApi = await api.at(blockHash);
      }
      const votes = await getGov2ReferendumVotesFromVotingOf(
        blockApi,
        trackId,
        referendumIndex
      );

      dispatch(setVotes(votes));
    } finally {
      dispatch(setIsLoadingVotes(false));
    }
  };

export default gov2ReferendumSlice.reducer;

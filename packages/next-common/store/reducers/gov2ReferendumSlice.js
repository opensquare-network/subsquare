import { createSlice } from "@reduxjs/toolkit";
import nextApi from "../../services/nextApi";
import { gov2ReferendumsVoteExtrinsicsApi } from "../../services/url";
import { emptyVotes } from "../../utils/democracy/votes/passed/common";
import { getGov2ReferendumVotesFromVotingOf } from "../../utils/gov2/allVotes";

const gov2ReferendumSlice = createSlice({
  name: "gov2Referendum",
  initialState: {
    isLoadingVotes: true,
    votes: emptyVotes,
    isLoadingVoteExtrinsics: true,
    voteExtrinsics: emptyVotes,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setVotes(state, { payload }) {
      state.votes = payload;
    },
    setIsLoadingVoteExtrinsics(state, { payload }) {
      state.isLoadingVoteExtrinsics = payload;
    },
    setVoteExtrinsics(state, { payload }) {
      state.voteExtrinsics = payload;
    },
  },
});

export const {
  setVotes,
  setIsLoadingVotes,
  setVoteExtrinsics,
  setIsLoadingVoteExtrinsics,
} = gov2ReferendumSlice.actions;

export const isLoadingVotesSelector = (state) =>
  state.gov2Referendum.isLoadingVotes;
export const isLoadingVoteExtrinsicsSelector = (state) =>
  state.gov2Referendum.isLoadingVoteExtrinsics;
export const votesSelector = (state) => state.gov2Referendum.votes;
export const voteExtrinsicsSelector = (state) =>
  state.gov2Referendum.voteExtrinsics;

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

export const clearVoteExtrinsics = () => async (dispatch) => {
  dispatch(setVoteExtrinsics(emptyVotes));
};

export const fetchVoteExtrinsics = (referendumIndex) => async (dispatch) => {
  dispatch(clearVoteExtrinsics());
  dispatch(setIsLoadingVoteExtrinsics(true));
  try {
    const { result } = await nextApi.fetch(
      gov2ReferendumsVoteExtrinsicsApi(referendumIndex)
    );

    const allAye = [];
    const allNay = [];

    for (const item of result) {
      if (item.isStandard) {
        if (item.vote.vote.isAye) {
          allAye.push(item);
        } else {
          allNay.push(item);
        }
      } else if (item.isSplit) {
        allAye.push({
          ...item,
          vote: {
            balance: item.vote.aye,
            vote: {
              isAye: true,
              conviction: 0,
            },
          },
        });
        allNay.push({
          ...item,
          vote: {
            balance: item.vote.nay,
            vote: {
              isAye: false,
              conviction: 0,
            },
          },
        });
      }
    }

    dispatch(setVoteExtrinsics({ allAye, allNay }));
  } finally {
    dispatch(setIsLoadingVoteExtrinsics(false));
  }
};

export default gov2ReferendumSlice.reducer;

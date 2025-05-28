import { createSlice } from "@reduxjs/toolkit";
import { name } from "./consts";
import Chains from "next-common/utils/consts/chains";
import getKintsugiReferendumVotes from "next-common/utils/democracy/votes/kintsugi";
import getReferendumVotes from "next-common/utils/democracy/votes";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const democracyVotesSlice = createSlice({
  name,
  initialState: {
    allVotes: null,
    votesTrigger: 1,
    loading: false,
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
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setAllVotes, incVotesTrigger, clearVotersTrigger, setLoading } =
  democracyVotesSlice.actions;

export const clearVotes = () => async (dispatch) => {
  dispatch(setAllVotes(null));
  dispatch(clearVotersTrigger());
};

export const fetchVotes =
  (api, referendumIndex, passedHeight) => async (dispatch) => {
    dispatch(setLoading(true));

    let votes;
    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      votes = await getKintsugiReferendumVotes(api, referendumIndex);
    } else {
      votes = await getReferendumVotes(api, referendumIndex, passedHeight);
    }

    dispatch(setAllVotes(votes));
    dispatch(setLoading(false));
  };

export default democracyVotesSlice.reducer;

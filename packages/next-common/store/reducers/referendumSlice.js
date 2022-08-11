import { createSlice } from "@reduxjs/toolkit";
import { emptyVotes } from "../../utils/democracy/votes/passed/common";
import getReferendumVotes from "../../utils/democracy/votes";
import Chains from "../../utils/consts/chains";
import getKintsugiReferendumVotes from "../../utils/democracy/votes/kintsugi";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const referendumSlice = createSlice({
  name: "referendum",
  initialState: {
    isLoadingVotes: false,
    votes: emptyVotes,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setVotes(state, { payload }) {
      state.votes = payload;
    }
  }
})

export const { setVotes, setIsLoadingVotes } = referendumSlice.actions;

export const fetchVotes = (api, referendumIndex, passedHeight) => async (dispatch) => {
  let votes;
  dispatch(setIsLoadingVotes(true));
  try {
    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      votes = await getKintsugiReferendumVotes(api, referendumIndex, passedHeight);
    } else {
      votes = await getReferendumVotes(api, referendumIndex, passedHeight)
    }

    dispatch(setVotes(votes));
  } finally {
    dispatch(setIsLoadingVotes(false));
  }
}

export default referendumSlice.reducer

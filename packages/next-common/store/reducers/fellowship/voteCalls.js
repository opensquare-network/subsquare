import { createSlice } from "@reduxjs/toolkit";
import { backendApi } from "../../../services/nextApi";
import { getFellowshipReferendumVoteCallsApi } from "../../../services/url";
import { emptyVotes } from "../../../utils/democracy/votes/passed/common";

const fellowshipVoteCallSlice = createSlice({
  name: "fellowshipVoteCalls",
  initialState: {
    isLoadingVoteCalls: true,
    voteCalls: emptyVotes,
  },
  reducers: {
    setIsLoadingVoteCalls(state, { payload }) {
      state.isLoadingVoteCalls = payload;
    },
    setVoteCalls(state, { payload }) {
      state.voteCalls = payload;
    },
  },
});

export const { setVoteCalls, setIsLoadingVoteCalls } =
  fellowshipVoteCallSlice.actions;

export const isLoadingVoteCallsSelector = (state) =>
  state.fellowshipVoteCalls.isLoadingVoteCalls;
export const voteCallsSelector = (state) => state.fellowshipVoteCalls.voteCalls;

export const clearVoteCalls = () => async (dispatch) => {
  dispatch(setVoteCalls(emptyVotes));
};

function classifyVoteCalls(voteCalls) {
  const allAye = [];
  const allNay = [];

  for (const item of voteCalls) {
    if (item.isAye) {
      allAye.push(item);
    } else {
      allNay.push(item);
    }
  }

  return { allAye, allNay };
}

export const fetchVoteCalls = (referendumIndex) => async (dispatch) => {
  dispatch(clearVoteCalls());
  dispatch(setIsLoadingVoteCalls(true));
  try {
    const { result } = await backendApi.fetch(
      getFellowshipReferendumVoteCallsApi(referendumIndex),
    );

    const { allAye, allNay } = classifyVoteCalls(result);

    dispatch(setVoteCalls({ allAye, allNay }));
  } finally {
    dispatch(setIsLoadingVoteCalls(false));
  }
};

export default fellowshipVoteCallSlice.reducer;

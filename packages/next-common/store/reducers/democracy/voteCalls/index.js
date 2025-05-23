import { createSlice } from "@reduxjs/toolkit";
import { backendApi } from "next-common/services/nextApi";
import { isKintsugiChain } from "next-common/utils/chain";
import { emptyVotes } from "next-common/utils/democracy/votes/passed/common";

const democracyVoteCallsSlice = createSlice({
  name: "democracyVoteCalls",
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

export const { setIsLoadingVoteCalls, setVoteCalls } =
  democracyVoteCallsSlice.actions;

export const isLoadingVoteCallsSelector = (state) =>
  state.democracyVoteCalls.isLoadingVoteCalls;
export const voteCallsSelector = (state) => state.democracyVoteCalls.voteCalls;

export const clearVoteCalls = () => async (dispatch) => {
  dispatch(setVoteCalls(emptyVotes));
};

function normalizeCall(voteExtrinsic, balance) {
  return {
    ...voteExtrinsic,
    vote: {
      balance,
      vote: {
        conviction: 0,
      },
    },
  };
}

function extractVoteElementsFromOneCall(voteExtrinsic) {
  if (isKintsugiChain(process.env.NEXT_PUBLIC_CHAIN)) {
    const isAye = voteExtrinsic.vote.isAye;
    if (isAye) {
      return { aye: voteExtrinsic };
    }
    return { nay: voteExtrinsic };
  }

  if (voteExtrinsic.isStandard) {
    if (voteExtrinsic.vote.vote.isAye) {
      return { aye: voteExtrinsic };
    }
    return { nay: voteExtrinsic };
  }

  if (voteExtrinsic.isSplit) {
    const aye = normalizeCall(voteExtrinsic, voteExtrinsic.vote.aye);
    const nay = normalizeCall(voteExtrinsic, voteExtrinsic.vote.nay);
    return { aye, nay };
  }

  return {};
}

function classifyVoteCalls(voteCalls) {
  const allAye = [];
  const allNay = [];

  for (const item of voteCalls) {
    const { aye, nay } = extractVoteElementsFromOneCall(item);

    if (aye) allAye.push(aye);
    if (nay) allNay.push(nay);
  }

  return { allAye, allNay };
}

export const fetchVoteCalls = (referendumIndex) => async (dispatch) => {
  dispatch(clearVoteCalls());
  dispatch(setIsLoadingVoteCalls(true));
  try {
    const { result } = await backendApi.fetch(
      `democracy/referendums/${referendumIndex}/vote-calls`,
    );

    const { allAye, allNay } = classifyVoteCalls(result);

    dispatch(setVoteCalls({ allAye, allNay }));
  } finally {
    dispatch(setIsLoadingVoteCalls(false));
  }
};

export default democracyVoteCallsSlice.reducer;

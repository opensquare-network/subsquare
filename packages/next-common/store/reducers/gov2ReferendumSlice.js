import { createSlice } from "@reduxjs/toolkit";
import { backendApi } from "../../services/nextApi";
import {
  gov2ReferendumsVoteCallsApi,
  gov2ReferendumsVoteExtrinsicsApi,
} from "../../services/url";
import { openGovEmptyVotes as emptyVotes } from "../../utils/democracy/votes/passed/common";

const gov2ReferendumSlice = createSlice({
  name: "gov2Referendum",
  initialState: {
    isLoadingVoteCalls: true,
    voteCalls: emptyVotes,
    issuance: null,
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
  gov2ReferendumSlice.actions;

export const isLoadingVoteCallsSelector = (state) =>
  state.gov2Referendum.isLoadingVoteCalls;
export const voteCallsSelector = (state) => state.gov2Referendum.voteCalls;

export const clearVoteCalls = () => async (dispatch) => {
  dispatch(setVoteCalls(emptyVotes));
};

function normalizeExtrinsic(voteExtrinsic, balance) {
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

function extractVoteElementsFromOneExtrinsic(voteExtrinsic) {
  if (voteExtrinsic.isStandard) {
    if (voteExtrinsic.vote.vote.isAye) {
      return { aye: voteExtrinsic };
    } else {
      return { nay: voteExtrinsic };
    }
  }

  if (voteExtrinsic.isSplit) {
    const aye = normalizeExtrinsic(voteExtrinsic, voteExtrinsic.vote.aye);
    const nay = normalizeExtrinsic(voteExtrinsic, voteExtrinsic.vote.nay);
    return { aye, nay };
  }

  if (voteExtrinsic.isSplitAbstain) {
    const aye = normalizeExtrinsic(voteExtrinsic, voteExtrinsic.vote.aye);
    const nay = normalizeExtrinsic(voteExtrinsic, voteExtrinsic.vote.nay);
    const abstain = normalizeExtrinsic(
      voteExtrinsic,
      voteExtrinsic.vote.abstain,
    );
    return { aye, nay, abstain };
  }

  return {};
}

export function classifyVoteCalls(voteCalls) {
  const allAye = [];
  const allNay = [];
  const allAbstain = [];

  for (const item of voteCalls) {
    const { aye, nay, abstain } = extractVoteElementsFromOneExtrinsic(item);

    if (aye) allAye.push(aye);
    if (nay) allNay.push(nay);
    if (abstain) allAbstain.push(abstain);
  }

  return { allAye, allNay, allAbstain };
}

export const fetchVoteExtrinsics = (referendumIndex) => async (dispatch) => {
  dispatch(clearVoteCalls());
  dispatch(setIsLoadingVoteCalls(true));
  try {
    const { result } = await backendApi.fetch(
      gov2ReferendumsVoteExtrinsicsApi(referendumIndex),
    );

    if (!result) {
      dispatch(setVoteCalls(emptyVotes));
      return;
    }

    const { allAye, allNay, allAbstain } = classifyVoteCalls(result);

    dispatch(setVoteCalls({ allAye, allNay, allAbstain }));
  } finally {
    dispatch(setIsLoadingVoteCalls(false));
  }
};

export const fetchVoteCalls = (referendumIndex) => async (dispatch) => {
  dispatch(clearVoteCalls());
  dispatch(setIsLoadingVoteCalls(true));
  try {
    const { result } = await backendApi.fetch(
      gov2ReferendumsVoteCallsApi(referendumIndex),
    );

    if (!result) {
      dispatch(setVoteCalls(emptyVotes));
      return;
    }

    const { allAye, allNay, allAbstain } = classifyVoteCalls(result);

    dispatch(setVoteCalls({ allAye, allNay, allAbstain }));
  } finally {
    dispatch(setIsLoadingVoteCalls(false));
  }
};

export default gov2ReferendumSlice.reducer;

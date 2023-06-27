import { createSlice } from "@reduxjs/toolkit";
import nextApi from "../../services/nextApi";
import {
  gov2ReferendumsVoteCallsApi,
  gov2ReferendumsVoteExtrinsicsApi,
} from "../../services/url";
import { openGovEmptyVotes as emptyVotes } from "../../utils/democracy/votes/passed/common";
import { getGov2ReferendumVotesFromVotingOf } from "../../utils/gov2/allVotes";
import Chains from "../../utils/consts/chains";
import getKintElectorate from "../../utils/democracy/electorate/kintsugi";
import queryActiveBalance from "../../utils/democracy/electorate/active";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const gov2ReferendumSlice = createSlice({
  name: "gov2Referendum",
  initialState: {
    isLoadingVotes: true,
    votes: emptyVotes,
    isLoadingVoteCalls: true,
    voteCalls: emptyVotes,
    issuance: null,
    votesTrigger: 1,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setVotes(state, { payload }) {
      state.votes = payload;
    },
    setIsLoadingVoteCalls(state, { payload }) {
      state.isLoadingVoteCalls = payload;
    },
    setVoteCalls(state, { payload }) {
      state.voteCalls = payload;
    },
    setIssuance(state, { payload }) {
      state.issuance = payload;
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
  setVotes,
  setIsLoadingVotes,
  setVoteCalls,
  setIsLoadingVoteCalls,
  setIssuance,
  incVotesTrigger,
  clearVotersTrigger,
} = gov2ReferendumSlice.actions;

export const isLoadingVotesSelector = (state) =>
  state.gov2Referendum.isLoadingVotes;
export const isLoadingVoteCallsSelector = (state) =>
  state.gov2Referendum.isLoadingVoteCalls;
export const votesSelector = (state) => state.gov2Referendum.votes;
export const voteCallsSelector = (state) =>
  state.gov2Referendum.voteCalls;
export const gov2IssuanceSelector = (state) => state.gov2Referendum.issuance;
export const votesTriggerSelector = state => state.gov2Referendum.votesTrigger;

export const clearVotes = () => async (dispatch) => {
  dispatch(setVotes(emptyVotes));
  dispatch(clearVotersTrigger());
};

export const triggerFetchVotes = () => async dispatch => dispatch(incVotesTrigger());

export const fetchVotes =
  (api, trackId, referendumIndex, passedHeight) => async (dispatch) => {
    try {
      let blockApi = api;
      if (passedHeight) {
        const blockHash = await api.rpc.chain.getBlockHash(passedHeight - 1);
        blockApi = await api.at(blockHash);
      }
      const votes = await getGov2ReferendumVotesFromVotingOf(
        blockApi,
        trackId,
        referendumIndex,
      );

      dispatch(setVotes(votes));
    } finally {
      dispatch(setIsLoadingVotes(false));
    }
  };

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

function classifyVoteCalls(voteCalls) {
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
    const { result } = await nextApi.fetch(
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
    const { result } = await nextApi.fetch(
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

export const fetchIssuanceForGov2 = (api, height) => async (dispatch) => {
  let issuance;
  if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
    issuance = await getKintElectorate(api, height);
  } else {
    issuance = await queryActiveBalance(api, height);
  }

  dispatch(setIssuance(issuance));
};

export const unsetIssuance = () => (dispatch) => {
  dispatch(setIssuance(null));
};

export default gov2ReferendumSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { emptyVotes } from "../../utils/democracy/votes/passed/common";
import getReferendumVotes from "../../utils/democracy/votes";
import Chains from "../../utils/consts/chains";
import getKintsugiReferendumVotes from "../../utils/democracy/votes/kintsugi";
import getKintElectorate from "../../utils/democracy/electorate/kintsugi";
import getElectorate from "../../utils/democracy/electorate";
import nextApi from "next-common/services/nextApi";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const referendumSlice = createSlice({
  name: "referendum",
  initialState: {
    isLoadingElectorate: false,
    electorate: 0,
    isLoadingVotes: true,
    votes: emptyVotes,
    referendumStatus: null,
    isLoadingReferendumStatus: false,
    isLoadingVoteCalls: true,
    voteCalls: emptyVotes,
    democracyVotesTrigger: 1,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setVotes(state, { payload }) {
      state.votes = payload;
    },
    setIsLoadingElectorate(state, { payload }) {
      state.isLoadingElectorate = payload;
    },
    setElectorate(state, { payload }) {
      state.electorate = payload;
    },
    setReferendumStatus(state, { payload }) {
      state.referendumStatus = payload;
    },
    setIsLoadingReferendumStatus(state, { payload }) {
      state.isLoadingReferendumStatus = payload;
    },
    setIsLoadingVoteCalls(state, { payload }) {
      state.isLoadingVoteCalls = payload;
    },
    setVoteCalls(state, { payload }) {
      state.voteCalls = payload;
    },
    incDemocracyVotesTrigger(state) {
      state.democracyVotesTrigger += 1;
    },
  },
});

export const {
  setVotes,
  setIsLoadingVotes,
  setElectorate,
  setIsLoadingElectorate,
  setReferendumStatus,
  setIsLoadingReferendumStatus,
  setVoteCalls,
  setIsLoadingVoteCalls,
  incDemocracyVotesTrigger,
} = referendumSlice.actions;

export const isLoadingElectorateSelector = (state) =>
  state.referendum.isLoadingElectorate;
export const electorateSelector = (state) => state.referendum.electorate;
export const isLoadingVotesSelector = (state) =>
  state.referendum.isLoadingVotes;
export const votesSelector = (state) => state.referendum.votes;
export const referendumStatusSelector = (state) =>
  state.referendum.referendumStatus;
export const isLoadingReferendumStatusSelector = (state) =>
  state.referendum.isLoadingReferendumStatus;
  export const isLoadingVoteCallsSelector = (state) =>
  state.referendum.isLoadingVoteCalls;
export const voteCallsSelector = (state) =>
  state.referendum.voteCalls;
export const democracyVotesTriggerSelector = state => state.referendum.democracyVotesTrigger;

export const triggerFetchDemocracyVotes = () => async dispatch => dispatch(incDemocracyVotesTrigger());

export const clearVotes = () => async (dispatch) => {
  dispatch(setVotes(emptyVotes));
};

export const fetchVotes =
  (api, referendumIndex, passedHeight) => async (dispatch) => {
    let votes;
    try {
      if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
        votes = await getKintsugiReferendumVotes(
          api,
          referendumIndex,
          passedHeight,
        );
      } else {
        votes = await getReferendumVotes(api, referendumIndex, passedHeight);
      }

      dispatch(setVotes(votes));
    } finally {
      dispatch(setIsLoadingVotes(false));
    }
  };

export const fetchElectorate =
  (api, height, possibleElectorate) => async (dispatch) => {
    if (possibleElectorate) {
      dispatch(setElectorate(possibleElectorate));
      return;
    }

    let electorate;
    dispatch(setIsLoadingElectorate(true));
    try {
      if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
        electorate = await getKintElectorate(api, height);
      } else {
        electorate = await getElectorate(api, height);
      }
      dispatch(setElectorate(electorate));
    } finally {
      dispatch(setIsLoadingElectorate(false));
    }
  };

export const fetchReferendumStatus =
  (api, referendumIndex) => async (dispatch) => {
    dispatch(setIsLoadingReferendumStatus(true));
    try {
      const referendumInfo = await api?.query.democracy?.referendumInfoOf(
        referendumIndex,
      );
      const data = referendumInfo?.toJSON();
      if (data?.ongoing) {
        dispatch(setReferendumStatus(data?.ongoing));
      }
    } finally {
      dispatch(setIsLoadingReferendumStatus(false));
    }
  };

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
    if (voteExtrinsic.isStandard) {
      if (voteExtrinsic.vote.vote.isAye) {
        return { aye: voteExtrinsic };
      } else {
        return { nay: voteExtrinsic };
      }
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
      const { result } = await nextApi.fetch(
        `democracy/referendums/${referendumIndex}/vote-calls`,
      );

      const { allAye, allNay } = classifyVoteCalls(result);

      dispatch(setVoteCalls({ allAye, allNay }));
    } finally {
      dispatch(setIsLoadingVoteCalls(false));
    }
  };

export default referendumSlice.reducer;

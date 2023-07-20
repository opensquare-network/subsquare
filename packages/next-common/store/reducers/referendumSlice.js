import { createSlice } from "@reduxjs/toolkit";
import { emptyVotes } from "../../utils/democracy/votes/passed/common";
import Chains from "../../utils/consts/chains";
import getKintElectorate from "../../utils/democracy/electorate/kintsugi";
import getElectorate from "../../utils/democracy/electorate";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const referendumSlice = createSlice({
  name: "referendum",
  initialState: {
    isLoadingElectorate: false,
    electorate: 0,
    isLoadingVotes: true,
    referendumStatus: null,
    isLoadingReferendumStatus: false,
    isLoadingVoteCalls: true,
    voteCalls: emptyVotes,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
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
  },
});

export const {
  setElectorate,
  setIsLoadingElectorate,
  setReferendumStatus,
  setIsLoadingReferendumStatus,
  setVoteCalls,
  setIsLoadingVoteCalls,
} = referendumSlice.actions;

export const isLoadingElectorateSelector = (state) =>
  state.referendum.isLoadingElectorate;
export const electorateSelector = (state) => state.referendum.electorate;
export const referendumStatusSelector = (state) =>
  state.referendum.referendumStatus;
export const isLoadingReferendumStatusSelector = (state) =>
  state.referendum.isLoadingReferendumStatus;

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

export default referendumSlice.reducer;

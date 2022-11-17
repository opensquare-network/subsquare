import { createSlice } from "@reduxjs/toolkit";
import { emptyVotes } from "../../utils/democracy/votes/passed/common";
import getReferendumVotes from "../../utils/democracy/votes";
import Chains from "../../utils/consts/chains";
import getKintsugiReferendumVotes from "../../utils/democracy/votes/kintsugi";
import getKintElectorate from "../../utils/democracy/electorate/kintsugi";
import getElectorate from "../../utils/democracy/electorate";

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
  },
});

export const {
  setVotes,
  setIsLoadingVotes,
  setElectorate,
  setIsLoadingElectorate,
  setReferendumStatus,
  setIsLoadingReferendumStatus,
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

export const clearVotes = () => async (dispatch) => {
  dispatch(setVotes(emptyVotes));
};

export const fetchVotes =
  (api, referendumIndex, passedHeight) => async (dispatch) => {
    let votes;
    dispatch(clearVotes());
    dispatch(setIsLoadingVotes(true));
    try {
      if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
        votes = await getKintsugiReferendumVotes(
          api,
          referendumIndex,
          passedHeight
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
      const referendumInfo = await api?.query.democracy.referendumInfoOf(
        referendumIndex
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

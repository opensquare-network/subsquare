import { createSelector, createSlice } from "@reduxjs/toolkit";

const name = "myReferendaVoting";

const myReferendaVotingSlice = createSlice({
  name,
  initialState: {
    voting: [],
    priors: [],
    delegations: [],
    isLoadingVoting: false,
    classLocks: [],
    isLoadingClassLocks: false,
    trigger: 0,
  },
  reducers: {
    setVoting(state, { payload }) {
      state.voting = payload;
    },
    setPriors(state, { payload }) {
      state.priors = payload;
    },
    setDelegations(state, { payload }) {
      state.delegations = payload;
    },
    setIsLoadingVoting(state, { payload }) {
      state.isLoadingVoting = payload;
    },
    setClassLocks(state, { payload }) {
      state.classLocks = payload;
    },
    setIsLoadingClassLocks(state, { payload }) {
      state.isLoadingClassLocks = payload;
    },
    incTrigger(state) {
      state.trigger += 1;
    },
  },
});

export const {
  setVoting: setMyReferendaVoting,
  setPriors: setMyReferendaPriors,
  setDelegations: setMyReferendaDelegations,
  setClassLocks: setMyReferendaClassLocks,
  setIsLoadingVoting: setIsLoadingReferendaVoting,
  setIsLoadingClassLocks,
  incTrigger: incMyReferendaVotesTrigger,
} = myReferendaVotingSlice.actions;

export const myReferendaVotingSelector = (state) => state[name].voting;
export const myReferendaTrackLocksSelector = (state) => state[name].classLocks;
export const isLoadingReferendaVotingSelector = (state) =>
  state[name].isLoadingVoting;
export const isLoadingClassLocksSelector = (state) =>
  state[name].isLoadingClassLocks;
export const myReferendaVotesTriggerSelector = (state) => state[name].trigger;
export const myReferendaPriorLocksSelector = (state) => state[name].priors;
export const myReferendaDelegationsSelector = (state) =>
  state[name].delegations;

export const isLoadingReferendaSummarySelector = createSelector(
  isLoadingReferendaVotingSelector,
  isLoadingClassLocksSelector,
  (isLoadingReferendaVoting, isLoadingClassLocks) => {
    return isLoadingReferendaVoting || isLoadingClassLocks;
  },
);

export default myReferendaVotingSlice.reducer;

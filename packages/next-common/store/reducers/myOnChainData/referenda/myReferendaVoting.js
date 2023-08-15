import { createSelector, createSlice } from "@reduxjs/toolkit";

const name = "myReferendaVoting";

const myReferendaVotingSlice = createSlice({
  name,
  initialState: {
    voting: [],
    isLoadingVoting: false,
    classLocks: [],
    isLoadingClassLocks: false,
  },
  reducers: {
    setVoting(state, { payload }) {
      state.voting = payload;
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
  },
});

export const {
  setVoting: setMyReferendaVoting,
  setClassLocks: setMyReferendaClassLocks,
  setIsLoadingVoting: setIsLoadingReferendaVoting,
  setIsLoadingClassLocks,
} = myReferendaVotingSlice.actions;

export const myReferendaVotingSelector = (state) => state[name].voting;
export const myReferendaTrackLocksSelector = (state) => state[name].classLocks;
export const isLoadingReferendaVotingSelector = (state) =>
  state[name].isLoadingVoting;
export const isLoadingClassLocksSelector = (state) =>
  state[name].isLoadingClassLocks;

export const isLoadingReferendaSummarySelector = createSelector(
  isLoadingReferendaVotingSelector,
  isLoadingClassLocksSelector,
  (isLoadingReferendaVoting, isLoadingClassLocks) => {
    return isLoadingReferendaVoting || isLoadingClassLocks;
  },
);

export default myReferendaVotingSlice.reducer;
